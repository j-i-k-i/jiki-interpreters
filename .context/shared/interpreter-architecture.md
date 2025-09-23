# Shared Interpreter Architecture

This document describes the common architectural patterns and requirements that ALL interpreters (JikiScript, JavaScript, Python) MUST follow to ensure consistent output and UI compatibility.

## Core Architecture Pattern

All interpreters MUST follow this exact pipeline:

```
Source Code → Scanner → Parser → Executor → Frames → UI
                ↓         ↓         ↓
             Tokens     AST    Evaluation
                              + Descriptions
```

## Critical Architectural Requirements

### 1. Error Handling Pattern (MANDATORY)

**This pattern is absolutely critical for consistency:**

- **Parse/Syntax Errors**: Returned as `error` in the result, with empty frames array
- **Runtime Errors**: Never returned as `error`, always become error frames with `status: "ERROR"`
- **Success**: Always returns `error: null` for successful execution

```typescript
type InterpretResult = {
  frames: Frame[];
  error: SyntaxError | null; // ONLY parse errors
  success: boolean;
};
```

### 2. Executor Pattern (MANDATORY)

All executors MUST implement:

- `execute(statements)` - main execution entry point
- `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` - frame management
- `executeFrame()` - execution wrapper for consistent frame generation

### 3. Frame Structure (MANDATORY)

All interpreters MUST generate frames with this exact structure:

```typescript
interface Frame {
  line: number; // Source line number
  code: string; // Executed code snippet
  status: "SUCCESS" | "ERROR"; // Execution status
  result?: EvaluationResult; // Computation result (if success)
  error?: RuntimeError; // Error details (if failed)
  time: number; // Execution time (simulated)
  timelineTime: number; // Frame sequence number (time * 100)
  generateDescription: () => string; // Lazy description generation (performance)
  context?: any; // AST node for debugging
  // Note: variables and description fields are added only in test environments
}
```

#### Performance Optimizations

**Lazy Description Generation**: Frames use `generateDescription()` function instead of pre-computed `description` string. This defers expensive string generation until needed by the UI, resulting in ~9x performance improvement.

**Test Augmentation**: In test environments (`NODE_ENV=test` and `RUNNING_BENCHMARKS !== "true"`), frames are augmented with:

- `variables`: Snapshot of current variables
- `description`: Pre-computed description string

This maintains backward compatibility with existing tests while optimizing production performance.

### 4. Location Tracking (MANDATORY)

**Critical for proper error reporting:**

- All AST nodes MUST have accurate location information
- **IMPORTANT**: Locations use 1-based indexing (first character is position 1, not 0)
  - This makes error messages clearer for students (e.g., "character 1" is the first character they see)
  - Scanners MUST add 1 to their internal 0-based indices when creating Location objects
  - The shared `Location.toCode()` method accounts for this by subtracting 1 when extracting substrings
- Statement locations MUST span the entire statement (including semicolons, keywords, etc.)
- Expression locations can be more granular
- Error frames MUST use statement locations, not sub-expression locations

### 5. Error Message Format (MANDATORY)

Runtime errors MUST use system message format for consistency:

- Test files MUST set language to "system" for error message testing
- Error messages MUST follow pattern: `"ErrorType: context: value"`
- Example: `"VariableNotDeclared: name: x"`

## Shared Components

### 1. JikiObject Base Class (`src/shared/jikiObject.ts`)

All language-specific objects MUST extend the shared `JikiObject` base class. All interpreters use a single standardized `jikiObject` field in their EvaluationResult types for consistency.

**Required methods (MANDATORY for all implementations):**

- `toString(): string` - String representation of the object
- `get value(): any` - Raw underlying value
- `clone(): JikiObject` - Create a copy (immutable objects can return `self`)

#### Performance Feature: Immutable Object Cloning

The `immutableJikiObject` field in evaluation results provides a point-in-time immutable copy for frame generation. This optimization:

- Avoids expensive deep cloning during execution
- Maintains correct state snapshots for each frame
- Only clones objects when their state actually changes
- Significantly reduces memory allocation and GC pressure

**Implementation pattern:**

- Primitive types (numbers, strings, booleans, null/none): `clone()` returns `self`
- Mutable collections (lists, dictionaries, arrays): `clone()` creates actual copy
- Evaluation results: Include `immutableJikiObject: result.clone()` field
- Describers: Access via `result.immutableJikiObject || result.jikiObject`

### 2. Frame System (`src/shared/frames.ts`)

Shared frame interface and types used by all interpreters for consistent UI integration.

### 3. Location System (`src/shared/location.ts`)

Shared `Location` and `Span` classes for consistent location tracking across all parsers.

## Testing Requirements

All interpreters MUST have consistent test categories:

- Runtime Error Tests: Use system language, expect error frames
- Syntax Error Tests: Expect returned errors with empty frames
- Concept Tests: Feature-specific testing
- Integration Tests: End-to-end interpretation

## UI Compatibility Requirements

- Frame timing must be consistent across interpreters
- Variable tracking for current state
- Educational descriptions in human-readable format
- Variables must be JikiObject instances

**Any deviation from these patterns will break UI compatibility and MUST be avoided.**
