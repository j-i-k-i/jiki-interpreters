import type { JikiObject } from "./jikiObject";

/**
 * Shared frame execution status used by all interpreters
 */
export type FrameExecutionStatus = "SUCCESS" | "ERROR";

/**
 * Base frame interface shared by all interpreters.
 * Represents a single step of code execution for educational visualization.
 */
export type Frame = {
  /** Line number in the source code */
  line: number;

  /** The actual code being executed */
  code: string;

  /** Whether this frame succeeded or errored */
  status: FrameExecutionStatus;

  /** Error information if the frame failed */
  error?: any;

  /** Execution time (can be simulated) */
  time: number;

  /** Position in the timeline */
  timelineTime: number;

  /** Human-readable description of what happened (lazy evaluation) */
  generateDescription: () => string;

  /** Variables after this frame executed */
  variables: Record<string, any>;

  /** Result of the evaluation if applicable */
  result?: any;

  /** Additional data for specific interpreters */
  data?: Record<string, any>;

  /** Additional context (AST node, statement, etc.) */
  context?: any;
};

/**
 * Helper function to check if all frames succeeded
 */
export function framesSucceeded(frames: Frame[]): boolean {
  return frames.every(frame => frame.status === "SUCCESS");
}

/**
 * Helper function to check if any frames errored
 */
export function framesErrored(frames: Frame[]): boolean {
  return !framesSucceeded(frames);
}

/**
 * Description type for educational explanations
 */
export type Description = {
  result: String;
  steps: String[];
};

/**
 * Context for generating descriptions
 */
export type DescriptionContext = {
  functionDescriptions: Record<string, string>;
};

/**
 * Frame with result - used by describers
 */
export type FrameWithResult = Frame & { result: any };
