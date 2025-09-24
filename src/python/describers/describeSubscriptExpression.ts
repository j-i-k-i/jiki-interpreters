import type { SubscriptExpression } from "../expression";
import type { EvaluationResultSubscriptExpression } from "../evaluation-result";
import { PyNumber } from "../jikiObjects";

export function describeSubscriptExpression(
  expression: SubscriptExpression,
  result: EvaluationResultSubscriptExpression
): string[] {
  const objectDesc = result.object.jikiObject.toString();

  // Special case for integer indices (most common)
  if (result.index.jikiObject instanceof PyNumber && result.index.jikiObject.isInteger()) {
    const index = result.index.jikiObject.value;
    const elementDesc = result.jikiObject.toString();

    if (index < 0) {
      return [`Access element at index ${index} (counting from the end) of ${objectDesc} to get ${elementDesc}`];
    } else {
      return [`Access element at index ${index} of ${objectDesc} to get ${elementDesc}`];
    }
  }

  // General case for expression indices
  const indexDesc = result.index.jikiObject.toString();
  const elementDesc = result.jikiObject.toString();
  return [`Access element at index ${indexDesc} of ${objectDesc} to get ${elementDesc}`];
}
