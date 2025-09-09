# Python Interpreter Architecture

Follows shared interpreter architecture with Python-specific implementations.

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

Supports Python tokens including single/multi-character operators, literals, keywords, and identifiers.

### 2. Parser (`src/python/parser.ts`)

Builds an Abstract Syntax Tree (AST) from tokens using recursive descent parsing.

**AST Nodes**: Literals, binary/unary expressions, grouping, identifiers, expression/assignment statements, if/elif/else statements, indented block statements.

Python-specific operator precedence from grouping through logical OR, including power operator.

### 3. Executor (`src/python/executor.ts`)

Evaluates the AST and generates execution frames.

Modular executor architecture with dedicated modules for each AST node type. Main executor coordinates specialized executor functions with consistent interfaces.

### 4. Describers (`src/python/describers/`)

Generate human-readable descriptions for all Python execution steps including literals, arithmetic, logical operations, and control flow.

### 5. Environment (`src/python/environment.ts`)

Python-specific scoping with LEGB rule (Local, Enclosing, Global, Built-in) and function-level variable scoping.

### 6. JikiObjects (`src/python/jikiObjects.ts`)

Wrapper objects extending shared `JikiObject` base class. Supports PyNumber, PyString, PyBoolean, PyNone with Python-specific features like int/float distinction and truthiness rules.

### 7. Frame System

Uses unified frame system with Python-specific extensions for educational descriptions.

## Error Handling

Parse errors with Python syntax context and runtime errors including undefined variables, type errors, and division by zero with educational messaging.

## Python-Specific Features

**Numbers**: Integer/float distinction, scientific notation, division behavior
**Strings**: Single/double/triple quotes, escape sequences, Unicode support
**Boolean Operations**: Full support for `not`, `and`, and `or` operators with Python truthiness rules
**Language Features**:

- `allowTruthiness` (default: false) - Controls whether non-boolean values can be used in boolean contexts (if statements, logical operators)
- `allowTypeCoercion` (default: false) - Controls type coercion in arithmetic and other operations

## Extensibility

Modular architecture supports easy extension of Python expressions, operators, statements, and language features.

Comprehensive testing across scanner, parser, executor, concepts, syntax errors, and integration with Python-specific validation.
