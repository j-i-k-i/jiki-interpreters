import type { JSObject } from "./jsObjects";
import type { EvaluationResult } from "./evaluation-result";
import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { deepTrim } from "./describers/helpers";
import { describeExpressionStatement } from "./describers/describeExpressionStatement";

export type FrameExecutionStatus = "SUCCESS" | "ERROR";

export type Frame = {
  line: number;
  code: string;
  status: FrameExecutionStatus;
  error?: Error;
  result?: EvaluationResult;
  time: number;
  timelineTime: number;
  description: string;
  context?: Statement | Expression;
  priorVariables: Record<string, JSObject>;
  variables: Record<string, JSObject>;
};

export type FrameWithResult = Frame & { result: EvaluationResult };

export type Description = {
  result: String;
  steps: String[];
};

export type DescriptionContext = {
  functionDescriptions: Record<string, string>;
};

function isFrameWithResult(frame: Frame): frame is FrameWithResult {
  return !!frame.result;
}

const defaultMessage = `<p>There is no information available for this line. Show us your code in Discord and we'll improve this!</p>`;

export function framesSucceeded(frames: Frame[]): boolean {
  return frames.every(frame => frame.status === "SUCCESS");
}

export function framesErrored(frames: Frame[]): boolean {
  return !framesSucceeded(frames);
}

export function describeFrame(frame: Frame, context?: DescriptionContext): string {
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

  return deepTrim(`
  <h3>What happened</h3>
  ${description.result}
  <hr/>
  <h3>Steps JavaScript Took</h3>
  <ul>
    ${description.steps.join("\n")}
  </ul>
  `);
}

function generateDescription(frame: FrameWithResult, context: DescriptionContext): Description | null {
  switch (frame.result.type) {
    case "ExpressionStatement":
      return describeExpressionStatement(frame, context);
  }
  return null;
}
