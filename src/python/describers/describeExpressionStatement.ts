import { EvaluationResultExpressionStatement } from "../evaluation-result";
import { Description, DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import { ExpressionStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { FrameWithResult } from "../frameDescribers";

export function describeExpressionStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as ExpressionStatement;
  const frameResult = frame.result as EvaluationResultExpressionStatement;
  const value = formatPyObject(frameResult.immutableJikiObject!);

  const result = `<p>This expression evaluated to <code>${value}</code>.</p>`;
  let steps = describeExpression(statement.expression, frameResult.expression, context);
  steps = [...steps, `<li>Python evaluated this expression and got <code>${value}</code>.</li>`];

  return {
    result,
    steps,
  };
}
