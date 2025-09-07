import type { Executor } from "../executor";
import type { AssignmentStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";

export function executeAssignmentStatement(executor: Executor, statement: AssignmentStatement): EvaluationResult {
  const value = executor.evaluate(statement.initializer);
  executor.environment.define(statement.name.lexeme, value.jikiObject);
  return {
    type: "AssignmentStatement",
    name: statement.name.lexeme,
    value: value,
    jikiObject: value.jikiObject,
  } as any;
}
