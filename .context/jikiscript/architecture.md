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
- **Key Components**:
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

#### Describers (`describers/`)

- Generate human-readable explanations of execution steps
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
