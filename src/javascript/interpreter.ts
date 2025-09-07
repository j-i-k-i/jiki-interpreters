import { parse } from "./parser";
import { Executor } from "./executor";
import { SyntaxError } from "./error";
import type { Frame } from "../shared/frames";

// Update InterpretResult to match JikiScript pattern
export type InterpretResult = {
  frames: Frame[];
  error: SyntaxError | null; // Only parse/syntax errors, never runtime errors
  success: boolean;
};

export function interpret(sourceCode: string): InterpretResult {
  try {
    // Parse the source code (compilation step)
    const statements = parse(sourceCode);

    // Execute statements
    const executor = new Executor(sourceCode);
    const result = executor.execute(statements);

    return {
      frames: result.frames,
      error: null, // No parse error
      success: result.success,
    };
  } catch (error) {
    // Only parsing/compilation errors are returned as errors
    return {
      frames: [],
      error: error as SyntaxError,
      success: false,
    };
  }
}
