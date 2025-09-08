import type { UpdateExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { codeTag } from "../helpers";

export function describeUpdateExpression(expression: UpdateExpression, result: EvaluationResult): string {
  const varName = codeTag(expression.operand.name.lexeme, expression.operand.location);
  const operator = expression.operator.type === "INCREMENT" ? "incremented" : "decremented";
  const oldValue = expression.prefix
    ? result.jikiObject.value - (expression.operator.type === "INCREMENT" ? 1 : -1)
    : result.jikiObject.value;
  const newValue = expression.prefix
    ? result.jikiObject.value
    : result.jikiObject.value + (expression.operator.type === "INCREMENT" ? 1 : -1);

  if (expression.prefix) {
    return `The variable ${varName} was ${operator} from ${codeTag(oldValue, expression.location)} to ${codeTag(newValue, expression.location)}. The expression evaluated to ${codeTag(newValue, expression.location)}.`;
  } else {
    return `The variable ${varName} was ${operator} from ${codeTag(oldValue, expression.location)} to ${codeTag(newValue, expression.location)}. The expression evaluated to ${codeTag(oldValue, expression.location)} (the value before the update).`;
  }
}
