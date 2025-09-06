import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { IdentifierExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { translate } from "../translator";

export function executeIdentifierExpression(executor: Executor, expression: IdentifierExpression): EvaluationResult {
  const value = executor.environment.get(expression.name.lexeme);

  if (value === undefined) {
    throw new RuntimeError(
      translate(`error.runtime.UndefinedVariable`, { name: expression.name.lexeme }),
      expression.location,
      "UndefinedVariable"
    );
  }

  return {
    type: "IdentifierExpression",
    name: expression.name.lexeme,
    jikiObject: value,
    pyObject: value,
  } as any;
}
