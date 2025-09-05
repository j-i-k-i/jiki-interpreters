# JavaScript Interpreter Architecture

## Pipeline Overview

```
Source Code → Scanner → Parser → Executor → Frames → UI
                ↓         ↓         ↓
             Tokens     AST    Evaluation
                              + Descriptions
```

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
- `UnaryExpression`: Negation and logical NOT
- `GroupingExpression`: Parenthesized expressions
- `IdentifierExpression`: Variable references (planned)
- `CallExpression`: Function calls (planned)

**Statement Types:**

- `ExpressionStatement`: Standalone expressions
- `VariableDeclaration`: let, const, var (planned)
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

### 3. Executor (`src/javascript/executor.ts`)

Evaluates the AST and generates execution frames.

**Modular Design:**
Each expression type has its own executor module:

- `executor/executeLiteralExpression.ts`
- `executor/executeBinaryExpression.ts`
- `executor/executeUnaryExpression.ts`
- `executor/executeGroupingExpression.ts`

**Execution Flow:**

1. Visit each AST node
2. Evaluate child nodes recursively
3. Perform the operation
4. Wrap result in JikiObject
5. Generate frame with description
6. Update environment state

### 4. Describers (`src/javascript/describers/`)

Generate human-readable descriptions of execution steps.

**Describer Modules:**

- `describeBinaryExpression.ts`: Explains arithmetic and logical operations
- `describeUnaryExpression.ts`: Describes negation and NOT operations
- `describeGroupingExpression.ts`: Notes parenthesized evaluation
- `describeExpressionStatement.ts`: Describes standalone expressions
- `describeSteps.ts`: Provides step-by-step execution descriptions

**Description Examples:**

```javascript
2 + 3 * 4;
// Step 1: "Evaluating multiplication: 3 * 4 = 12"
// Step 2: "Evaluating addition: 2 + 12 = 14"

!(5 > 3);
// Step 1: "Comparing values: 5 > 3 evaluates to true"
// Step 2: "Applying logical NOT: !true evaluates to false"
```

### 5. Environment (`src/javascript/environment.ts`)

Manages variable scoping and storage.

**Features:**

- Lexical scoping with nested environments
- Variable declaration and assignment
- Scope chain traversal
- Variable shadowing support

### 6. JikiObjects (`src/javascript/jikiObjects.ts`)

Wrapper objects around JavaScript primitives for enhanced tracking.

**Types:**

- `JikiNumber`: Numeric values with type information
- `JikiString`: String values with length tracking
- `JikiBoolean`: Boolean values with explicit type
- `JikiNull`: Null value representation
- `JikiUndefined`: Undefined value representation

**Benefits:**

- Consistent type information
- Value change tracking
- Educational metadata
- Debugging context

### 7. Frames (`src/javascript/frames.ts`)

Execution snapshots for UI visualization.

**Frame Structure:**

```typescript
interface Frame {
  line: number; // Source line number
  code: string; // Executed code snippet
  status: "SUCCESS" | "ERROR"; // Execution status
  result?: EvaluationResult; // Computation result
  error?: RuntimeError; // Error details if failed
  time: number; // Execution time (simulated)
  timelineTime: number; // Frame sequence number
  description: string; // Human-readable explanation
  context: any; // AST node for debugging
  priorVariables: Variables; // Variable state before
  variables: Variables; // Variable state after
}
```

## Error Handling

### Parse Errors

- Syntax errors with location information
- Expected token messages
- Recovery suggestions

### Runtime Errors

- Type errors with context
- Division by zero handling
- Variable reference errors (planned)
- Educational error messages

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
