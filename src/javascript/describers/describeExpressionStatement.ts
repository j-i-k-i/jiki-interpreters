import { EvaluationResultExpressionStatement } from "../evaluation-result";
import { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import { formatJSObject } from "../helpers";
import { ExpressionStatement } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeExpressionStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const expressionStatement = frame.context as ExpressionStatement;
  const frameResult = frame.result as EvaluationResultExpressionStatement;
  const value = formatJSObject(frameResult.jsObject);

  const result = `<p>This expression evaluated to <code>${value}</code>.</p>`;
  let steps = describeExpression(expressionStatement.expression, frameResult.expression, context);
  steps = [...steps, `<li>JavaScript evaluated this expression and got <code>${value}</code>.</li>`];

  return {
    result,
    steps,
  };
}
