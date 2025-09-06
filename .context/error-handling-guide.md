# Error Handling Guide

This document provides comprehensive guidelines for implementing and managing errors across all Jiki interpreters (JikiScript, JavaScript, and Python).

## 🚨 CRITICAL: Error Translation Requirements

**WHENEVER YOU CREATE A NEW ERROR TYPE, YOU MUST:**

1. **Add the error type** to the appropriate error type definition in `src/[language]/error.ts`
2. **Create a system translation** in `src/[language]/locales/system/translation.json`
   - Format: `"ErrorName": "ErrorName: variable: {{variable}}"`
3. **Create an English translation** in `src/[language]/locales/en/translation.json`
   - Human-readable educational message for students

**Failure to add translations will cause runtime crashes when the error is thrown!**

## Error Naming Standard

### Design Principles

1. **Hyper-specific error names** - Each error should be uniquely identifiable and provide maximum context
2. **High granularity** - Prefer specific error types over generic ones
3. **Consistent i18n support** - Error names should map directly to translation keys
4. **Educational focus** - Error names should help students understand exactly what went wrong

### Naming Pattern

**Format: `[Prefix][Core][Context]`**

### Error Categories

All interpreters support these categories:

- **SyntaxError** - Parse-time issues with code structure
- **SemanticError** - Logic/meaning issues that are statically detectable
- **RuntimeError** - Execution-time issues
- **FeatureError** - Disabled language features (for progressive syntax)

### Prefixes by Category

#### Syntax Errors

- **Missing** - Required syntax element is absent
  - `MissingRightBraceAfterBlock`
  - `MissingSemicolonAfterStatement`
- **Invalid** - Incorrect syntax usage
  - `InvalidFunctionNameUsingNumber`
  - `InvalidVariableNameStartingWithDigit`
- **Unexpected** - Element appears in wrong context
  - `UnexpectedElseWithoutMatchingIf`
  - `UnexpectedTokenAfterExpression`
- **Unterminated** - Unclosed language constructs
  - `UnterminatedStringLiteralAtEndOfFile`
  - `UnterminatedCommentAtEndOfLine`
- **Malformed** - Incorrectly structured elements
  - `MalformedNumberWithMultipleDecimals`
  - `MalformedNumberEndingWithDecimal`

#### Semantic Errors

- **Duplicate** - Multiple declarations of same entity
  - `DuplicateVariableDeclarationInScope`
  - `DuplicateParameterNameInFunction`
- **Invalid** - Semantically incorrect usage
  - `InvalidReturnStatementOutsideFunction`
  - `InvalidBreakStatementOutsideLoop`

#### Runtime Errors

- **NotFound** - Missing references at runtime
  - `VariableNotFoundInCurrentScope`
  - `FunctionNotFoundWithSimilarName`
- **TypeError** - Type-related runtime issues
  - `TypeErrorNonCallableTargetInvocation`
  - `TypeErrorInvalidOperandTypeForArithmetic`
- **RangeError** - Value out of acceptable range
  - `RangeErrorIndexOutOfBoundsForArray`
  - `RangeErrorTooManyArgumentsForFunction`
- **StateError** - Invalid program state
  - `StateErrorInfiniteLoopDetected`
  - `StateErrorMaxRecursionDepthExceeded`

#### Feature Errors

- **Disabled** - Feature not enabled in current mode
  - `DisabledFeatureShadowingNotAllowed`
  - `DisabledFeatureTruthinessNotEnabled`
  - `DisabledFeatureTypeCoercionNotAllowed`

## Translation File Rules

### System Translation File

The system translation file (`locales/system/translation.json`) should follow this strict pattern:

- **Message matches name**: The translation message should exactly match the error type name
- **Variable pattern**: Any context variables should follow the format `": variableName: {{variableName}}"`

**Examples:**

```json
{
  "VariableNotFoundInScope": "VariableNotFoundInScope: name: {{name}}",
  "IndexOutOfRangeForArrayAccess": "IndexOutOfRangeForArrayAccess: index: {{index}}, length: {{length}}",
  "MissingRightParenthesisAfterExpression": "MissingRightParenthesisAfterExpression"
}
```

### English Translation File

The English translation file (`locales/en/translation.json`) contains human-readable educational messages:

```json
{
  "VariableNotFoundInScope": "The variable '{{name}}' has not been declared in this scope.",
  "IndexOutOfRangeForArrayAccess": "Array index {{index}} is out of range. The array has {{length}} elements.",
  "MissingRightParenthesisAfterExpression": "Expected a closing parenthesis ')' after this expression."
}
```

## Implementation Checklist

When creating a new error:

- [ ] Define error type in `src/[language]/error.ts`
- [ ] Add system translation to `src/[language]/locales/system/translation.json`
- [ ] Add English translation to `src/[language]/locales/en/translation.json`
- [ ] Keep error types alphabetically sorted within their category
- [ ] Add test coverage for the error case
- [ ] Pass context variables for dynamic information

## Example: Adding a New Error

Let's say you're adding an error for using a variable before it's declared:

### 1. Add to error.ts

```typescript
export type RuntimeErrorType =
  | "StateErrorVariableUsedBeforeDeclaration"
  | // ... other errors alphabetically
```

### 2. Add system translation

```json
{
  "StateErrorVariableUsedBeforeDeclaration": "StateErrorVariableUsedBeforeDeclaration: name: {{name}}"
}
```

### 3. Add English translation

```json
{
  "StateErrorVariableUsedBeforeDeclaration": "Cannot use variable '{{name}}' before it has been declared."
}
```

### 4. Throw the error in code

```typescript
throw new RuntimeError("StateErrorVariableUsedBeforeDeclaration", location, { name: variableName });
```

### 5. Add test coverage

```typescript
test("using variable before declaration throws error", () => {
  const { frames } = interpret("x + 5;");
  expectFrameToBeError(frames[0], "x + 5", "StateErrorVariableUsedBeforeDeclaration");
});
```

## Migration Process

When updating existing error names:

1. Update the error type definition
2. Update all references in parser/executor code
3. Update both translation files (system and en)
4. Update test files
5. Run full test suite
6. Update documentation

## Testing Errors

- Every error type must have test coverage
- Test both the error being thrown and the error message
- Use helper functions like `expectFrameToBeError` for consistency
- Test edge cases and boundary conditions

## Cross-Language Consistency

Similar errors should use similar naming across interpreters:

- JikiScript: `VariableNotFoundInScope`
- JavaScript: `VariableNotFoundInScope`
- Python: `VariableNotFoundInScope`

This ensures a consistent learning experience across languages.

## Common Pitfalls to Avoid

1. **Forgetting translations** - Always add both system and English translations
2. **Generic error names** - Be specific about what went wrong
3. **Missing context** - Pass relevant variables for error messages
4. **Unalphabetized lists** - Keep error types sorted for maintainability
5. **Inconsistent naming** - Follow the naming pattern strictly

## Quick Reference

### When to use each prefix:

- **Missing**: Something required is not present
- **Invalid**: Something is present but incorrectly formed
- **Unexpected**: Something appears where it shouldn't
- **Unterminated**: Something started but never ended
- **Malformed**: Something has the wrong structure
- **Duplicate**: Something appears more than once when it shouldn't
- **NotFound**: Runtime reference to non-existent entity
- **TypeError**: Wrong type used in operation
- **RangeError**: Value outside acceptable bounds
- **StateError**: Invalid program state or flow
- **Disabled**: Feature not enabled in current configuration

Remember: **Every error needs translations, or the interpreter will crash!**
