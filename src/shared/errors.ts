import type { Location } from "./location";

/**
 * Shared SyntaxError interface that all interpreter-specific SyntaxError classes conform to.
 * Each interpreter can have additional fields, but all must include these core properties.
 *
 * Note: JikiScript's SyntaxError allows nullable location, but JavaScript and Python require
 * non-null locations. JikiScript's more permissive type (Location | null) is structurally
 * compatible with this interface while maintaining type safety for all implementations.
 */
export interface SyntaxError {
  message: string;
  location: Location;
  type: string;
  context?: any;
}

/**
 * Result type returned by compile() functions in all interpreters.
 * Uses a discriminated union for type-safe success/error handling.
 */
export type CompilationResult = { success: true } | { success: false; error: SyntaxError };
