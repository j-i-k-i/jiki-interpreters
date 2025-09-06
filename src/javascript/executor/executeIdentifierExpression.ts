import type { Executor } from "../executor";
import type { IdentifierExpression } from "../expression";
import type { EvaluationResultIdentifierExpression } from "../evaluation-result";

export function executeIdentifierExpression(
  executor: Executor,
  expression: IdentifierExpression
): EvaluationResultIdentifierExpression {
  const value = executor.environment.get(expression.name.lexeme);

  if (value === undefined) {
    throw new Error(`Undefined variable '${expression.name.lexeme}'`);
  }

  return {
    type: "IdentifierExpression",
    name: expression.name.lexeme,
    jikiObject: value,
    jsObject: value,
  };
}
