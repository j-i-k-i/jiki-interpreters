# Python Interpreter

The Python interpreter for Jiki provides educational visualization of Python code execution with frame-by-frame analysis.

## Current Status

**In Development** - Basic numeric literal support implemented

### Implemented Features

- **Numeric Literals**: Integer and floating-point numbers
- **Basic Scanner**: Tokenizes Python number literals
- **Expression Parser**: Builds AST for numeric expressions
- **Modular Executor**: Evaluates numeric literals using shared architecture
- **PyObjects**: Python-specific objects extending shared `JikiObject`
- **Frame Generation**: Compatible with Jiki UI for educational visualization

### Planned Features

- Boolean literals (True/False)
- String literals with Python-specific syntax
- Basic arithmetic operations (+, -, \*, /, //, %, \*\*)
- Grouping expressions with parentheses
- Variable assignments and lookups
- Control flow (if statements, loops)
- Functions and scope
- Data structures (lists, dictionaries, tuples)

## Architecture

The Python interpreter follows the same modular architecture as JavaScript and JikiScript:

```
Source Code → Scanner → Parser → Executor → Frames → UI
```

### Integration with Shared Components

- **Frames**: Uses unified frame system from `src/shared/frames.ts`
- **Objects**: Extends `JikiObject` base class for consistency
- **Testing**: Follows established patterns from JavaScript interpreter
- **Educational Features**: Provides descriptions and step-by-step execution

For detailed architecture information, see `architecture.md`.

## Educational Focus

The Python interpreter emphasizes:

- **Beginner-Friendly**: Clear error messages and execution explanations
- **Visual Learning**: Frame-by-frame execution with variable tracking
- **Progressive Syntax**: Gradual introduction of Python concepts
- **Cross-Language Consistency**: Same UI experience as other Jiki interpreters
