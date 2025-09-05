import type { Executor } from "../executor";
import type { GroupingExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";

export function executeGroupingExpression(executor: Executor, expression: GroupingExpression): EvaluationResult {
  // Grouping expressions simply evaluate their inner expression
  return executor.evaluate(expression.inner);
}
