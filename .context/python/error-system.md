# Python Error System Documentation

## Overview

The Python interpreter implements a standardized error system following the shared error naming convention defined in `.context/error-naming-standard.md`. This system provides hyper-specific, educational error messages to help students understand Python-specific syntax and runtime errors.

## Error Architecture

### Error Types

Python defines **SyntaxError** and **RuntimeError** types to cover both parsing and execution phases:

**Syntax Errors (12 types):**

- Basic parsing and lexical errors
- Python-specific indentation errors
- String termination and character recognition errors
- Variable declaration and expression syntax errors

**Runtime Errors (4 types):**

- Variable scope and undefined variable errors
- Type operation errors (binary/unary operations)
- Unsupported operation errors

### Error Classes

```typescript
export class SyntaxError extends Error {
  constructor(
    public type: SyntaxErrorType,
    message: string,
    public location: Location,
    public fileName?: string,
    public context?: any
  ) {
    super(message);
    this.name = "SyntaxError";
  }
}

export class RuntimeError extends Error {
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
src/python/locales/
├── en/translation.json      # Educational messages for students
├── system/translation.json  # System messages for error handling
└── translator.ts           # i18n interface
```

### Translation Categories

- **Syntax errors**: `error.syntax.*`
- **Runtime errors**: `error.runtime.*`

### Message Format

System translations follow the pattern:

- Simple errors: `"ErrorName"`
- Contextual errors: `"ErrorName: context: {{variable}}"`
- Special cases: `"Undefined variable '{{name}}'"`

### Error Interpolation

Common variables:

- `{{lexeme}}`: The problematic token/character
- `{{name}}`: Variable or identifier names
- `{{previous}}`: Previous tokens for context

## Error Naming Convention

All Python error names follow the shared convention:

- Pattern: `[Prefix][Core][Context]`
- Prefixes: Missing, Invalid, Unexpected, Unterminated, Malformed
- Python-specific: IndentationError, ParseError
- Alphabetically sorted in all files

**Syntax Error Examples:**

- `IndentationError`
- `MissingExpression`
- `MissingRightParenthesisAfterExpression`
- `ParseError`
- `UnexpectedIndentation`
- `UnterminatedString`

**Runtime Error Examples:**

- `InvalidBinaryExpression`
- `UndefinedVariable`
- `UnsupportedOperation`

## Implementation Details

### Scanner Errors

The scanner throws errors for:

- Unknown characters and invalid tokens
- Unterminated strings and comments
- Python-specific lexical issues

**Error Throwing:**

```typescript
throw new SyntaxError(type, translate(`error.syntax.${type}`, context), this.location(), this.fileName, context);
```

### Parser Errors

The parser throws generic ParseError for:

- Invalid syntax structures
- Missing required elements
- Malformed statements

**Error Throwing:**

```typescript
return new SyntaxError(message, token.location, "ParseError" as SyntaxErrorType);
```

### Runtime Errors

The executor throws errors for:

- Undefined variable access
- Invalid operations on incompatible types
- Unsupported operations

**Error Throwing:**

```typescript
throw new RuntimeError(
  translate(`error.runtime.UndefinedVariable`, { name: variableName }),
  location,
  "UndefinedVariable"
);
```

## Testing Integration

Python tests use the system language for consistent error message verification:

```typescript
beforeAll(async () => {
  changeLanguage("system");
});
```

Tests expect specific error messages, particularly for runtime errors like:

```typescript
expect(error?.message).toContain("Undefined variable 'variableName'");
```

## Dependencies

The Python interpreter maintains complete independence:

- **Shared dependencies**: Location classes and interfaces from `src/shared/`
- **No cross-language dependencies**: Does not import from JikiScript or JavaScript
- **Self-contained translation system**: Own translator and translation files

## Error Message Examples

### Syntax Errors

- **IndentationError**: "Incorrect indentation. Python uses indentation to define code blocks."
- **ParseError**: "Parse error in Python code syntax."
- **UnterminatedString**: "Unterminated string literal. Make sure to close your string quotes."
- **UnknownCharacter**: "UnknownCharacter: lexeme: {{lexeme}}"

### Runtime Errors

- **UndefinedVariable**: "Undefined variable '{{name}}'"
- **InvalidBinaryExpression**: "InvalidBinaryExpression"
- **UnsupportedOperation**: "UnsupportedOperation"

## Python-Specific Features

### Indentation Handling

Python's error system includes specific error types for indentation:

- `IndentationError`: General indentation problems
- `UnexpectedIndentation`: Incorrect indentation structure

### Variable Scoping

Python's runtime error system provides detailed variable scope error messages:

- Includes variable name in error message
- Provides context about where variable was accessed

## Educational Benefits

The Python error system provides:

1. **Python-specific guidance**: Error messages tailored to Python syntax and conventions
2. **Indentation awareness**: Special handling for Python's significant whitespace
3. **Runtime context**: Detailed variable and operation error information
4. **Consistent experience**: Same error format as other Jiki interpreters

## File Organization

All Python error-related files are alphabetized and consistently formatted:

- Error type definitions alphabetized
- Translation files alphabetized
- Test files updated to use new system
- All cross-references updated

This system ensures Python provides the same high-quality, educational error experience as the other Jiki interpreters while maintaining complete architectural independence and Python-specific error handling.
