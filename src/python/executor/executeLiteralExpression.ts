import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createPyObject } from "../pyObjects";

export function executeLiteralExpression(executor: Executor, expression: LiteralExpression): EvaluationResult {
  const pyObject = createPyObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject: pyObject,
    pyObject: pyObject,
  };
}
