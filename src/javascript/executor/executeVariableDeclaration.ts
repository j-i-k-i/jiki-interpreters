import type { Executor } from "../executor";
import type { VariableDeclaration } from "../statement";
import type { EvaluationResult } from "../evaluation-result";

export function executeVariableDeclaration(executor: Executor, statement: VariableDeclaration): EvaluationResult {
  // Check for shadowing if allowShadowing is disabled
  if (!executor.languageFeatures.allowShadowing) {
    if (executor.environment.isDefinedInEnclosingScope(statement.name.lexeme)) {
      executor.error("ShadowingDisabled", statement.name.location, {
        name: statement.name.lexeme,
      });
    }
  }

  const value = executor.evaluate(statement.initializer);
  executor.environment.define(statement.name.lexeme, value.jikiObject);
  return {
    type: "VariableDeclaration",
    name: statement.name.lexeme,
    value: value,
    jikiObject: value.jikiObject,
  } as any;
}
