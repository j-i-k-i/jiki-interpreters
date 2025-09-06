import type { Executor } from "../executor";
import type { VariableDeclaration } from "../statement";
import type { EvaluationResult } from "../evaluation-result";

export function executeVariableDeclaration(executor: Executor, statement: VariableDeclaration): EvaluationResult {
  const value = executor.evaluate(statement.initializer);
  executor.environment.define(statement.name.lexeme, value.jikiObject);
  return {
    type: "VariableDeclaration",
    name: statement.name.lexeme,
    value: value,
    jikiObject: value.jikiObject,
    jsObject: value.jsObject,
  } as any;
}
