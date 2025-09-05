import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJikiObject, type JikiObject } from "../jikiObjects";
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
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;

  switch (expression.operator.type) {
    case "PLUS":
      return createJikiObject(left + right);
    case "MINUS":
      return createJikiObject(left - right);
    case "STAR":
      return createJikiObject(left * right);
    case "SLASH":
      return createJikiObject(left / right);
    case "LOGICAL_AND":
      return createJikiObject(left && right);
    case "LOGICAL_OR":
      return createJikiObject(left || right);
    default:
      throw new RuntimeError(
        `Unsupported binary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidBinaryExpression"
      );
  }
}
