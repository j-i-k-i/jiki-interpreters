# JikiScript Error System Documentation

## Overview

The JikiScript interpreter implements the definitive standardized error system that serves as the foundation for the shared error naming convention defined in `.context/error-naming-standard.md`. This system provides hyper-specific, educational error messages with the highest granularity across all Jiki interpreters.

## Error Architecture

### Error Types

JikiScript defines **SyntaxError**, **SemanticError**, **RuntimeError**, and **FeatureError** to provide comprehensive coverage:

**Syntax Errors (108+ types):**

- Lexical and parsing errors
- String and comment termination errors
- Expression and statement syntax errors
- Function and variable declaration syntax errors
- Class and object syntax errors

**Semantic Errors (12+ types):**

- Scope and declaration validation errors
- Type compatibility errors
- Semantic analysis errors

**Runtime Errors (58+ types):**

- Variable access and modification errors
- Function call and parameter errors
- Object and class instantiation errors
- Loop and control flow errors
- Type operation errors

**Feature Errors:**

- Disabled language feature errors
- Educational progression controls

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

// Similar for SemanticError, RuntimeError, FeatureError
```

## Translation System

### Structure

```
src/jikiscript/locales/
├── en/translation.json      # Educational messages for students
├── system/translation.json  # System messages for error handling
└── translator.ts           # i18n interface
```

### Translation Categories

- **Syntax errors**: `error.syntax.*`
- **Semantic errors**: `error.semantic.*`
- **Runtime errors**: `error.runtime.*`
- **Feature errors**: `error.feature.*`

### Message Format

System translations follow the pattern:

- Simple errors: `"ErrorName"`
- Contextual errors: `"ErrorName: context: {{variable}}"`
- Complex errors: `"ErrorName: param1: {{param1}}: param2: {{param2}}"`

### Error Interpolation

Comprehensive variable support:

- `{{lexeme}}`: The problematic token/character
- `{{name}}`, `{{functionName}}`, `{{className}}`: Identifiers
- `{{expected}}`, `{{actual}}`: Type and value comparisons
- `{{maximum}}`, `{{line}}`, `{{position}}`: Numeric contexts

## Error Naming Convention

All JikiScript error names follow the shared convention:

- Pattern: `[Prefix][Core][Context]`
- Prefixes: Missing, Invalid, Unexpected, Unterminated, Malformed, TypeError, RangeError, StateError
- Most comprehensive naming across all interpreters
- Alphabetically sorted in all files

**Syntax Error Examples:**

- `DuplicateParameterNameInFunctionDeclaration`
- `ExceededMaximumNumberOfParametersInFunction`
- `MissingRightParenthesisAfterExpression`
- `UnterminatedStringLiteral`

**Runtime Error Examples:**

- `AccessorUsedOnNonInstanceObject`
- `CannotStoreNullFromFunction`
- `ClassAlreadyDefinedInScope`
- `StateErrorMaxIterationsReachedInLoop`

## Implementation Details

### Scanner Errors

The scanner provides the most detailed lexical error detection:

- Character-level error identification
- String and comment termination tracking
- Token boundary validation

### Parser Errors

The parser provides comprehensive syntax validation:

- Expression and statement structure validation
- Declaration syntax checking
- Complex syntax pattern recognition

### Semantic Analysis

The semantic analyzer provides advanced validation:

- Scope and declaration checking
- Type compatibility validation
- Control flow analysis

### Runtime Execution

The runtime provides detailed execution error tracking:

- Variable access monitoring
- Function call validation
- Object state management
- Loop iteration limits

## Educational Features

### Progressive Error Disclosure

JikiScript supports educational progression through:

- Feature-specific error disabling
- Granular syntax enabling
- Educational error messages

### Error Context Enhancement

Advanced context provision:

- Multi-variable interpolation
- Detailed location information
- Suggested fixes and alternatives

## Testing Integration

JikiScript uses comprehensive test suites with:

- 108+ syntax error test cases
- 96+ runtime error test cases
- System language for consistent verification
- Frame-based execution testing

```typescript
beforeAll(async () => {
  changeLanguage("system");
});
```

## Dependencies

JikiScript serves as the foundational interpreter:

- **Shared contributions**: Provides base interfaces to `src/shared/`
- **Independent architecture**: Self-contained with no external dependencies
- **Reference implementation**: Defines standards for other interpreters

## Error Message Examples

### Syntax Errors

- **DuplicateParameterNameInFunctionDeclaration**: "DuplicateParameterNameInFunctionDeclaration: functionName: {{functionName}}: parameterName: {{parameterName}}"
- **MissingRightParenthesisAfterExpression**: "MissingRightParenthesisAfterExpression"
- **UnterminatedStringLiteral**: "UnterminatedStringLiteral"

### Runtime Errors

- **CannotStoreNullFromFunction**: "CannotStoreNullFromFunction: functionName: {{functionName}}"
- **StateErrorMaxIterationsReachedInLoop**: "StateErrorMaxIterationsReachedInLoop: maximum: {{maximum}}"
- **VariableNotDeclaredInScope**: "VariableNotDeclaredInScope: variableName: {{variableName}}"

## Standards Definition

JikiScript defines the error naming standards:

1. **Naming Convention**: `[Prefix][Core][Context]` pattern
2. **Granularity Principle**: Error names match English message specificity
3. **Educational Focus**: Messages prioritize student understanding
4. **Consistency Requirement**: Alphabetical organization across all files

## File Organization

JikiScript maintains the most comprehensive error organization:

- 178+ total error types properly standardized
- All translation files alphabetized
- Complete test coverage with frame validation
- Reference implementation for other interpreters

## Educational Impact

The JikiScript error system provides:

1. **Comprehensive coverage**: Most detailed error identification across all interpreters
2. **Educational messaging**: Student-friendly explanations with context
3. **Progressive disclosure**: Feature-based error enabling for curriculum progression
4. **Frame integration**: Error information integrated with execution visualization
5. **Reference standard**: Model implementation for JavaScript and Python interpreters

This system establishes JikiScript as the definitive educational programming environment with the most sophisticated error handling system designed specifically for programming education.
