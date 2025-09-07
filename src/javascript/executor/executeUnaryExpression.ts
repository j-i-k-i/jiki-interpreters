import type { Executor } from "../executor";
import type { UnaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJSObject, type JikiObject } from "../jikiObjects";
import { RuntimeError } from "../executor";

export function executeUnaryExpression(executor: Executor, expression: UnaryExpression): EvaluationResult {
  const operandResult = executor.evaluate(expression.operand);

  const result = handleUnaryOperation(executor, expression, operandResult);

  return {
    type: "UnaryExpression",
    operand: operandResult,
    jikiObject: result,
  } as any;
}

function handleUnaryOperation(
  executor: Executor,
  expression: UnaryExpression,
  operandResult: EvaluationResult
): JikiObject {
  const operand = operandResult.jikiObject.value;

  switch (expression.operator.type) {
    case "MINUS":
      return createJSObject(-operand);
    case "PLUS":
      return createJSObject(+operand);
    case "NOT":
      return createJSObject(!operand);
    default:
      throw new RuntimeError(
        `Unsupported unary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidUnaryExpression"
      );
  }
}
