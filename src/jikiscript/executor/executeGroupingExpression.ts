import type { Executor } from "../executor";
import type { GroupingExpression } from "../expression";
import type { EvaluationResultGroupingExpression } from "../evaluation-result";

export function executeGroupingExpression(
  executor: Executor,
  expression: GroupingExpression
): EvaluationResultGroupingExpression {
  const inner = executor.evaluate(expression.inner);

  return {
    type: "GroupingExpression",
    jikiObject: inner.jikiObject,
    immutableJikiObject: inner.jikiObject?.clone(),
    inner,
  };
}
