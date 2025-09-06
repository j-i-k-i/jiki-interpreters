import type { Executor } from "../executor";
import type { ThisExpression } from "../expression";
import type { EvaluationResultThisExpression } from "../evaluation-result";

export function executeThisExpression(executor: Executor, expression: ThisExpression): EvaluationResultThisExpression {
  if (!executor.contextualThis) {
    executor.error("ThisUsedOutsideOfMethod", expression.location);
  }

  return {
    type: "ThisExpression",
    jikiObject: executor.contextualThis,
  };
}
