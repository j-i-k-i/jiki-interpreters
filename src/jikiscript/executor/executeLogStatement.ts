import type { Executor } from "../executor";
import type { LogStatement } from "../statement";
import type { EvaluationResultLogStatement } from "../evaluation-result";

export function executeLogStatement(executor: Executor, statement: LogStatement): void {
  executor.executeFrame<EvaluationResultLogStatement>(statement, () => {
    const value = executor.evaluate(statement.expression);
    return {
      type: "LogStatement",
      expression: value,
      jikiObject: value.jikiObject,
    };
  });
}
