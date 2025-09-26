import { Parser } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError } from "./error";
import type { Frame } from "../shared/frames";
import type { LanguageFeatures } from "./interfaces";

// Update InterpretResult to match shared pattern
export interface InterpretResult {
  frames: Frame[];
  error: SyntaxError | null; // Only parse/syntax errors, never runtime errors
  success: boolean;
}

export function interpret(
  sourceCode: string,
  languageFeatures?: LanguageFeatures,
  fileName: string = "python-script"
): InterpretResult {
  try {
    // Parse the source code (compilation step)
    const parser = new Parser(fileName);
    const statements = parser.parse(sourceCode);

    // Execute statements
    const executor = new Executor(sourceCode, languageFeatures);
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
