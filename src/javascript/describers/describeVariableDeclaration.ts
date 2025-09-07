import { EvaluationResultVariableDeclaration } from "../evaluation-result";
import { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import { formatJSObject } from "../helpers";
import { VariableDeclaration } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeVariableDeclaration(frame: FrameWithResult, context: DescriptionContext): Description {
  const variableDeclaration = frame.context as VariableDeclaration;
  const frameResult = frame.result as EvaluationResultVariableDeclaration;
  const value = formatJSObject(frameResult.jikiObject);
  const name = variableDeclaration.name.lexeme;

  const result = `<p>Declared variable <code>${name}</code> and set it to <code>${value}</code>.</p>`;
  let steps = describeExpression(variableDeclaration.initializer, frameResult.value, context);
  steps = [
    ...steps,
    `<li>JavaScript created variable <code>${name}</code> and assigned it the value <code>${value}</code>.</li>`,
  ];

  return {
    result,
    steps,
  };
}
