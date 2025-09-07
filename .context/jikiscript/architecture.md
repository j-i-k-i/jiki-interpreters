# JikiScript Architecture

The JikiScript interpreter follows a traditional compiler pipeline with educational enhancements at each stage.

## Pipeline Overview

```
Source Code → Scanner → Parser → Executor → Frames/UI
```

## Core Components

### 1. Scanner (`scanner.ts`)

- **Role**: Lexical analysis - converts source code into tokens
- **Input**: Raw JikiScript source code string
- **Output**: Array of tokens (identifiers, operators, keywords, literals)
- **Educational Features**:
  - Language feature filtering (can disable certain syntax)
  - Friendly syntax error messages
  - Token location tracking for error reporting

### 2. Parser (`parser.ts`)

- **Role**: Syntax analysis - builds Abstract Syntax Tree (AST)
- **Input**: Token stream from Scanner
- **Output**: AST of Expressions and Statements
- **Educational Features**:
  - Configurable syntax rules based on enabled language features
  - Rich error context and suggestions
  - Location tracking for debugging

### 3. Executor (`executor.ts` + `executor/`)

- **Role**: Interprets AST and generates execution frames
- **Input**: AST from Parser
- **Output**: Execution frames with variable states and descriptions

**Modular Executor Pattern:**

JikiScript uses a fully modular executor architecture where each language construct has its own dedicated executor:

1. **Main Executor**: The `Executor` class coordinates execution by delegating to specialized functions
2. **Individual Executors**: Each AST node type has its own executor module (e.g., `executor/executeIfStatement.ts`)
3. **Visitor Pattern**: Main executor uses `visit*` methods that delegate to `execute*` functions
4. **Consistent Interface**: All executors follow uniform patterns and return structured results
5. **Complete Coverage**: Every expression and statement type has its own executor module

**Available Executors:**

- **Expression Executors**: `executeBinaryExpression`, `executeLiteralExpression`, `executeVariableLookupExpression`, etc.
- **Statement Executors**: `executeIfStatement`, `executeBlockStatement`, `executeFunctionStatement`, etc.
- **Specialized Executors**: `executeMethodCallExpression`, `executeInstantiationExpression`, etc.

**Key Components**:

- **Environment**: Variable scoping and storage
- **ExecutionContext**: Runtime state and configuration
- **Frame Generation**: Captures each execution step
- **Specialized Executors**: Handle different expression/statement types

### 4. Support Systems

#### Expressions (`expression.ts`)

- Represent values and computations (literals, variables, function calls, etc.)
- Each expression type has corresponding executor and describer

#### Statements (`statement.ts`)

- Represent actions and control flow (assignments, loops, conditionals, etc.)
- Each statement type has corresponding executor and describer

#### JikiObjects (`objects.ts`)

**⚠️ Updated (2025-01)**: File renamed from `jikiObjects.ts` to `objects.ts` as part of object field standardization.

- **Architecture**: All JikiScript objects extend the shared `JikiObject` base class from `src/shared/jikiObject.ts`
- **Cross-Interpreter Compatibility**: Uses same base class as JavaScript and Python interpreters
- **JikiScript-Specific Features**: Maintains `toArg()` method and educational features
- **Object Types**: JikiNumber, JikiString, JikiBoolean, JikiList, JikiDictionary, etc.
- **Standardization (2025-01)**: The original pattern that other interpreters now follow

#### Frame System

- **Shared Framework**: Uses unified frame system from `src/shared/frames.ts`
- **JikiScript Extensions**: `frameDescribers.ts` provides JikiScript-specific educational descriptions
- **Cross-Interpreter Consistency**: Same frame format used by all interpreters for UI integration

#### Describers (`describers/` + `frameDescribers.ts`)

- Generate human-readable explanations of execution steps
- `frameDescribers.ts`: Main entry point with `describeFrame()` function
- Individual describer modules for each statement/expression type
- Provides educational context for what each line of code does
- Localized descriptions for different languages/audiences

## Execution Flow

1. **Scanning**: Break source code into meaningful tokens
2. **Parsing**: Build AST respecting enabled language features
3. **Execution**: Walk AST while generating frames:
   - Track variable changes in Environment
   - Generate descriptive text for each step
   - Capture execution state at each frame
   - Handle educational error reporting
4. **Frame Output**: Provide structured data for Jiki UI consumption

## Educational Integration Points

- **Language Features**: Progressive syntax enabling/disabling
- **Error Handling**: Student-friendly error messages with suggestions
- **Execution Descriptions**: Plain-language explanations of code behavior
- **Variable Tracking**: Detailed state snapshots for debugging
- **Frame Generation**: Timeline data for interactive scrubbing
