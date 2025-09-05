import { parse } from "./parser";
import { Executor, RuntimeError } from "./executor";
import type { Frame } from "./frames";
import type { Statement } from "./statement";
import type { JikiObject } from "./jikiObjects";
import type { EvaluationResult } from "./evaluation-result";

export type InterpretResult = {
  frames: Frame[];
  error: Error | null;
};

export function interpret(sourceCode: string): InterpretResult {
  try {
    // Parse the source code
    const statements = parse(sourceCode);

    // Create executor
    const executor = new Executor();

    // Execute statements and create frames
    const frames: Frame[] = [];

    for (const statement of statements) {
      try {
        const result = executor.executeStatement(statement);

        // Create a success frame
        const frame: Frame = {
          line: statement.location.line,
          code: sourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end - 1),
          status: "SUCCESS",
          result: result || undefined,
          time: 0.01, // Simplified timing
          timelineTime: frames.length + 1,
          description: generateDescription(statement, result),
          context: statement,
          priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
          variables: executor.getVariables(),
        };

        frames.push(frame);
      } catch (error) {
        // Create an error frame
        const frame: Frame = {
          line: statement.location.line,
          code: sourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end - 1),
          status: "ERROR",
          error: error as RuntimeError,
          time: 0.01,
          timelineTime: frames.length + 1,
          description: `Error: ${(error as Error).message}`,
          context: statement,
          priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
          variables: executor.getVariables(),
        };

        frames.push(frame);
        return { frames, error: error as Error };
      }
    }

    return { frames, error: null };
  } catch (error) {
    // Parsing or other compilation error
    return {
      frames: [],
      error: error as Error,
    };
  }
}

function generateDescription(statement: Statement, result: EvaluationResult | null): string {
  // Very simple description for now
  if (result) {
    return `Evaluated expression: ${result.jikiObject.toString()}`;
  } else {
    return `Executed statement: ${statement.type}`;
  }
}
