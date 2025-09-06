# JikiScript Key Concepts

## Core Data Types

### JikiObjects (`jikiObjects.ts`)

JikiObjects are wrapper objects around JavaScript primitives, designed for educational purposes:

- **Purpose**: Better tracking, debugging, and educational feedback
- **vs JavaScript Primitives**: Provide richer metadata and behavior
- **Benefits**:
  - Enhanced error messages
  - Type-specific educational descriptions
  - Consistent behavior across different learning scenarios
  - Better variable inspection in the UI

### Frames (`frames.ts`)

Frames capture execution state at each step of program execution:

- **Purpose**: Enable timeline scrubbing and step-by-step debugging
- **Contents**:
  - Current execution location (line/column)
  - Variable state snapshots
  - Execution descriptions
  - Result values
- **UI Integration**: Each frame becomes a "moment in time" students can jump to

### EvaluationResults (`evaluation-result.ts`)

Results of evaluating expressions/statements with educational metadata:

- **Purpose**: Provide rich context beyond just return values
- **Contains**:
  - Computed result value
  - Educational descriptions of what happened
  - Error information (if applicable)
  - Execution context and state changes
- **Educational Value**: Helps students understand "why" not just "what"

## Runtime Environment

### Environment (`environment.ts`)

Manages variable scoping and storage using a nested environment chain pattern.

**Architecture:**

```
Global Environment
    ↓ (enclosing)
Function Environment
    ↓ (enclosing)
Block Environment
```

**Core Operations:**

- **Variable Declaration**: `define(name, value)` creates variables in current scope
- **Variable Access**: `get(name)` searches up the environment chain until found
- **Variable Updates**: `update(name, value)` modifies existing variables in their original scope
- **Scope Management**: Each new scope (function, block) creates child environment

**Scoping Rules:**

- **Block Scoping**: Variables declared in `{ }` blocks are isolated to that scope
- **Function Scoping**: Function parameters and local variables create new scope
- **Global Scope**: Top-level variables accessible everywhere (unless shadowed)
- **Lexical Scoping**: Inner scopes can access outer scope variables
- **Variable Shadowing**: Inner variables can mask outer variables with same name

**Educational Features:**

- **Clear Error Messages**: "Variable 'x' is not defined" with helpful context
- **Scope Visualization**: Variable state tracking shows which variables are accessible
- **Automatic Cleanup**: Block and function scopes automatically clean up when exited
- **Access Tracking**: Monitor which variables are read vs written for debugging

**Implementation Details:**

- **Environment Chain**: Each environment has reference to its enclosing (parent) environment
- **Variable Storage**: Uses Map for efficient variable lookup and storage
- **Scope Isolation**: Variables in child scopes don't leak to parent scopes
- **Memory Management**: Automatic cleanup when scopes are exited

### ExecutionContext

Runtime configuration and state:

- **Configuration**: Language features, execution limits, debugging settings
- **State Tracking**: Current execution position, call stack, loop counters
- **Educational Controls**: Time limits, iteration limits, feature toggles

## Educational Features

### Language Features (`LanguageFeatures` type)

Configurable syntax and semantic options:

```typescript
type LanguageFeatures = {
  includeList?: TokenType[]; // Allowed syntax elements
  excludeList?: TokenType[]; // Disabled syntax elements
  timePerFrame: number; // Animation timing
  repeatDelay: number; // Loop iteration delay
  maxTotalLoopIterations: number; // Safety limit
  allowGlobals: boolean; // Global variable access
  customFunctionDefinitionMode: boolean; // Function definition capability
  addSuccessFrames: boolean; // Show completion frames
};
```

### Describers (`describers/`)

Generate human-readable execution explanations:

- **Purpose**: Help students understand what each line of code does
- **Approach**: Convert technical operations into plain language
- **Localization**: Support multiple languages/reading levels
- **Context-Aware**: Descriptions change based on variable names, values

### Error Handling

Educational error system with multiple error types:

- **SyntaxError**: Problems during parsing (friendly syntax explanations)
- **RuntimeError**: Problems during execution (helpful debugging context)
- **DisabledLanguageFeatureError**: Student used disabled syntax (educational guidance)
- **CompilationError**: Overall compilation failures with frame context

## Function System

### User-Defined Functions (`functions.ts`)

Support for student-created functions:

- **Arity Checking**: Validate argument counts with educational messages
- **Return Handling**: Special `ReturnValue` wrapper for control flow
- **Scope Management**: Proper function-local variable scoping

### Standard Library (`stdlib.ts`)

Built-in functions designed for educational scenarios:

- **Educational Focus**: Functions that help with learning (logging, debugging)
- **Safe Execution**: Controlled environment with appropriate limits
- **Consistent Behavior**: Predictable results for educational examples

## Integration Points

### UI Frame Format

Standardized data structure sent to Jiki's UI:

- **Consistency**: Same format across JikiScript, JavaScript, Python interpreters
- **Rich Metadata**: Execution state, descriptions, variable changes
- **Timeline Support**: Sequential frames enable scrubbing functionality

### Translation System (`translator.ts`)

Internationalization support:

- **Error Messages**: Localized error descriptions
- **Execution Descriptions**: Multi-language explanation support
- **Educational Content**: Adapt to different learning contexts/cultures
