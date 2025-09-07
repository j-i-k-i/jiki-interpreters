# Python Interpreter Architecture

> **⚠️ CRITICAL**: This interpreter MUST follow the [Shared Interpreter Architecture](../shared/interpreter-architecture.md) patterns exactly to ensure UI compatibility. Any deviation will break the system.

## Architecture Compliance

✅ **Follows Shared Architecture**: This interpreter implements the mandatory patterns defined in the shared architecture document:

- **Error Handling**: Parse errors as returned errors, runtime errors as error frames
- **Executor Pattern**: Uses `addFrame()`, `executeFrame()`, and proper error context management
- **Frame Structure**: Generates frames with exact shared structure
- **Location Tracking**: Accurate statement-level location tracking for error frames
- **Testing**: Uses system language for error message consistency

## Recent Architecture Alignment (2025-01)

**Major Refactoring**: The Python interpreter was extensively refactored to align with the shared architecture patterns established by JikiScript and JavaScript.

### Key Changes Made

**Before (Old Architecture):**

- Manual frame creation scattered throughout interpreter.ts
- Runtime errors returned as `{ error: RuntimeError }`
- Complex frame generation logic mixed with execution logic
- Inconsistent error handling between parse and runtime errors

**After (Aligned Architecture):**

- Clean separation: interpreter handles parsing, executor handles execution
- Frame management encapsulated within executor using `addFrame()` methods
- Runtime errors become error frames with `status: "ERROR"`
- Consistent `executeFrame()` wrapper pattern for all operations
- Parse errors as returned errors, runtime errors as frames

### Specific Changes Made

1. **Executor (`src/python/executor.ts`)**:
   - Added `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods
   - Added `executeFrame()` wrapper for consistent frame generation
   - Added `withExecutionContext()` for proper error boundaries
   - Now always returns `error: null` (runtime errors become frames)

2. **Interpreter (`src/python/interpreter.ts`)**:
   - Simplified to single `interpret()` function
   - Removed manual frame creation logic
   - Only handles parse errors as returned errors
   - Clean separation between compile and execute phases

3. **System Messages (`src/python/locales/system/translation.json`)**:
   - Updated error message format to match shared pattern
   - Changed from `"Undefined variable '{{name}}'"` to `"UndefinedVariable: name: {{name}}"`

4. **Tests**:
   - Updated error tests to expect error frames instead of returned errors
   - Maintained system language configuration for consistent error messages
   - Fixed test expectations to match new error handling pattern

### Impact

- **Consistency**: Python now matches JikiScript and JavaScript architecture exactly
- **UI Compatibility**: Proper frame generation ensures seamless UI integration
- **Testability**: All 128 Python tests passing with improved error handling
- **Maintainability**: Clear separation of concerns, easier to extend

## Python-Specific Implementation

## Component Details

### 1. Scanner (`src/python/scanner.ts`)

Tokenizes Python source code into a stream of tokens.

**Responsibilities:**

- Lexical analysis of Python syntax
- Token generation with location tracking
- Comment handling (preserved for educational context)
- String parsing with Python-specific features (single/double quotes, triple quotes)
- Number parsing (integers, floats, scientific notation)
- Keyword and identifier recognition

**Token Types:**

- Single-character tokens: `(`, `)`, `{`, `}`, `[`, `]`, `,`, `.`, `;`, etc.
- Multi-character tokens: `==`, `!=`, `<=`, `>=`, `and`, `or`, `not`, etc.
- Literals: strings, numbers, True, False, None
- Keywords: if, else, elif, for, while, def, return, etc.
- Identifiers: variable and function names

### 2. Parser (`src/python/parser.ts`)

Builds an Abstract Syntax Tree (AST) from tokens using recursive descent parsing.

**Expression Types:**

- `LiteralExpression`: Numbers, strings, booleans, None ✅ **IMPLEMENTED**
- `BinaryExpression`: Arithmetic and logical operations ✅ **IMPLEMENTED**
- `UnaryExpression`: Negation and logical not ✅ **IMPLEMENTED**
- `GroupingExpression`: Parenthesized expressions ✅ **IMPLEMENTED**
- `IdentifierExpression`: Variable references ✅ **IMPLEMENTED**
- `CallExpression`: Function calls (planned)

**Statement Types:**

- `ExpressionStatement`: Standalone expressions ✅ **IMPLEMENTED**
- `AssignmentStatement`: Variable assignments ✅ **IMPLEMENTED**
- `IfStatement`: Conditionals (planned)
- `WhileStatement`: Loops (planned)
- `FunctionDeclaration`: Functions (planned)

**Operator Precedence (Python-specific):**

1. Grouping `()`
2. Unary `-`, `not`
3. Power `**` (right-associative)
4. Multiplicative `*`, `/`, `//`, `%`
5. Additive `+`, `-`
6. Relational `<`, `>`, `<=`, `>=`
7. Equality `==`, `!=`
8. Logical AND `and`
9. Logical OR `or`

### 3. Executor (`src/python/executor.ts`)

Evaluates the AST and generates execution frames.

**Modular Design:**
Each expression and statement type has its own executor module:

**Expression Executors:**

- `executor/executeLiteralExpression.ts` ✅ **IMPLEMENTED**
- `executor/executeBinaryExpression.ts` ✅ **IMPLEMENTED**
- `executor/executeUnaryExpression.ts` ✅ **IMPLEMENTED**
- `executor/executeGroupingExpression.ts` ✅ **IMPLEMENTED**
- `executor/executeIdentifierExpression.ts` ✅ **IMPLEMENTED**

**Statement Executors:**

- `executor/executeExpressionStatement.ts` ✅ **IMPLEMENTED**
- `executor/executeAssignmentStatement.ts` ✅ **IMPLEMENTED**

**Modular Executor Pattern:**

The Python interpreter follows the same consistent modular pattern as JavaScript:

1. **Main Executor**: The `Executor` class coordinates execution by delegating to specialized functions
2. **Individual Executors**: Each AST node type has its own dedicated executor function
3. **Consistent Interface**: All executor functions take `(executor: Executor, node: ASTNode)` and return `EvaluationResult`
4. **Single Responsibility**: Each executor handles one specific Python construct
5. **Easy Extension**: New Python features require only adding a new executor module

**Execution Flow:**

1. Main executor receives AST node via `executeStatement()` or `evaluate()`
2. Delegates to appropriate specialized executor function
3. Executor function evaluates child nodes recursively
4. Performs the Python-specific operation logic
5. Wraps result in PyObject
6. Returns structured EvaluationResult
7. Main interpreter generates frame with description
8. Updates environment state as needed

### 4. Describers (`src/python/describers/`)

Generate human-readable descriptions of execution steps.

**Describer Modules:**

- `describeLiteralExpression.ts`: Explains number/string/boolean values
- `describeBinaryExpression.ts`: Explains arithmetic and logical operations
- `describeUnaryExpression.ts`: Describes negation and not operations
- `describeGroupingExpression.ts`: Notes parenthesized evaluation
- `describeExpressionStatement.ts`: Describes standalone expressions

**Description Examples:**

```python
42
# "Evaluating number literal: 42"

3.14 + 2.86
# Step 1: "Evaluating addition: 3.14 + 2.86 = 6.0"

not True
# "Applying logical not: not True evaluates to False"
```

### 5. Environment (`src/python/environment.ts`)

Manages variable scoping and storage using Python's scoping rules.

**Python-Specific Scoping:**

- **LEGB Rule**: Local, Enclosing, Global, Built-in scope resolution
- **Function Scoping**: Variables are scoped to functions, not blocks
- **Global/Nonlocal Keywords**: Explicit scope modification (planned)

### 6. PyObjects (`src/python/pyObjects.ts`)

Wrapper objects around Python primitives for enhanced tracking.

**Architecture:**

- All Python objects extend the shared `JikiObject` base class from `src/shared/jikiObject.ts`
- Provides consistent interface across all interpreters
- Maintains Python-specific functionality while sharing common infrastructure

**Types:**

- `PyNumber`: Numeric values (int/float distinction) with Python semantics
- `PyString`: String values with Python-specific features
- `PyBoolean`: True/False values
- `PyNone`: None value representation
- `PyList`: List values (planned)
- `PyDict`: Dictionary values (planned)

**Python-Specific Features:**

- Integer/float type distinction
- String immutability
- Truthiness rules (empty containers are falsy)
- Type coercion behaviors

### 7. Frame System

**Shared Framework (`src/shared/frames.ts`):**
The Python interpreter uses the unified frame system shared by all interpreters.

**Python-Specific Extensions (`src/python/frameDescribers.ts`):**

- `PythonFrame`: Extends base Frame with Python-specific result types
- `describeFrame()`: Generates educational descriptions for Python execution steps
- Integrates with shared frame system while maintaining Python-specific functionality

## Error Handling

### Parse Errors

- Syntax errors with location information
- Expected token messages with Python context
- Indentation error handling (planned)
- Recovery suggestions

### Runtime Errors

- Type errors with Python-specific context
- **UndefinedVariable errors**: Proper error handling for accessing undefined variables ✅ **IMPLEMENTED**
- Division by zero handling
- Educational error messages with Python terminology
- **Frame-based error reporting**: Errors captured in execution frames with location information ✅ **IMPLEMENTED**

## Python-Specific Features

### Number Handling

- Integer vs float distinction
- Arbitrary precision integers (educational representation)
- Scientific notation support
- Division behavior (`/` vs `//`)

### String Handling

- Single, double, and triple quote support
- Escape sequences
- String formatting (planned)
- Unicode support

## Extensibility

The modular architecture allows easy addition of Python features:

1. **New Expression Types**: Add parser rule, create executor module, add describer
2. **New Operators**: Update scanner, add to parser precedence, implement in executor
3. **New Statement Types**: Add parser rule, implement execution logic, create describer
4. **Python Features**: Extend environment for scoping, add PyObject types as needed

## Testing Strategy

- **Scanner Tests**: Token generation accuracy with Python syntax
- **Parser Tests**: AST construction correctness for Python grammar
- **Executor Tests**: Evaluation results and frame generation
- **Concept Tests**: 128 comprehensive tests covering all implemented features ✅ **IMPLEMENTED**
  - **Numbers**: 5 tests for integer, float, and scientific notation parsing
  - **Booleans**: 18 tests for True/False literals and logical operations
  - **Strings**: 16 tests for single/double quotes and concatenation
  - **Operations**: 30 tests for arithmetic, comparison, logical, and precedence
  - **Variables**: 22 tests for assignment, access, reassignment, and complex expressions
  - **Negation**: 17 tests for basic negation, nested negation, and precedence rules
- **Syntax Error Tests**: 14 tests for undefined variables and invalid assignments ✅ **IMPLEMENTED**
- **Integration Tests**: End-to-end Python interpretation ✅ **IMPLEMENTED**
- **Error Tests**: Proper error handling with Python-specific messages ✅ **IMPLEMENTED**
