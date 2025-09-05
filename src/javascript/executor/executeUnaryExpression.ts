import type { Executor } from "../executor";
import type { UnaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJikiObject, type JikiObject } from "../jikiObjects";
import { RuntimeError } from "../executor";

export function executeUnaryExpression(executor: Executor, expression: UnaryExpression): EvaluationResult {
  const operandResult = executor.evaluate(expression.operand);

  const result = handleUnaryOperation(executor, expression, operandResult);

  return {
    type: "UnaryExpression",
    jikiObject: result,
  };
}

function handleUnaryOperation(
  executor: Executor,
  expression: UnaryExpression,
  operandResult: EvaluationResult
): JikiObject {
  const operand = operandResult.jikiObject.value;

  switch (expression.operator.type) {
    case "MINUS":
      return createJikiObject(-operand);
    case "PLUS":
      return createJikiObject(+operand);
    default:
      throw new RuntimeError(
        `Unsupported unary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidUnaryExpression"
      );
  }
}
