import type { Executor } from "../executor";
import type { UnaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createPyObject, PyBoolean } from "../pyObjects";
import { RuntimeError } from "../executor";

export function executeUnaryExpression(executor: Executor, expression: UnaryExpression): EvaluationResult {
  const rightResult = executor.evaluate(expression.operand);

  const result = handleUnaryOperation(executor, expression, rightResult);

  return {
    type: "UnaryExpression",
    right: rightResult,
    jikiObject: result,
    pyObject: result,
  } as any;
}

function handleUnaryOperation(executor: Executor, expression: UnaryExpression, rightResult: EvaluationResult): any {
  const right = rightResult.pyObject.value;

  switch (expression.operator.type) {
    case "MINUS":
      return createPyObject(-right);
    case "NOT":
      return new PyBoolean(!right);
    default:
      throw new RuntimeError(
        `Unsupported unary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidUnaryExpression"
      );
  }
}
