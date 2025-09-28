import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { CallExpression } from "../expression";
import type {
  EvaluationResult,
  EvaluationResultIdentifierExpression,
  EvaluationResultCallExpression,
} from "../evaluation-result";
import { createPyObject } from "../jikiObjects";
import type { JikiObject } from "../jikiObjects";
import type { Arity } from "../../shared/interfaces";

export function executeCallExpression(executor: Executor, expression: CallExpression): EvaluationResultCallExpression {
  // Evaluate the callee
  const calleeResult = executor.evaluate(expression.callee);

  // For now, we only support calling external functions by identifier
  // Check if the result is an identifier with a function name
  const identifierResult = calleeResult as EvaluationResultIdentifierExpression;
  if (!identifierResult.functionName) {
    throw new RuntimeError(`TypeError: ${expression.callee.type} is not callable`, expression.location, "TypeError", {
      callee: expression.callee.type,
    });
  }

  // Look up the external function
  const externalFunction = executor.getExternalFunction(identifierResult.functionName);
  if (!externalFunction) {
    throw new RuntimeError(
      `FunctionNotFound: name: ${identifierResult.functionName}`,
      expression.location,
      "FunctionNotFound",
      { name: identifierResult.functionName }
    );
  }

  // Evaluate arguments and store both the results and JikiObjects
  const argResults: EvaluationResult[] = [];
  const argJikiObjects: JikiObject[] = [];
  for (const arg of expression.args) {
    const argResult = executor.evaluate(arg);
    argResults.push(argResult);
    argJikiObjects.push(argResult.jikiObject);
  }

  // Check arity
  checkArity(executor, externalFunction.arity, argJikiObjects.length, expression, identifierResult.functionName);

  // Call the external function
  // External functions receive ExecutionContext as first parameter, then the arguments
  const executionContext = executor.getExecutionContext();

  try {
    // Convert JikiObjects to values for the external function
    const argValues = argJikiObjects.map(arg => arg.value);
    const result = externalFunction.func(executionContext, ...argValues);

    // Convert the result back to a PyObject
    const pyResult = createPyObject(result);

    return {
      type: "CallExpression",
      jikiObject: pyResult,
      immutableJikiObject: pyResult.clone(),
      functionName: identifierResult.functionName,
      args: argResults, // Store full evaluation results for describers
    };
  } catch (error) {
    // Handle any errors from the external function
    if (error instanceof Error) {
      throw new RuntimeError(
        `FunctionExecutionError: function: ${identifierResult.functionName}: message: ${error.message}`,
        expression.location,
        "TypeError",
        { function: identifierResult.functionName, message: error.message }
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
