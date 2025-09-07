import { EvaluationResultUnaryExpression } from "../evaluation-result";
import { UnaryExpression } from "../expression";
import { DescriptionContext } from "../../shared/frames";
import { codeTag, formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";
import * as JS from "../jikiObjects";

export function describeUnaryExpression(
  expression: UnaryExpression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
) {
  if (expression.operator.type == "NOT") {
    return describeNotExpression(expression, result, context);
  }
  if (expression.operator.type == "MINUS") {
    return describeMinusExpression(expression, result, context);
  }
  return [];
}

function describeNotExpression(
  expression: UnaryExpression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
) {
  const resBool = result.operand.jikiObject as JS.JSBoolean;
  let steps = describeExpression(expression.operand, result.operand, context);
  steps = [
    ...steps,
    `<li>JavaScript evaluated that ${codeTag(
      `!${resBool}`,
      expression.operand.location
    )} is ${codeTag(result.jikiObject, expression.location)}.</li>`,
  ];
  return steps;
}

function describeMinusExpression(
  expression: UnaryExpression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
) {
  // If this is a negative number, there's no steps to show.
  if (expression.operand.type == "LiteralExpression") {
    return [];
  }
  const resNum = result.operand.jikiObject as JS.JSNumber;
  let steps = describeExpression(expression.operand, result.operand, context);
  steps = [
    ...steps,
    `<li>JavaScript evaluated that ${codeTag(
      `-${resNum}`,
      expression.operand.location
    )} is ${codeTag(result.jikiObject, expression.location)}.</li>`,
  ];
  return steps;
}
