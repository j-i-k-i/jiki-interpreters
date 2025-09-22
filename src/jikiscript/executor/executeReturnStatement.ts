import type { Executor } from "../executor";
import { ReturnValue } from "../functions";
import type { ReturnStatement } from "../statement";
import type { EvaluationResultReturnStatement } from "../evaluation-result";

export function executeReturnStatement(executor: Executor, statement: ReturnStatement): void {
  const evaluationResult = executor.executeFrame<EvaluationResultReturnStatement>(statement, () => {
    if (statement.expression === null) {
      return {
        type: "ReturnStatement",
        jikiObject: undefined,
      };
    }

    const value = executor.evaluate(statement.expression);
    return {
      type: "ReturnStatement",
      expression: value,
      jikiObject: value.jikiObject,
      immutableJikiObject: value.jikiObject?.clone(),
    };
  });
  throw new ReturnValue(evaluationResult?.jikiObject, statement.location);
}
