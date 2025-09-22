import type { Executor } from "../executor";
import type { MethodCallStatement } from "../statement";
import type { EvaluationResultMethodCallStatement, EvaluationResultMethodCallExpression } from "../evaluation-result";

export function executeMethodCallStatement(executor: Executor, statement: MethodCallStatement): void {
  executor.executeFrame<EvaluationResultMethodCallStatement>(statement, () => {
    const result = executor.visitMethodCallExpression(statement.expression) as EvaluationResultMethodCallExpression;

    return {
      type: "MethodCallStatement",
      jikiObject: result.jikiObject,
      immutableJikiObject: result.jikiObject?.clone(),
      expression: result,
    };
  });
}
