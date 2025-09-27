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

**AST Nodes**: Literals, binary/unary expressions, grouping, identifiers, assignments, expression statements, variable declarations, block statements, if statements, for statements, while statements, template literals, arrays.

Standard operator precedence from grouping through assignment.

### 3. Executor (`src/javascript/executor.ts`)

Evaluates the AST and generates execution frames.

Modular executor architecture with dedicated modules for each AST node type. Main executor coordinates specialized executor functions with consistent interfaces.

**Performance Optimizations:**

- **Lazy description generation**: Frames include a `generateDescription()` function instead of pre-computed descriptions, deferring expensive string generation until needed
- **Test-only augmentation**: In test environments (`NODE_ENV=test`), frames are augmented with `variables` and `description` fields for backward compatibility

### 4. Describers (`src/javascript/describers/`)

Generate human-readable descriptions for all execution steps including arithmetic operations, variable declarations, and control flow.

### 5. Environment (`src/javascript/environment.ts`)

Nested environment chain supporting lexical scoping, variable declaration, access, updates, and scope isolation with automatic block cleanup.

### 6. JikiObjects (`src/javascript/jsObjects/`)

Wrapper objects extending shared `JikiObject` base class. Each type is now in its own file under `jsObjects/` directory. Supports JSNumber, JSString, JSBoolean, JSNull, JSUndefined, JSList, JSDictionary, and JSFunction with consistent cross-interpreter compatibility.

**Key features:**

- All objects implement `clone()` method (required by base class)
- Primitive types return `self` from `clone()` since they're immutable
- JSList implements deep cloning for proper immutability in frames
- Evaluation results include `immutableJikiObject` field for consistency with JikiScript
- Describers use `immutableJikiObject || jikiObject` pattern for accessing values

**Collections:**

- **JSList**: Represents JavaScript arrays, called "lists" in user-facing messages for consistency
  - Stores array of JikiObjects
  - Implements deep cloning via `clone()` method
  - Formatted as `[ elem1, elem2, ... ]` or `[]` for empty
  - Supports property access via stdlib (e.g., `.length`)
  - Prepared for method support (e.g., `.at()` when CallExpression is implemented)

### 7. Standard Library (`src/javascript/stdlib/`)

Provides built-in properties and methods for JavaScript types:

**Arrays (`src/javascript/stdlib/arrays.ts`)**:

- Properties:
  - `length`: Returns the number of elements in the array
- Methods (prepared, pending CallExpression implementation):
  - `at(index)`: Returns element at index (supports negative indices)

The stdlib system uses an ExecutionContext pattern for future extensibility and consistency with JikiScript patterns.

### 8. Language Features System (`src/javascript/interfaces.ts`)

Configurable language features:

- `allowShadowing`: Controls variable shadowing behavior in nested scopes (default: false)
- `allowTruthiness`: Controls whether non-boolean values can be used in conditions (default: false)
- `requireVariableInstantiation`: Controls whether variables must be initialized when declared (default: true)
- `allowTypeCoercion`: Controls whether type coercion is allowed in operations (default: false)
- `oneStatementPerLine`: Controls whether multiple statements are allowed on a single line (default: false)

### 9. Frame System

Uses unified frame system with JavaScript-specific extensions for educational descriptions.

### 10. AST Node Restrictions System

Supports configurable AST node-level restrictions via `allowedNodes` in LanguageFeatures:

- `allowedNodes: null | undefined` - All nodes allowed (default behavior)
- `allowedNodes: []` - No nodes allowed (maximum restriction)
- `allowedNodes: ["NodeType", ...]` - Only specified nodes allowed

**IMPORTANT: When Adding New AST Node Types**

When implementing support for a new AST node type, you MUST:

1. **Update JavaScriptNodeType**: Add the new node type to the `JavaScriptNodeType` union in `src/javascript/interfaces.ts`
2. **Add Error Type**: Add `<NodeName>NotAllowed` to `SyntaxErrorType` in `src/javascript/error.ts`
3. **Update Parser**: Add `checkNodeAllowed()` call in the relevant parsing method in `src/javascript/parser.ts`
4. **Add Safety Check**: Executor already has generic checks, but verify it handles the new node
5. **Add Tests**: Add test cases for the new node in `tests/javascript/language-features/allowedNodes.test.ts`
6. **Update PLAN.md**: Add the new node type to the "Supported AST Node Types" section

This ensures the node restriction system remains complete and consistent.

## Loop Constructs

### For Loops

- Full C-style for loop with init, condition, and update expressions
- Creates new scope for loop variables
- Each component (init, condition, update) generates its own frame
- Supports all variations: empty init, missing condition, no update

### While Loops

- Standard while loop with condition expression
- Creates new scope for loop body
- Condition evaluated before each iteration
- Generates frame for condition evaluation
- Respects truthiness language feature flag

## Error Handling

Follows shared error pattern: parse errors returned as `error`, runtime errors become error frames. Includes variable, shadowing, and operation errors.

## Extensibility

Modular architecture supports easy extension of expressions, operators, statements, and language features.

Comprehensive testing across scanner, parser, executor, describers, integration, errors, concepts, and scoping.
