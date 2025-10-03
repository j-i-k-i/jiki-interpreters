import type { Frame } from "./frames";

/**
 * Generic CompilationError interface used by all interpreters.
 * Represents a parse/syntax error that occurs during the compilation phase.
 */
export interface CompilationError {
  type: "CompilationError";
  error: any; // Language-specific SyntaxError/StaticError type
  frames: Frame[];
}
