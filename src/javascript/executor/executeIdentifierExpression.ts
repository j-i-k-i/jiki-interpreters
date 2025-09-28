import type { Executor } from "../executor";
import type { IdentifierExpression } from "../expression";
import type { EvaluationResultIdentifierExpression } from "../evaluation-result";
import { JSBoolean } from "../jsObjects";

export function executeIdentifierExpression(
  executor: Executor,
  expression: IdentifierExpression
): EvaluationResultIdentifierExpression {
  // First check if it's a variable
  const value = executor.environment.get(expression.name.lexeme);

  if (value !== undefined) {
    return {
      type: "IdentifierExpression",
      name: expression.name.lexeme,
      jikiObject: value,
      immutableJikiObject: value.clone(),
    };
  }

  // Then check if it's an external function
  const externalFunction = executor.getExternalFunction(expression.name.lexeme);
  if (externalFunction !== undefined) {
    // For function identifiers, we return a special result with functionName
    // The actual jikiObject is a placeholder since functions aren't values yet
    const placeholder = new JSBoolean(true);
    return {
      type: "IdentifierExpression",
      name: expression.name.lexeme,
      jikiObject: placeholder,
      immutableJikiObject: placeholder,
      functionName: expression.name.lexeme, // Add function name for call expression
    };
  }

  // Neither variable nor function found
  executor.error("VariableNotDeclared", expression.location, { name: expression.name.lexeme });
}
