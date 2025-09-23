import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";

export function describeMemberExpression(
  expression: MemberExpression,
  result: EvaluationResultMemberExpression
): string {
  const jikiObject = result.immutableJikiObject || result.jikiObject;
  const objectValue = result.object.immutableJikiObject || result.object.jikiObject;
  const indexValue = result.property.immutableJikiObject || result.property.jikiObject;

  return `Accessed element at index ${indexValue.toString()} of the list, got ${jikiObject.toString()}`;
}
