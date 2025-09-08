# JavaScript Interpreter Architecture

Follows shared interpreter architecture with JavaScript-specific implementations.

## Component Details

### 1. Scanner (`src/javascript/scanner.ts`)

Tokenizes JavaScript source code into a stream of tokens.

**Responsibilities:**

- Lexical analysis of JavaScript syntax
- Token generation with location tracking
- Comment handling (preserved for educational context)
- String parsing with escape sequences
- Number parsing (integers and decimals)
- Keyword and identifier recognition

Supports single/two-character tokens, literals, keywords, and identifiers.

### 2. Parser (`src/javascript/parser.ts`)

Builds an Abstract Syntax Tree (AST) from tokens using recursive descent parsing.

**AST Nodes**: Literals, binary/unary expressions, grouping, identifiers, assignments, expression statements, variable declarations, block statements, if statements.

Standard operator precedence from grouping through assignment.

### 3. Executor (`src/javascript/executor.ts`)

Evaluates the AST and generates execution frames.

Modular executor architecture with dedicated modules for each AST node type. Main executor coordinates specialized executor functions with consistent interfaces.

### 4. Describers (`src/javascript/describers/`)

Generate human-readable descriptions for all execution steps including arithmetic operations, variable declarations, and control flow.

### 5. Environment (`src/javascript/environment.ts`)

Nested environment chain supporting lexical scoping, variable declaration, access, updates, and scope isolation with automatic block cleanup.

### 6. JikiObjects (`src/javascript/jikiObjects.ts`)

Wrapper objects extending shared `JikiObject` base class. Supports JSNumber, JSString, JSBoolean, JSNull, JSUndefined with consistent cross-interpreter compatibility.

### 7. Language Features System (`src/javascript/interfaces.ts`)

Configurable language features:

- `allowShadowing`: Controls variable shadowing behavior in nested scopes (default: false)
- `allowTruthiness`: Controls whether non-boolean values can be used in conditions (default: false)
- `requireVariableInstantiation`: Controls whether variables must be initialized when declared (default: true)
- `allowTypeCoercion`: Controls whether type coercion is allowed in operations (default: false)

### 8. Frame System

Uses unified frame system with JavaScript-specific extensions for educational descriptions.

## Error Handling

Follows shared error pattern: parse errors returned as `error`, runtime errors become error frames. Includes variable, shadowing, and operation errors.

## Extensibility

Modular architecture supports easy extension of expressions, operators, statements, and language features.

Comprehensive testing across scanner, parser, executor, describers, integration, errors, concepts, and scoping.
