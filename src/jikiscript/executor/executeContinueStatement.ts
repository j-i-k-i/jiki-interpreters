import type { Executor } from "../executor";
import type { ContinueStatement } from "../statement";
import type { EvaluationResultContinueStatement } from "../evaluation-result";

export class ContinueFlowControlError extends Error {
  constructor(
    public location: import("../location").Location,
    public lexeme: String
  ) {
    super();
  }
}

export function executeContinueStatement(executor: Executor, statement: ContinueStatement): void {
  executor.executeFrame<EvaluationResultContinueStatement>(statement, () => {
    return {
      type: "ContinueStatement",
    };
  });

  throw new ContinueFlowControlError(statement.location, statement.keyword.lexeme);
}
