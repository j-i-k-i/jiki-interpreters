import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJSObject, type JikiObject } from "../jsObjects";
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
    jsObject: result,
  } as any;
}

function handleBinaryOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResult,
  rightResult: EvaluationResult
): JikiObject {
  const left = leftResult.jsObject.value;
  const right = rightResult.jsObject.value;

  switch (expression.operator.type) {
    case "PLUS":
      return createJSObject(left + right);
    case "MINUS":
      return createJSObject(left - right);
    case "STAR":
      return createJSObject(left * right);
    case "SLASH":
      return createJSObject(left / right);
    case "LOGICAL_AND":
      return createJSObject(left && right);
    case "LOGICAL_OR":
      return createJSObject(left || right);
    default:
      throw new RuntimeError(
        `Unsupported binary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidBinaryExpression"
      );
  }
}
