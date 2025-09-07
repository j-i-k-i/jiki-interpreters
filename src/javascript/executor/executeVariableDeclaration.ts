import type { Executor } from "../executor";
import type { VariableDeclaration } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { JSUndefined } from "../jikiObjects";

export function executeVariableDeclaration(executor: Executor, statement: VariableDeclaration): EvaluationResult {
  // Check for shadowing if allowShadowing is disabled
  if (!executor.languageFeatures.allowShadowing) {
    if (executor.environment.isDefinedInEnclosingScope(statement.name.lexeme)) {
      executor.error("ShadowingDisabled", statement.name.location, {
        name: statement.name.lexeme,
      });
    }
  }

  let value: EvaluationResult;
  let jikiObject;

  if (statement.initializer) {
    value = executor.evaluate(statement.initializer);
    jikiObject = value.jikiObject;
  } else {
    // No initializer - variable is undefined
    jikiObject = new JSUndefined();
    value = {
      type: "Literal",
      value: undefined,
      jikiObject: jikiObject,
    } as any;
  }

  executor.environment.define(statement.name.lexeme, jikiObject);
  return {
    type: "VariableDeclaration",
    name: statement.name.lexeme,
    value: value,
    jikiObject: jikiObject,
  } as any;
}
