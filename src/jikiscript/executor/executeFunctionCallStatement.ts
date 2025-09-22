import type { Executor } from "../executor";
import type { FunctionCallStatement } from "../statement";
import type {
  EvaluationResultFunctionCallStatement,
  EvaluationResultFunctionCallExpression,
} from "../evaluation-result";

export function executeFunctionCallStatement(executor: Executor, statement: FunctionCallStatement): void {
  executor.executeFrame<EvaluationResultFunctionCallStatement>(statement, () => {
    const result = executor.visitFunctionCallExpression(statement.expression) as EvaluationResultFunctionCallExpression;

    return {
      type: "FunctionCallStatement",
      jikiObject: result.jikiObject,
      immutableJikiObject: result.jikiObject?.clone(),
      expression: result,
    };
  });
}
