import type { Executor } from "../executor";
import type { ExpressionStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";

export function executeExpressionStatement(executor: Executor, statement: ExpressionStatement): EvaluationResult {
  const expressionResult = executor.evaluate(statement.expression);
  return {
    type: "ExpressionStatement",
    expression: expressionResult,
    jikiObject: expressionResult.jikiObject,
    jsObject: expressionResult.jsObject,
  } as any;
}
