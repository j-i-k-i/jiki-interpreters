# Common Development Errors

This document outlines common mistakes developers make when working on the Jiki interpreter system, and how to avoid them.

## Critical Architecture Violations

### ❌ Runtime Errors as Returned Errors

**WRONG - This breaks UI compatibility:**

```typescript
// ❌ NEVER DO THIS
function interpret(code: string) {
  try {
    const result = executor.execute(statements);
    return result;
  } catch (error) {
    if (error instanceof RuntimeError) {
      return {
        frames: [],
        error: error, // ❌ Runtime errors should NEVER be returned
        success: false,
      };
    }
  }
}
```

**✅ CORRECT - Follow shared architecture:**

```typescript
// ✅ ALWAYS DO THIS
function interpret(code: string) {
  try {
    const statements = parse(code); // May throw parse errors
    const executor = new Executor(code);
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

### ❌ Manual Frame Creation in Interpreter

**WRONG:**

```typescript
// ❌ Frame creation logic in interpreter.ts
for (const statement of statements) {
  try {
    const result = executor.executeStatement(statement);
    const frame = {
      // Manual frame creation
      code: getCode(statement),
      status: "SUCCESS",
      // ... lots of frame logic
    };
    frames.push(frame);
  } catch (error) {
    // More manual frame creation...
  }
}
```

**✅ CORRECT:**

```typescript
// ✅ Let executor handle frame creation internally
const executor = new Executor(sourceCode);
const result = executor.execute(statements); // Frames created internally
return { frames: result.frames, error: null, success: result.success };
```

### ❌ Missing executeFrame() Wrapper

**WRONG:**

```typescript
// ❌ Direct execution without frame management
public executeStatement(statement: Statement): EvaluationResult {
  if (statement instanceof ExpressionStatement) {
    return executeExpressionStatement(this, statement);
  }
}
```

**✅ CORRECT:**

```typescript
// ✅ Use executeFrame wrapper for consistent frame generation
public executeStatement(statement: Statement): EvaluationResult {
  if (statement instanceof ExpressionStatement) {
    return this.executeFrame(statement, () => executeExpressionStatement(this, statement));
  }
}
```

## Error Message Format Issues

### ❌ Wrong System Message Format

**WRONG - These test expectations will fail:**

```typescript
// ❌ Expecting localized messages in tests
expect(errorFrame?.error?.message).toContain("The variable 'x' has not been declared.");
expect(errorFrame?.error?.message).toContain("Undefined variable 'x'");
```

**✅ CORRECT - System format required:**

```typescript
// ✅ System message format for consistency
expect(errorFrame?.error?.message).toBe("VariableNotDeclared: name: x");
expect(errorFrame?.error?.message).toBe("UndefinedVariable: name: x");
```

### ❌ Missing Language Configuration in Tests

**WRONG - Tests will get English messages:**

```typescript
// ❌ No language setup
test("runtime error", () => {
  const { frames, error } = interpret("invalid_code");
  expect(errorFrame?.error?.message).toBe("VariableNotDeclared: name: x");
  // ❌ Will fail because English message is used
});
```

**✅ CORRECT - System language setup:**

```typescript
// ✅ Proper language configuration
beforeAll(async () => {
  await changeLanguage("system");
});

afterAll(async () => {
  await changeLanguage("en");
});
```

### ❌ Inconsistent Translation Keys

**WRONG - Different message formats across languages:**

```json
// JavaScript: system/translation.json
"VariableNotDeclared": "VariableNotDeclared: name: {{name}}"

// Python: system/translation.json
"UndefinedVariable": "Undefined variable '{{name}}'"  // ❌ Inconsistent!
```

**✅ CORRECT - Consistent system format:**

```json
// All languages should use consistent format:
"VariableNotDeclared": "VariableNotDeclared: name: {{name}}"
"UndefinedVariable": "UndefinedVariable: name: {{name}}"
```

## Location Tracking Problems

### ❌ Expression Location for Statement Errors

**WRONG - Error shows only part of statement:**

```typescript
// ❌ Using expression location for statement location
return new ExpressionStatement(expr, expr.location); // Shows "x" not "x;"
```

**✅ CORRECT - Full statement location:**

```typescript
// ✅ Statement location includes full statement
const semicolonToken = this.consumeSemicolon();
const statementLocation = new Location(
  expr.location.line,
  expr.location.relative,
  new Span(expr.location.absolute.begin, semicolonToken.location.absolute.end)
);
return new ExpressionStatement(expr, statementLocation); // Shows "x;"
```

### ❌ consumeSemicolon() Not Returning Token

**WRONG - Can't calculate statement span:**

```typescript
// ❌ Returns void, can't get semicolon location
private consumeSemicolon(): void {
  if (this.match("SEMICOLON")) return;
  this.error("MissingSemicolon", this.peek().location);
}
```

**✅ CORRECT - Return token for location:**

```typescript
// ✅ Returns token for location calculation
private consumeSemicolon(): Token {
  if (this.match("SEMICOLON")) {
    return this.previous();
  }
  this.error("MissingSemicolon", this.peek().location);
  return this.previous(); // Fallback
}
```

## Test Pattern Errors

### ❌ Wrong Test Expectations for Runtime Errors

**WRONG - Expecting runtime errors as returned errors:**

```typescript
// ❌ Old pattern - expects runtime errors as returned errors
test("undefined variable", () => {
  const { frames, error } = interpret("x;");
  expect(error).not.toBeNull(); // ❌ Will fail
  expect(error?.message).toContain("VariableNotDeclared");
});
```

**✅ CORRECT - Runtime errors as frames:**

```typescript
// ✅ New pattern - runtime errors as error frames
test("undefined variable", () => {
  const { frames, error } = interpret("x;");
  expect(error).toBeNull(); // Runtime errors are in frames, not returned
  const errorFrame = frames.find(f => f.status === "ERROR");
  expect(errorFrame).toBeTruthy();
  expect(errorFrame?.error?.message).toBe("VariableNotDeclared: name: x");
});
```

### ❌ Wrong Test Expectations for Parse Errors

**WRONG - Expecting parse errors as frames:**

```typescript
// ❌ Parse errors should be returned, not in frames
test("syntax error", () => {
  const { frames, error } = interpret("let = 5;");
  expect(error).toBeNull(); // ❌ Will fail
  const errorFrame = frames.find(f => f.status === "ERROR");
  expect(errorFrame).toBeTruthy();
});
```

**✅ CORRECT - Parse errors as returned errors:**

```typescript
// ✅ Parse errors are returned with empty frames
test("syntax error", () => {
  const { frames, error } = interpret("let = 5;");
  expect(error).toBeTruthy(); // Parse errors are returned
  expect(frames).toHaveLength(0);
});
```

## Quick Reference

### Error Handling Rules

1. **Parse/Syntax Errors**: Return as `error` with empty `frames[]`
2. **Runtime Errors**: Always `error: null`, runtime errors become error frames
3. **Success**: Always `error: null`, success frames in `frames[]`

### Test Setup Rules

1. **Runtime Error Tests**: Set language to "system", expect error frames
2. **Parse Error Tests**: Expect returned errors with empty frames
3. **System Messages**: Use format `"ErrorType: context: value"`

### Frame Management Rules

1. **Executor**: Has `addFrame()`, `executeFrame()`, frame arrays
2. **Interpreter**: Simple parse + execute, no frame logic
3. **Location**: Statement locations include full statement (with semicolons, etc.)

**Remember: Any deviation from the shared architecture WILL break UI compatibility!**
