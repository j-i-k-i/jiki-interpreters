# Error Naming Standard

This document defines the standardized naming convention for error messages across all Jiki interpreters (JikiScript, JavaScript, and Python).

## Design Principles

1. **Hyper-specific error names** - Each error should be uniquely identifiable and provide maximum context
2. **High granularity** - Prefer specific error types over generic ones
3. **Consistent i18n support** - Error names should map directly to translation keys
4. **Educational focus** - Error names should help students understand exactly what went wrong

## Naming Pattern

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
  - `MissingParameterNameInFunctionDeclaration`

- **Invalid** - Incorrect syntax usage
  - `InvalidFunctionNameUsingNumber`
  - `InvalidVariableNameStartingWithDigit`
  - `InvalidAssignmentTargetExpression`

- **Unexpected** - Element appears in wrong context
  - `UnexpectedElseWithoutMatchingIf`
  - `UnexpectedTokenAfterExpression`
  - `UnexpectedRightBraceWithoutMatchingLeft`

- **Unterminated** - Unclosed language constructs
  - `UnterminatedStringLiteralAtEndOfFile`
  - `UnterminatedCommentAtEndOfLine`
  - `UnterminatedTemplateLiteralMissingBacktick`

- **Malformed** - Incorrectly structured elements
  - `MalformedNumberWithMultipleDecimals`
  - `MalformedNumberEndingWithDecimal`
  - `MalformedIdentifierContainingSpaces`

#### Semantic Errors

- **Duplicate** - Multiple declarations of same entity
  - `DuplicateVariableDeclarationInScope`
  - `DuplicateParameterNameInFunction`
  - `DuplicateFunctionDeclarationInScope`

- **Invalid** - Semantically incorrect usage
  - `InvalidReturnStatementOutsideFunction`
  - `InvalidBreakStatementOutsideLoop`
  - `InvalidContinueStatementOutsideLoop`

#### Runtime Errors

- **NotFound** - Missing references at runtime
  - `VariableNotFoundInCurrentScope`
  - `FunctionNotFoundWithSimilarName`
  - `PropertyNotFoundOnObject`

- **TypeError** - Type-related runtime issues
  - `TypeErrorNonCallableTargetInvocation`
  - `TypeErrorInvalidOperandTypeForArithmetic`
  - `TypeErrorCannotIndexNonArrayValue`

- **RangeError** - Value out of acceptable range
  - `RangeErrorIndexOutOfBoundsForArray`
  - `RangeErrorTooManyArgumentsForFunction`
  - `RangeErrorNegativeRepeatCount`

- **StateError** - Invalid program state
  - `StateErrorInfiniteLoopDetected`
  - `StateErrorMaxRecursionDepthExceeded`
  - `StateErrorVariableUsedBeforeDeclaration`

#### Feature Errors

- **Disabled** - Feature not enabled in current mode
  - `DisabledFeatureClassDeclarationNotAllowed`
  - `DisabledFeatureAdvancedLoopsNotEnabled`
  - `DisabledFeatureObjectDestructuringNotAllowed`

### Context Suffixes

Context suffixes provide specific location/situation information:

- **Location contexts**:
  - `InFunctionDeclaration`, `InClassMethod`, `InLoopBody`
  - `AtStartOfFile`, `AtEndOfFile`, `AtEndOfLine`
  - `AfterKeyword`, `BeforeExpression`, `BetweenParameters`

- **Construct contexts**:
  - `ForStringLiteral`, `ForNumericLiteral`, `ForIdentifier`
  - `InArithmeticExpression`, `InLogicalExpression`, `InAssignment`
  - `WithSuggestion` (when error includes suggested fix)

## Examples

### Good Error Names

```typescript
// Hyper-specific with clear context
"MissingRightParenthesisAfterFunctionCallArguments";
"InvalidVariableNameStartingWithNumber";
"UnexpectedElseStatementWithoutMatchingIf";
"TypeErrorCannotAddStringToNumber";
"RangeErrorArrayIndexOutOfBounds";

// Language-specific when needed
"UnterminatedStringLiteralMissingQuote"; // JS/Python
"MissingColonAfterPythonFunctionDeclaration"; // Python
"InvalidIndentationLevelInPythonBlock"; // Python
```

### Avoid

```typescript
// Too generic
("SyntaxError", "RuntimeError", "TypeError");

// Inconsistent prefixes
("BadFunction", "WrongType", "ErrorInLoop");

// Unclear context
("Missing", "Invalid", "Unexpected");
```

## Implementation Guidelines

1. **Alphabetical organization** - All error types should be alphabetically sorted within their category
2. **One-to-one i18n mapping** - Each error type should have exactly one translation key
3. **Context objects** - Use context parameter for variable information, not error name
4. **Test coverage** - Every error type must have test coverage
5. **Cross-language consistency** - Similar errors should use similar naming across interpreters

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

The English translation file (`locales/en/translation.json`) contains human-readable educational messages and represents the **canonical granularity** for error naming. If an English message mentions specific context (like "function"), the error name should include that context. If the message is generic, the error name should be generic.

## Migration Strategy

When updating existing error names:

1. Update the error type definition
2. Update all references in parser/executor code
3. Update i18n translation files
4. Update test files
5. Run full test suite
6. Update documentation

This ensures educational clarity while maintaining robust error handling across all Jiki interpreters.
