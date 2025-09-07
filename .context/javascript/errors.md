# JavaScript Error System Documentation

## Overview

The JavaScript interpreter implements a standardized error system following the shared error naming convention defined in `.context/error-naming-standard.md`. This system provides hyper-specific, educational error messages to help students understand exactly what went wrong in their code.

## Error Architecture

### Error Types

JavaScript defines **SyntaxError** and **RuntimeError** for comprehensive error handling:

**Syntax Errors (13 types):**

- Basic parsing and lexical errors
- String termination errors
- Expression and statement syntax errors
- Variable declaration syntax errors

**Runtime Errors (4 types):**

- InvalidBinaryExpression
- InvalidUnaryExpression
- UnsupportedOperation
- VariableNotDeclared

### Error Classes

```typescript
export class SyntaxError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: SyntaxErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "SyntaxError";
  }
}

export class RuntimeError extends Error {
  public category: string = "RuntimeError";
  
  constructor(
    message: string,
    public location: Location,
    public type: RuntimeErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "RuntimeError";
  }
}
```

## Translation System

### Structure

```
src/javascript/locales/
├── en/translation.json      # Educational messages for students
├── system/translation.json  # System messages for error handling
└── translator.ts           # i18n interface
```

### Translation Languages

- **English (`en`)**: Human-readable educational messages
- **System (`system`)**: Error type names with context interpolation

### Message Format

System translations follow the pattern:

- Simple errors: `"ErrorName"`
- Contextual errors: `"ErrorName: context: {{variable}}"`

### Error Interpolation

Common variables:

- `{{lexeme}}`: The problematic token/character
- `{{name}}`: Variable or identifier names
- `{{expected}}`: Expected syntax elements

## Error Naming Convention

All JavaScript error names follow the shared convention:

- Pattern: `[Prefix][Core][Context]`
- Prefixes: Missing, Invalid, Unexpected, Unterminated, Malformed
- Alphabetically sorted in all files

**Examples:**

- `MissingRightParenthesisAfterExpression`
- `MissingDoubleQuoteToTerminateString`
- `UnexpectedRightBrace`
- `UnknownCharacter`

## Implementation Details

### Scanner Errors

The scanner throws errors for:

- Unknown characters
- Unterminated strings
- Unterminated template literals

**Error Throwing:**

```typescript
throw new SyntaxError(translate(`error.syntax.${type}`, context), this.location(), type, context);
```

### Parser Errors

The parser throws errors for:

- Missing expressions
- Missing parentheses
- Missing semicolons
- Invalid variable declarations

**Error Throwing:**

```typescript
throw new SyntaxError(translate(`error.syntax.${type}`, context), location, type, context);
```

## Testing Integration

JavaScript tests use the system language for consistent error message verification:

```typescript
beforeAll(async () => {
  changeLanguage("system");
});
```

Tests expect specific error messages that match the system translation format.

## Dependencies

The JavaScript interpreter maintains complete independence:

- **Shared dependencies**: Location classes and interfaces from `src/shared/`
- **No cross-language dependencies**: Does not import from JikiScript or Python
- **Self-contained translation system**: Own translator and translation files

## Error Message Examples

### Syntax Errors

- **MissingDoubleQuoteToTerminateString**: "Did you forget to add end quote?"
- **MissingRightParenthesisAfterExpression**: "MissingRightParenthesisAfterExpression"
- **UnknownCharacter**: "Unknown character"
- **MissingSemicolon**: "MissingSemicolon"

### Runtime Errors

- **VariableNotDeclared**: "The variable '{{name}}' has not been declared."
- **InvalidBinaryExpression**: "Invalid operation between values."
- **InvalidUnaryExpression**: "Invalid unary operation."
- **UnsupportedOperation**: "This operation is not supported."

## Educational Benefits

The JavaScript error system provides:

1. **Specific error identification**: Precise error type names help students understand the exact problem
2. **Contextual information**: Variable names and lexemes help locate the issue
3. **Educational messaging**: English translations explain the problem in student-friendly language
4. **Consistent experience**: Same error format as other Jiki interpreters

## File Organization

All JavaScript error-related files are alphabetized and consistently formatted:

- Error type definitions alphabetized
- Translation files alphabetized
- Test files updated to use new system
- All cross-references updated

This system ensures JavaScript provides the same high-quality, educational error experience as the other Jiki interpreters while maintaining complete architectural independence.
