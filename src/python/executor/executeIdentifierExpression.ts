import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { IdentifierExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { translate } from "../translator";

export function executeIdentifierExpression(executor: Executor, expression: IdentifierExpression): EvaluationResult {
  const value = executor.environment.get(expression.name.lexeme);

  // Check if this is an external function name
  const externalFunction = executor.getExternalFunction(expression.name.lexeme);

  if (value === undefined && !externalFunction) {
    throw new RuntimeError(
      translate(`error.runtime.UndefinedVariable`, { name: expression.name.lexeme }),
      expression.location,
      "UndefinedVariable"
    );
  }

  // If it's an external function, mark it as such for CallExpression
  if (externalFunction) {
    return {
      type: "IdentifierExpression",
      name: expression.name.lexeme,
      functionName: expression.name.lexeme, // Mark as function name for CallExpression
      jikiObject: value || {
        type: "function",
        value: expression.name.lexeme,
        clone: () => ({ type: "function", value: expression.name.lexeme }),
      },
      immutableJikiObject: value?.clone() || {
        type: "function",
        value: expression.name.lexeme,
        clone: () => ({ type: "function", value: expression.name.lexeme }),
      },
    } as any;
  }

  return {
    type: "IdentifierExpression",
    name: expression.name.lexeme,
    jikiObject: value!,
    immutableJikiObject: value!.clone(),
  } as any;
}
