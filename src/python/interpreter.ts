import { Parser } from "./parser";
import { Executor, RuntimeError } from "./executor";
import type { Frame } from "../shared/frames";
import type { Statement } from "./statement";
import type { JikiObject } from "./pyObjects";
import type { EvaluationResult } from "./evaluation-result";

export type InterpretResult = {
  frames: Frame[];
  error: Error | null;
  success: boolean;
};

export function interpret(sourceCode: string, fileName: string = "python-script"): InterpretResult {
  try {
    // Parse the source code
    const parser = new Parser(fileName);
    const statements = parser.parse(sourceCode);

    // Create executor
    const executor = new Executor();

    // Execute statements and create frames
    const frames: Frame[] = [];

    for (const statement of statements) {
      try {
        const priorVariables = executor.environment.getAllVariables();
        const result = executor.executeStatement(statement);

        if (result) {
          const frame: Frame = {
            line: statement.location.line,
            code: sourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end - 1),
            status: "SUCCESS",
            result: result,
            time: 0.01,
            timelineTime: frames.length + 1,
            description: `Evaluating: ${result.jikiObject.toString()}`,
            context: statement,
            priorVariables: priorVariables,
            variables: executor.environment.getAllVariables(),
          };
          frames.push(frame);
        }
      } catch (error) {
        let errorMessage = "Unknown error";
        let errorLocation = statement.location;

        if (error instanceof RuntimeError) {
          errorMessage = error.message;
          errorLocation = error.location;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        const frame: Frame = {
          line: errorLocation.line,
          code: sourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end - 1),
          status: "ERROR",
          error: error,
          time: 0.01,
          timelineTime: frames.length + 1,
          description: `Error: ${errorMessage}`,
          context: statement,
          priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
          variables: executor.environment.getAllVariables(),
        };
        frames.push(frame);

        return {
          frames,
          error: error instanceof Error ? error : new Error(String(error)),
          success: false,
        };
      }
    }

    return {
      frames,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      frames: [],
      error: error instanceof Error ? error : new Error(String(error)),
      success: false,
    };
  }
}
