import type { Location } from "./location";

/**
 * Shared SyntaxError interface that all interpreter-specific SyntaxError classes conform to.
 * Each interpreter can have additional fields, but all must include these core properties.
 * Note: location is nullable to accommodate JikiScript which allows null locations.
 */
export interface SyntaxError {
  message: string;
  location: Location | null;
  type: string;
  context?: any;
}

/**
 * Result type returned by compile() functions in all interpreters.
 * Uses a discriminated union for type-safe success/error handling.
 */
export type CompilationResult = { success: true } | { success: false; error: SyntaxError };
