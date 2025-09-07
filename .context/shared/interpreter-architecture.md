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
// CORRECT Pattern (used by all interpreters):
type InterpretResult = {
  frames: Frame[];
  error: SyntaxError | null; // ONLY parse errors, NEVER runtime errors
  success: boolean;
};

// Interpreter function:
function interpret(sourceCode: string): InterpretResult {
  try {
    const statements = parse(sourceCode); // May throw parse errors
    const executor = new Executor(sourceCode);
    const result = executor.execute(statements); // Runtime errors become frames

    return {
      frames: result.frames,
      error: null, // Always null - runtime errors are in frames
      success: result.success,
    };
  } catch (error) {
    // ONLY parsing/compilation errors are returned as errors
    return {
      frames: [],
      error: error as SyntaxError,
      success: false,
    };
  }
}
```

### 2. Executor Pattern (MANDATORY)

All executors MUST implement these methods:

```typescript
class Executor {
  private frames: Frame[] = [];
  private location: Location | null = null;
  private time: number = 0;
  private timePerFrame: number = 0.01;

  // REQUIRED: Main execution entry point
  public execute(statements: Statement[]): ExecutorResult {
    // Runtime errors become frames, never thrown to interpreter
  }

  // REQUIRED: Frame management methods
  public addFrame(location, status, result?, error?, context?): void;
  public addSuccessFrame(location, result, context?): void;
  public addErrorFrame(location, error, context?): void;

  // REQUIRED: Execution wrapper for consistent frame generation
  public executeFrame<T>(context: Statement | Expression, code: () => T): T;

  // REQUIRED: Error context management
  private withExecutionContext(fn: Function): boolean;
}
```

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
  description: string; // Human-readable explanation
  context?: any; // AST node for debugging
  priorVariables: Record<string, JikiObject>; // Variables before execution
  variables: Record<string, JikiObject>; // Variables after execution
}
```

### 4. Location Tracking (MANDATORY)

**Critical for proper error reporting:**

- All AST nodes MUST have accurate location information
- Statement locations MUST span the entire statement (including semicolons, keywords, etc.)
- Expression locations can be more granular
- Error frames MUST use statement locations, not sub-expression locations

**Example - JavaScript parser fix:**

```typescript
// WRONG: Only expression location
return new ExpressionStatement(expr, expr.location);

// CORRECT: Full statement location (expression + semicolon)
const semicolonToken = this.consumeSemicolon();
const statementLocation = new Location(
  expr.location.line,
  expr.location.relative,
  new Span(expr.location.absolute.begin, semicolonToken.location.absolute.end)
);
return new ExpressionStatement(expr, statementLocation);
```

### 5. Error Message Format (MANDATORY)

Runtime errors MUST use system message format for consistency:

- Test files MUST set language to "system" for error message testing
- Error messages MUST follow pattern: `"ErrorType: context: value"`
- Example: `"VariableNotDeclared: name: x"`

```typescript
// Test setup (REQUIRED for error tests):
beforeAll(async () => {
  await changeLanguage("system");
});

afterAll(async () => {
  await changeLanguage("en");
});
```

## Shared Components

### 1. JikiObject Base Class (`src/shared/jikiObject.ts`)

All language-specific objects MUST extend the shared `JikiObject` base class:

```typescript
// Language-specific implementations:
class JSNumber extends JikiObject {} // JavaScript
class PyFloat extends JikiObject {} // Python
class JNumber extends JikiObject {} // JikiScript
```

### 2. Frame System (`src/shared/frames.ts`)

- Shared frame interface and types
- `DescriptionContext` for describers
- `FrameWithResult` for successful executions
- Common frame status types

### 3. Location System (`src/shared/location.ts`)

- Shared `Location` and `Span` classes
- Consistent location tracking across all parsers
- Source code mapping utilities

## Testing Requirements

### Test Structure Consistency

All interpreters MUST have these test categories:

1. **Runtime Error Tests**: Use system language, expect error frames
2. **Syntax Error Tests**: Expect returned errors with empty frames
3. **Concept Tests**: Feature-specific testing
4. **Integration Tests**: End-to-end interpretation
5. **Scope Tests**: Variable scoping behavior

### Error Test Pattern

```typescript
// REQUIRED pattern for runtime error tests:
test("runtime error example", () => {
  const { frames, error } = interpret("invalid code");
  expect(error).toBeNull(); // Runtime errors are in frames
  const errorFrame = frames.find(f => f.status === "ERROR");
  expect(errorFrame).toBeTruthy();
  expect(errorFrame?.error?.message).toBe("ErrorType: context: value");
});

// REQUIRED pattern for syntax error tests:
test("syntax error example", () => {
  const { frames, error } = interpret("invalid syntax");
  expect(error).toBeTruthy(); // Parse errors are returned
  expect(frames).toHaveLength(0);
});
```

## UI Compatibility Requirements

### Frame Timeline

- All frames MUST have consistent timing: `timelineTime = Math.round(time * 100)`
- Time increments by `timePerFrame` (default 0.01) per frame
- Frames MUST be in execution order

### Variable Tracking

- `priorVariables`: State before frame execution
- `variables`: State after frame execution
- Must use deep cloning in test environments
- Variables MUST be JikiObject instances, not raw values

### Description Format

- All descriptions MUST be educational and human-readable
- Code snippets MUST be wrapped in appropriate tags
- Step-by-step explanations for complex operations
- Consistent terminology across all languages

## Migration Checklist

When updating an interpreter to follow this architecture:

- [ ] Executor returns `error: null` for runtime errors
- [ ] Runtime errors become error frames with `status: "ERROR"`
- [ ] Parse errors are returned as `error` with empty frames
- [ ] Statement locations include full statement span
- [ ] Error tests use system language configuration
- [ ] Error messages use system format
- [ ] Frame structure matches shared interface
- [ ] All objects extend shared JikiObject base class
- [ ] Tests follow consistent patterns

**Any deviation from these patterns will break UI compatibility and MUST be avoided.**
