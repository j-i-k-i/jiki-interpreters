import { parse } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError } from "./error";
import type { Frame } from "../shared/frames";
import type { LanguageFeatures } from "./interfaces";
import type { ExternalFunction } from "../shared/interfaces";

// Evaluation context that includes external functions
export interface EvaluationContext {
  languageFeatures?: LanguageFeatures;
  externalFunctions?: ExternalFunction[];
}

// Update InterpretResult to match JikiScript pattern
export interface InterpretResult {
  frames: Frame[];
  error: SyntaxError | null; // Only parse/syntax errors, never runtime errors
  success: boolean;
}

export function interpret(sourceCode: string, context: EvaluationContext = {}): InterpretResult {
  try {
    // Parse the source code (compilation step)
    const statements = parse(sourceCode, context);

    // Execute statements
    const executor = new Executor(sourceCode, context);
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
