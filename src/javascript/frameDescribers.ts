import type { Frame, DescriptionContext, Description } from "../shared/frames";
import type {
  EvaluationResult,
  EvaluationResultExpressionStatement,
  EvaluationResultVariableDeclaration,
  EvaluationResultIfStatement,
} from "./evaluation-result";
import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { describeExpressionStatement } from "./describers/describeExpressionStatement";
import { describeVariableDeclaration } from "./describers/describeVariableDeclaration";
import { describeBlockStatement } from "./describers/describeBlockStatement";
import { describeIfStatement } from "./describers/describeIfStatement";

// JavaScript-specific frame extending the shared base
export interface JavaScriptFrame extends Frame {
  result?: EvaluationResult;
  context?: Statement | Expression;
}

export type FrameWithResult = JavaScriptFrame & { result: EvaluationResult };

function isFrameWithResult(frame: JavaScriptFrame): frame is FrameWithResult {
  return !!frame.result;
}

const defaultMessage = `<p>There is no information available for this line. Show us your code in Discord and we'll improve this!</p>`;

export function describeFrame(frame: JavaScriptFrame, context?: DescriptionContext): string {
  if (!isFrameWithResult(frame)) {
    return defaultMessage;
  }
  if (context == null) {
    context = { functionDescriptions: {} };
  }

  let description: Description | null = null;
  try {
    description = generateDescription(frame, context);
  } catch (e) {
    if (process.env.NODE_ENV != "production") {
      throw e;
    }
    return defaultMessage;
  }
  if (description == null) {
    return defaultMessage;
  }

  return `
  <h3>What happened</h3>
  ${description.result}
  <hr/>
  <h3>Steps JavaScript Took</h3>
  <ul>
    ${description.steps.join("\n")}
  </ul>
  `.trim();
}

function generateDescription(frame: FrameWithResult, context: DescriptionContext): Description | null {
  switch (frame.result.type) {
    case "ExpressionStatement":
      return describeExpressionStatement(frame, context);
    case "VariableDeclaration":
      return describeVariableDeclaration(frame, context);
    case "BlockStatement":
      return describeBlockStatement(frame, context);
    case "IfStatement":
      return describeIfStatement(frame, context);
  }
  return null;
}
