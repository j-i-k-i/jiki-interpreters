# JavaScript Interpreter

The JavaScript interpreter provides full ECMAScript execution within the Jiki educational environment, generating the same frame format as JikiScript for consistent UI visualization.

## Overview

This interpreter executes standard JavaScript code while producing educational frames that enable:

- **Step-by-step execution tracking**: Every expression and statement generates a frame
- **Variable state visualization**: Track how variables change through execution
- **Educational descriptions**: Plain-language explanations of JavaScript operations
- **Error context**: Detailed error information with educational feedback

## Architecture

The JavaScript interpreter follows the same pipeline as JikiScript:

1. **Scanner**: Tokenizes JavaScript source code
2. **Parser**: Builds an Abstract Syntax Tree (AST)
3. **Executor**: Evaluates the AST and generates frames
4. **Describers**: Generate human-readable descriptions of execution steps

## Key Components

### Scanner

- Full JavaScript tokenization including keywords, operators, literals
- Support for comments, strings with escape sequences, numbers
- Location tracking for error reporting

### Parser

- Recursive descent parser for JavaScript syntax
- Expression and statement parsing
- Operator precedence handling
- Error recovery for educational feedback

### Executor

- Modular execution system with individual executors per expression type
- Environment-based variable scoping
- JikiObject wrapping for primitive tracking
- Frame generation at each execution step

### Describers

- Human-readable descriptions for each operation type
- Step-by-step explanations of complex expressions
- Educational context for errors and edge cases

## Frame Generation

The interpreter generates frames compatible with Jiki's UI:

```typescript
interface Frame {
  line: number;
  code: string;
  status: "SUCCESS" | "ERROR";
  result?: EvaluationResult;
  error?: RuntimeError;
  time: number;
  timelineTime: number;
  description: string;
  context: any;
  priorVariables: Record<string, JikiObject>;
  variables: Record<string, JikiObject>;
}
```

## Supported Features

### Current Implementation

- Arithmetic operations (+, -, \*, /, %)
- Unary operations (-, !)
- Comparison operators (<, >, <=, >=, ==, !=)
- Logical operators (&&, ||)
- Grouping expressions (parentheses)
- Literals (numbers, strings, booleans, null, undefined)
- Comments (single-line and multi-line)

### Planned Features

- Variable declarations (let, const, var)
- Assignment operations
- Control flow (if, else, switch)
- Loops (for, while, do-while)
- Functions and arrow functions
- Objects and arrays
- Classes and prototypes
- Async/await
- Modules (import/export)

## Educational Features

### Descriptive Execution

Each operation generates a description explaining what's happening:

- "Evaluating binary expression: 2 + 3"
- "Comparing values: 5 > 3 evaluates to true"
- "Applying unary negation to 42"

### Progressive Complexity

The interpreter can be configured to enable/disable features based on learning level, similar to JikiScript's progressive syntax approach.

### Error Education

Errors include educational context:

- What went wrong
- Why it's an error
- How to fix it
- Related concepts to review

## Integration with Jiki

The JavaScript interpreter produces the same frame format as JikiScript, allowing:

- Consistent UI visualization across languages
- Language comparison for multi-language learning
- Shared educational tools and features
- Unified debugging experience
