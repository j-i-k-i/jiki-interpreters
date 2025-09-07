import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createPyObject, type JikiObject, PyBoolean } from "../jikiObjects";
import { RuntimeError } from "../executor";

export function executeBinaryExpression(executor: Executor, expression: BinaryExpression): EvaluationResult {
  const leftResult = executor.evaluate(expression.left);
  const rightResult = executor.evaluate(expression.right);

  const result = handleBinaryOperation(executor, expression, leftResult, rightResult);

  return {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: result,
  } as any;
}

function handleBinaryOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResult,
  rightResult: EvaluationResult
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;

  switch (expression.operator.type) {
    // Arithmetic operations
    case "PLUS":
      return createPyObject(left + right);
    case "MINUS":
      return createPyObject(left - right);
    case "STAR":
      return createPyObject(left * right);
    case "SLASH":
      return createPyObject(left / right);
    case "DOUBLE_SLASH":
      // Floor division in Python
      return createPyObject(Math.floor(left / right));
    case "PERCENT":
      return createPyObject(left % right);
    case "DOUBLE_STAR":
      // Power operator in Python
      return createPyObject(Math.pow(left, right));

    // Comparison operations
    case "GREATER":
      return new PyBoolean(left > right);
    case "GREATER_EQUAL":
      return new PyBoolean(left >= right);
    case "LESS":
      return new PyBoolean(left < right);
    case "LESS_EQUAL":
      return new PyBoolean(left <= right);
    case "EQUAL_EQUAL":
      return new PyBoolean(left === right);
    case "NOT_EQUAL":
      return new PyBoolean(left !== right);

    // Logical operations
    case "AND":
      // Python's 'and' operator returns the first falsy value or the last value
      // For now, we'll return a boolean
      return new PyBoolean(left && right);
    case "OR":
      // Python's 'or' operator returns the first truthy value or the last value
      // For now, we'll return a boolean
      return new PyBoolean(left || right);

    default:
      throw new RuntimeError(
        `Unsupported binary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidBinaryExpression"
      );
  }
}
