# JavaScript Interpreter Architecture

> **⚠️ CRITICAL**: This interpreter MUST follow the [Shared Interpreter Architecture](../shared/interpreter-architecture.md) patterns exactly to ensure UI compatibility. Any deviation will break the system.

## Architecture Compliance

✅ **Follows Shared Architecture**: This interpreter implements the mandatory patterns defined in the shared architecture document:

- **Error Handling**: Parse errors as returned errors, runtime errors as error frames
- **Executor Pattern**: Uses `addFrame()`, `executeFrame()`, and proper error context management
- **Frame Structure**: Generates frames with exact shared structure
- **Location Tracking**: Accurate statement-level location tracking for error frames
- **Testing**: Uses system language for error message consistency

## Recent Architecture Alignment (2025-01)

**Major Refactoring**: The JavaScript interpreter was extensively refactored to align with JikiScript's proven architecture patterns.

### Key Structural Changes Made

**Before (Divergent Architecture):**

- Complex `executeStatementsWithFrames()` function in interpreter
- Manual frame creation scattered throughout interpreter.ts
- Runtime errors returned as `{ error: RuntimeError }`
- Frame management mixed with execution logic
- Inconsistent error handling between parse and runtime errors

**After (Aligned Architecture):**

- Clean separation: interpreter handles parsing, executor handles execution
- Frame management encapsulated within executor using `addFrame()` methods
- Runtime errors become error frames with `status: "ERROR"`
- Consistent `executeFrame()` wrapper pattern for all operations
- Parse errors as returned errors, runtime errors as frames

### Specific Changes Made

1. **Executor (`src/javascript/executor.ts`)**:
   - Added `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods
   - Added `executeFrame()` wrapper for consistent frame generation
   - Added `withExecutionContext()` for proper error boundaries
   - Now always returns `error: null` (runtime errors become frames)

2. **Interpreter (`src/javascript/interpreter.ts`)**:
   - Simplified to single `interpret()` function
   - Removed complex `executeStatementsWithFrames()`
   - Only handles parse errors as returned errors
   - Clean separation between compile and execute phases

3. **Parser (`src/javascript/parser.ts`)**:
   - Fixed `consumeSemicolon()` to return token for location tracking
   - Fixed ExpressionStatement location to include semicolon in span
   - Improved statement location accuracy for error reporting

4. **Tests**:
   - Updated error tests to expect error frames instead of returned errors
   - Added system language configuration for consistent error messages
   - Fixed test expectations to match new error handling pattern

### Impact

- **Consistency**: JavaScript now matches JikiScript's proven architecture exactly
- **Maintainability**: Clear separation of concerns, easier to extend
- **Testability**: 313 tests passing with improved error handling
- **UI Compatibility**: Proper frame generation ensures UI integration works correctly

## JavaScript-Specific Implementation

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

**Token Types:**

- Single-character tokens: `(`, `)`, `{`, `}`, `,`, `.`, `;`, etc.
- Two-character tokens: `==`, `!=`, `<=`, `>=`, `&&`, `||`, etc.
- Literals: strings, numbers, booleans, null, undefined
- Keywords: if, else, for, while, function, return, etc.
- Identifiers: variable and function names

### 2. Parser (`src/javascript/parser.ts`)

Builds an Abstract Syntax Tree (AST) from tokens using recursive descent parsing.

**Expression Types:**

- `LiteralExpression`: Numbers, strings, booleans, null, undefined
- `BinaryExpression`: Arithmetic and logical operations
- `UnaryExpression`: Negation (`-x`), unary plus (`+x`), and logical NOT (`!x`)
- `GroupingExpression`: Parenthesized expressions
- `IdentifierExpression`: Variable references
- `AssignmentExpression`: Variable assignments with `=` operator (`x = value`)
- `CallExpression`: Function calls (planned)

**Statement Types:**

- `ExpressionStatement`: Standalone expressions
- `VariableDeclaration`: Variable declarations with `let` keyword
- `BlockStatement`: Code blocks with lexical scope isolation `{ ... }`
- `IfStatement`: Conditionals (planned)
- `WhileStatement`: Loops (planned)
- `FunctionDeclaration`: Functions (planned)

**Operator Precedence:**

1. Grouping `()`
2. Unary `-`, `!`
3. Multiplicative `*`, `/`, `%`
4. Additive `+`, `-`
5. Relational `<`, `>`, `<=`, `>=`
6. Equality `==`, `!=`
7. Logical AND `&&`
8. Logical OR `||`
9. Assignment `=` (right-associative)

### 3. Executor (`src/javascript/executor.ts`)

Evaluates the AST and generates execution frames.

**Modular Design:**
Each expression and statement type has its own executor module:

**Expression Executors:**

- `executor/executeLiteralExpression.ts`
- `executor/executeBinaryExpression.ts`
- `executor/executeUnaryExpression.ts`
- `executor/executeGroupingExpression.ts`
- `executor/executeIdentifierExpression.ts`
- `executor/executeAssignmentExpression.ts`

**Statement Executors:**

- `executor/executeExpressionStatement.ts`
- `executor/executeVariableDeclaration.ts`
- `executor/executeBlockStatement.ts`

**Modular Executor Pattern:**

The JavaScript interpreter follows a consistent modular pattern for all expressions and statements:

1. **Main Executor**: The `Executor` class acts as a coordinator, delegating to specialized executor functions
2. **Individual Executors**: Each AST node type has its own dedicated executor function (e.g., `executeBlockStatement.ts`)
3. **Consistent Interface**: All executor functions take `(executor: Executor, node: ASTNode)` and return `EvaluationResult`
4. **Single Responsibility**: Each executor handles one specific language construct
5. **Easy Extension**: New language features require only adding a new executor module

**Execution Flow:**

1. Main executor receives AST node via `executeStatement()` or `evaluate()`
2. Delegates to appropriate specialized executor function
3. Executor function evaluates child nodes recursively
4. Performs the operation-specific logic
5. Wraps result in JikiObject
6. Returns structured EvaluationResult
7. Main interpreter generates frame with description
8. Updates environment state as needed

**Benefits of This Pattern:**

- **Maintainability**: Each language construct is isolated in its own module
- **Testability**: Individual executors can be tested in isolation
- **Extensibility**: New features don't require modifying the main executor
- **Clarity**: Code organization mirrors the language structure
- **Consistency**: Uniform interfaces across all executor modules

### 4. Describers (`src/javascript/describers/`)

Generate human-readable descriptions of execution steps.

**Describer Modules:**

- `describeBinaryExpression.ts`: Explains arithmetic and logical operations
- `describeUnaryExpression.ts`: Describes negation and NOT operations
- `describeGroupingExpression.ts`: Notes parenthesized evaluation
- `describeExpressionStatement.ts`: Describes standalone expressions
- `describeVariableDeclaration.ts`: Explains variable declarations and initialization
- `describeBlockStatement.ts`: Explains block scope behavior and variable isolation
- `describeSteps.ts`: Provides step-by-step execution descriptions

**Description Examples:**

```javascript
2 + 3 * 4;
// Step 1: "Evaluating multiplication: 3 * 4 = 12"
// Step 2: "Evaluating addition: 2 + 12 = 14"

!(5 > 3);
// Step 1: "Comparing values: 5 > 3 evaluates to true"
// Step 2: "Applying logical NOT: !true evaluates to false"

let count = 42;
// "Declared variable 'count' and initialized it with value 42"

count;
// "Accessed variable 'count' with value 42"

{
  let x = 10;
  x + 5;
}
// Block Frame: "This block executed 2 statements in their own scope."
// Variable Frame: "Declared variable 'x' and initialized it with value 10"
// Access Frame: "Accessed variable 'x' with value 10"
// Addition Frame: "Evaluating addition: 10 + 5 = 15"
```

### 5. Environment (`src/javascript/environment.ts`)

Manages variable scoping and storage using a nested environment chain.

**Architecture:**

```
Global Environment
    ↓ (enclosing)
Block Environment
    ↓ (enclosing)
Nested Block Environment
```

**Core Features:**

- **Lexical Scoping**: Variables are scoped to the block where they are declared
- **Environment Chain**: Each new scope creates a child environment with the current as parent
- **Variable Declaration**: `define(name, value)` creates variables in the current scope
- **Variable Access**: `get(name)` searches up the environment chain until found
- **Variable Updates**: `update(name, value)` modifies existing variables in their original scope
- **Scope Isolation**: Variables in child scopes don't leak to parent scopes

**Block Statement Scoping:**

When executing a block statement `{ ... }`:

1. Create new `Environment(currentEnvironment)` as child scope
2. Switch executor to use the new environment
3. Execute all statements inside the block with new environment
4. Restore previous environment when block completes
5. Variables declared in block are automatically cleaned up

**Examples:**

```javascript
let outerVar = 10; // Global scope
{
  let blockVar = 20; // Block scope - only accessible inside block
  outerVar; // ✓ Accessible: searches up to global scope
}
blockVar; // ✗ Error: blockVar not accessible outside block
```

**Environment Methods:**

- `define(name, value)`: Creates variable in current scope
- `get(name)`: Retrieves variable value, searching up chain
- `update(name, value)`: Updates existing variable in its original scope, returns boolean success
- `getAllVariables()`: Returns flattened view of all accessible variables

**Variable Assignment:**

Variable assignments use the `=` operator and can update variables in the current scope or parent scopes:

```javascript
let x = 5; // Variable declaration
x = 10; // Variable assignment - updates existing variable
y = 15; // ✗ Runtime Error: Cannot assign to undeclared variable

{
  let innerVar = 1;
  x = 20; // ✓ Updates x in parent scope
  innerVar = 2; // ✓ Updates innerVar in current scope
}
x; // Value is 20 (updated from inner scope)
innerVar; // ✗ Runtime Error: Variable not accessible outside block
```

### 6. JSObjects (`src/javascript/jsObjects.ts`)

Wrapper objects around JavaScript primitives for enhanced tracking.

**Architecture:**

- All JavaScript objects extend the shared `JikiObject` base class from `src/shared/jikiObject.ts`
- Provides consistent interface across all interpreters
- Maintains JavaScript-specific functionality while sharing common infrastructure

**Types:**

- `JSNumber`: Numeric values with type information
- `JSString`: String values with length tracking
- `JSBoolean`: Boolean values with explicit type
- `JSNull`: Null value representation
- `JSUndefined`: Undefined value representation

**Benefits:**

- Consistent type information across interpreters
- Value change tracking
- Educational metadata
- Debugging context
- Cross-interpreter compatibility

### 7. Frame System

**Follows Shared Framework**: Uses the unified frame system defined in the [Shared Architecture](../shared/interpreter-architecture.md#frame-structure-mandatory).

**JavaScript-Specific Extensions (`src/javascript/frameDescribers.ts`):**

- `JavaScriptFrame`: Extends base Frame with JavaScript-specific result types
- `describeFrame()`: Generates educational descriptions for JavaScript execution steps
- Integrates with shared frame system while maintaining JavaScript-specific functionality

## Error Handling

**Follows Shared Pattern**: Implements the mandatory error handling pattern from the [Shared Architecture](../shared/interpreter-architecture.md#error-handling-pattern-mandatory).

### Parse Errors (Returned as `error`)

- Syntax errors with location information
- Expected token messages
- Recovery suggestions
- Empty frames array

### Runtime Errors (Become Error Frames)

- Never returned as `error` - always become frames with `status: "ERROR"`
- Type errors with context
- Variable reference errors for undefined variables
- Educational error messages with location context
- Use system message format for consistency

## Extensibility

The modular architecture allows easy addition of new features:

1. **New Expression Types**: Add parser rule, create executor module, add describer
2. **New Operators**: Update scanner, add to parser precedence, implement in executor
3. **New Statement Types**: Add parser rule, implement execution logic, create describer
4. **Language Features**: Extend environment for scoping, add JikiObject types as needed

## Testing Strategy

- **Scanner Tests**: Token generation accuracy
- **Parser Tests**: AST construction correctness
- **Executor Tests**: Evaluation results and frame generation
- **Describer Tests**: Description accuracy and clarity
- **Integration Tests**: End-to-end interpretation
- **Error Tests**: Proper error handling and messages
- **Concept Tests**: Feature-specific testing for variables, blocks, arithmetic, etc.
- **Syntax Error Tests**: Comprehensive error coverage for invalid syntax
- **Scope Tests**: Variable scoping behavior in blocks and nested environments
