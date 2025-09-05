import type { JikiObject } from "./jikiObjects";
import type { EvaluationResult } from "./evaluation-result";
import type { Statement } from "./statement";

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
  context: Statement;
  priorVariables: Record<string, JikiObject>;
  variables: Record<string, JikiObject>;
};
