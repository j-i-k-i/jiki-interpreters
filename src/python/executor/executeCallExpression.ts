import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { CallExpression } from "../expression";
import type { EvaluationResult, EvaluationResultCallExpression } from "../evaluation-result";
import { createPyObject } from "../jikiObjects";
import type { JikiObject } from "../jikiObjects";
import type { Arity } from "../../shared/interfaces";
import { isCallable, type PyCallable } from "../functions";
import { LogicError } from "../error";

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

  // Type assertion since we know it's a PyCallable from our implementation
  const callable = calleeValue as PyCallable;

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

  // Call the function
  const executionContext = executor.getExecutionContext();

  try {
    // Convert JikiObjects to values for the function
    const argValues = argJikiObjects.map(arg => arg.value);
    const result = callable.call(executionContext, argValues);

    // Convert the result back to a PyObject
    const pyResult = createPyObject(result);

    return {
      type: "CallExpression",
      jikiObject: pyResult,
      immutableJikiObject: pyResult.clone(),
      functionName: callable.name,
      args: argResults, // Store full evaluation results for describers
    };
  } catch (error) {
    // Handle LogicError from custom functions
    if (error instanceof LogicError) {
      throw new RuntimeError(error.message, expression.location, "LogicErrorInExecution", { message: error.message });
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
