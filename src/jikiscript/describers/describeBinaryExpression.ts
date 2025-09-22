import { EvaluationResultBinaryExpression } from "../evaluation-result";
import { BinaryExpression } from "../expression";
import { DescriptionContext } from "../../shared/frames";
import { codeTag, formatJikiObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeBinaryExpression(
  expression: BinaryExpression,
  result: EvaluationResultBinaryExpression,
  context: DescriptionContext
) {
  const leftSteps = describeExpression(expression.left, result.left, context);
  const rightSteps = describeExpression(expression.right, result.right, context);

  const leftRes = formatJikiObject(result.left.immutableJikiObject || result.left.jikiObject);
  const op = expression.operator.lexeme;
  const rightRes = formatJikiObject(result.right.immutableJikiObject || result.right.jikiObject);

  const finalStep = `<li>Jiki evaluated ${codeTag(
    `${leftRes} ${op} ${rightRes}`,
    expression.location
  )} and determined it was ${codeTag(result.immutableJikiObject, expression.location)}.</li>`;
  return [...leftSteps, ...rightSteps, finalStep];
}
