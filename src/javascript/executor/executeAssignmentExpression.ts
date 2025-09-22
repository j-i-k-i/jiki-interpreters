import type { Executor } from "../executor";
import type { AssignmentExpression } from "../expression";
import type { EvaluationResultAssignmentExpression } from "../evaluation-result";

export function executeAssignmentExpression(
  executor: Executor,
  expression: AssignmentExpression
): EvaluationResultAssignmentExpression {
  const valueResult = executor.evaluate(expression.value);

  // Check if variable exists before assignment
  const success = executor.environment.update(expression.name.lexeme, valueResult.jikiObject);

  if (!success) {
    executor.error("VariableNotDeclared", expression.name.location, {
      name: expression.name.lexeme,
    });
  }

  return {
    type: "AssignmentExpression",
    name: expression.name.lexeme,
    value: valueResult,
    jikiObject: valueResult.jikiObject,
    immutableJikiObject: valueResult.jikiObject.clone(),
  };
}
