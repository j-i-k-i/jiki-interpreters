import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { CallExpression } from "../expression";
import type { EvaluationResult, EvaluationResultCallExpression } from "../evaluation-result";
import { createJSObject, type JikiObject } from "../jikiObjects";
import type { Arity } from "../../shared/interfaces";
import { isCallable, type JSCallable, JSUserDefinedFunction, ReturnValue } from "../functions";
import { LogicError } from "../error";
import { Environment } from "../environment";

export function executeCallExpression(executor: Executor, expression: CallExpression): EvaluationResultCallExpression {
  // Evaluate the callee
  const calleeResult = executor.evaluate(expression.callee);
  const calleeValue = calleeResult.jikiObject;

  // Check if the value is callable
  if (!isCallable(calleeValue)) {
    throw new RuntimeError(`TypeError: ${expression.callee.type} is not callable`, expression.location, "TypeError", {
      callee: expression.callee.type,
    });
  }

  // Type assertion since we know it's a JSCallable from our implementation
  const callable = calleeValue as JSCallable;

  // Evaluate arguments and store both the results and JikiObjects
  const argResults: EvaluationResult[] = [];
  const argJikiObjects: JikiObject[] = [];
  for (const arg of expression.args) {
    const argResult = executor.evaluate(arg);
    argResults.push(argResult);
    argJikiObjects.push(argResult.jikiObject);
  }

  // Check arity
  checkArity(executor, callable.arity, argJikiObjects.length, expression, callable.name);

  // Handle user-defined functions differently from external functions
  if (callable instanceof JSUserDefinedFunction) {
    const declaration = callable.getDeclaration();
    // Create new environment with current environment as parent for closure access
    const environment = new Environment(executor.languageFeatures, executor.environment);

    // Bind parameters (shadowing check is now handled inside environment.define())
    for (let i = 0; i < declaration.parameters.length; i++) {
      environment.define(
        declaration.parameters[i].name.lexeme,
        argJikiObjects[i],
        declaration.parameters[i].name.location
      );
    }

    // Execute function body in new environment
    try {
      executor.executeBlock(declaration.body, environment);
      // No return statement - return undefined
      const jikiResult = createJSObject(undefined);
      return {
        type: "CallExpression",
        jikiObject: jikiResult,
        immutableJikiObject: jikiResult.clone(),
        functionName: callable.name,
        args: argResults,
      };
    } catch (error) {
      if (error instanceof ReturnValue) {
        // Function returned a value (error.value is already a JikiObject or undefined)
        const jikiResult = error.value ?? createJSObject(undefined);
        return {
          type: "CallExpression",
          jikiObject: jikiResult,
          immutableJikiObject: jikiResult.clone(),
          functionName: callable.name,
          args: argResults,
        };
      }
      // Re-throw other errors
      throw error;
    }
  }

  // Handle external functions
  const executionContext = executor.getExecutionContext();

  try {
    // Convert JikiObjects to values for the function
    const argValues = argJikiObjects.map(arg => arg.value);
    const result = callable.call(executionContext, argValues);

    // Convert the result back to a JikiObject
    const jikiResult = createJSObject(result);

    return {
      type: "CallExpression",
      jikiObject: jikiResult,
      immutableJikiObject: jikiResult.clone(),
      functionName: callable.name,
      args: argResults, // Store full evaluation results for describers
    };
  } catch (error) {
    // Handle LogicError from custom functions
    if (error instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: error.message });
    }
    // Handle any other errors from the external function
    if (error instanceof Error) {
      throw new RuntimeError(
        `FunctionExecutionError: function: ${callable.name}: message: ${error.message}`,
        expression.location,
        "FunctionExecutionError",
        { function: callable.name, message: error.message }
      );
    }
    throw error;
  }
}

function checkArity(
  executor: Executor,
  arity: Arity | undefined,
  argCount: number,
  expression: CallExpression,
  functionName: string
): void {
  if (!arity) {
    // If arity is not specified, accept any number of arguments
    return;
  }

  const [minArity, maxArity] = typeof arity === "number" ? [arity, arity] : arity;

  if (argCount < minArity || argCount > maxArity) {
    const arityMessage =
      minArity === maxArity
        ? `${minArity}`
        : maxArity === Infinity
          ? `at least ${minArity}`
          : `between ${minArity} and ${maxArity}`;

    throw new RuntimeError(
      `InvalidNumberOfArguments: function: ${functionName}: expected: ${arityMessage}: got: ${argCount}`,
      expression.location,
      "InvalidNumberOfArguments",
      {
        function: functionName,
        expected: arityMessage,
        got: argCount,
      }
    );
  }
}
