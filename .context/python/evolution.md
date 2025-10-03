# Python Interpreter Evolution History

This document tracks the historical development and changes specific to the Python interpreter.

## 2025-10-03: Removal of Executor Location Tracking

- **Removed**: `private location: Location` field from Python executor
- **Change**: Error frames now use precise error locations (`error.location`) instead of broad statement locations
- **Implementation**:
  - Removed location tracking state from executor class
  - Removed location setting/resetting in `executeFrame()` wrapper
  - All error creation uses `error.location` for precise error reporting
  - Changed location parameters from `Location | null` to non-nullable `Location`
  - Introduced `Location.unknown` as fallback for unavailable locations
- **Benefits**:
  - Simpler executor state management
  - More precise error reporting pointing to exact sub-expressions
  - Clearer intent with explicit location handling
  - Reduced complexity in error handling code
- **Impact**: Updated approximately 15+ error creation sites across Python executor modules

## 2025-10-03: Compile Function with CompilationResult Pattern

- **Added**: `compile()` function for parse-only validation
- **Implementation**:
  - New `compile()` function in `src/python/interpreter.ts`
  - Parses source code without executing it
  - Returns `{ success: true }` on successful compilation
  - Returns `{ success: false, error: SyntaxError }` on parse/syntax errors
  - Clean API: `compile(sourceCode, context)` with no fileName parameter
- **Shared Types**:
  - Created `src/shared/errors.ts` with:
    - `SyntaxError` interface that all interpreter SyntaxError classes conform to
    - `CompilationResult` discriminated union type for type-safe error handling
  - Exported from main `src/index.ts` for cross-interpreter consistency
- **Benefits**:
  - Type-safe with discriminated union (`success` field)
  - Cleaner API than throwing exceptions or returning different types
  - Consistent structure across all three interpreters
  - Easy to use: `if (result.success) { ... } else { console.error(result.error) }`
- **Use Case**: Allows syntax validation before execution, useful for educational feedback
- **API Symmetry**: Perfect API consistency across all three interpreters (JikiScript, JavaScript, Python)
- **Test Coverage**: 22 comprehensive tests covering success cases, syntax errors, language features, and edge cases

## 2025-10-03: fileName Parameter Removal

- **Removed**: Unnecessary `fileName` parameter from Python interpreter pipeline
- **Changes Made**:
  - Removed `fileName` parameter from `Scanner` constructor
  - Removed `fileName` parameter from `Parser` constructor
  - Removed `fileName` parameter from `interpret()` function
  - Updated all parser tests to remove fileName argument
- **Rationale**:
  - No functional need for fileName in parsing or execution
  - Improved API symmetry with JavaScript and JikiScript
  - Simplified API surface
  - Reduced complexity without losing functionality
- **Impact**:
  - All 1899 tests passing
  - Cleaner, more consistent API across interpreters
  - Simplified constructor signatures throughout the pipeline

## Modular Description System Implementation (January 2025)

### Background

The Python interpreter's description system was refactored from a monolithic approach to a modular architecture matching the JavaScript interpreter pattern, improving maintainability and educational value.

### Changes Made

**Before**:

- Single `generateDescription()` method in executor.ts with 80+ lines of switch statements
- Hardcoded string concatenations for descriptions
- Mixed concerns between execution and description generation
- No structured format for educational content

**After**:

- Modular describer system with central dispatcher (`frameDescribers.ts`)
- Individual describer files for each AST node type in `src/python/describers/`
- Structured `Description` objects with HTML-formatted result and steps
- Clean separation of concerns between execution and description
- Consistent use of `immutableJikiObject` for point-in-time state snapshots
- Lazy description generation for performance optimization

### Impact

- **Performance**: ~9x improvement through lazy description generation
- **Maintainability**: Each describer is isolated and testable
- **Educational Value**: Structured HTML output with clear "What happened" and "Steps Python Took" sections
- **Consistency**: Aligned with JavaScript interpreter patterns for UI compatibility

## Major Architecture Alignment (January 2025)

### Background

The Python interpreter was extensively refactored to align with the shared architecture patterns established by JikiScript and JavaScript, ensuring consistent behavior across all interpreters.

### Key Changes Made

**Before (Old Architecture)**:

- Manual frame creation scattered throughout interpreter.ts
- Runtime errors returned as `{ error: RuntimeError }`
- Complex frame generation logic mixed with execution logic
- Inconsistent error handling between parse and runtime errors

**After (Aligned Architecture)**:

- Clean separation: interpreter handles parsing, executor handles execution
- Frame management encapsulated within executor using `addFrame()` methods
- Runtime errors become error frames with `status: "ERROR"`
- Consistent `executeFrame()` wrapper pattern for all operations
- Parse errors as returned errors, runtime errors as frames

### Specific Implementation Changes

**1. Executor (`src/python/executor.ts`)**:

- Added `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods
- Added `executeFrame()` wrapper for consistent frame generation
- Added `withExecutionContext()` for proper error boundaries
- Now always returns `error: null` (runtime errors become frames)

**2. Interpreter (`src/python/interpreter.ts`)**:

- Simplified to single `interpret()` function
- Removed manual frame creation logic
- Only handles parse errors as returned errors
- Clean separation between compile and execute phases

**3. System Messages (`src/python/locales/system/translation.json`)**:

- Updated error message format to match shared pattern
- Changed from `"Undefined variable '{{name}}'"` to `"UndefinedVariable: name: {{name}}"`

**4. Tests**:

- Updated error tests to expect error frames instead of returned errors
- Maintained system language configuration for consistent error messages
- Fixed test expectations to match new error handling pattern

### Impact of Changes

- **Consistency**: Python now matches JikiScript and JavaScript architecture exactly
- **UI Compatibility**: Proper frame generation ensures seamless UI integration
- **Testability**: All 128 Python tests passing with improved error handling
- **Maintainability**: Clear separation of concerns, easier to extend

## Object System Evolution

### January 2025: File Standardization

- **File Rename**: `pyObjects.ts` → `jikiObjects.ts` for consistency across all interpreters
- **Field Standardization**: Removed duplicate `pyObject` field from `EvaluationResult`, kept only standardized `jikiObject` field

**Before (Duplicate Fields)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  pyObject: JikiObject; // ❌ Duplicate field - removed
};
```

**After (Standardized)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject; // ✅ Single, consistent field
};
```

### Benefits Achieved

- Eliminated confusion about which field to use
- Consistent with JikiScript and JavaScript interpreters
- Simplified cross-interpreter functionality maintenance

## Implementation Status Evolution

### Core Features Implemented

**Fully Functional Status**: Core Python features implemented and tested

**Current Implementation Coverage**:

- **Numeric Literals**: Integer and floating-point numbers with scientific notation
- **Boolean Literals**: True/False values with logical operations
- **String Literals**: Single and double quoted strings with concatenation
- **Arithmetic Operations**: All Python operators (+, -, \*, /, //, %, \*\*)
- **Comparison Operations**: All comparison operators (>, >=, <, <=, ==, !=)
- **Logical Operations**: Python logical operators (and, or, not)
- **Grouping Expressions**: Parentheses for precedence control
- **Variable System**: Assignment (x = value) and access with proper scoping
- **Unary Negation**: Negation operator (-) for numbers and expressions
- **Control Flow**: Complete if/elif/else statement support with proper indentation
- **Code Blocks**: Python-style indented blocks with 4-space enforcement
- **Runtime Error Handling**: Undefined variable detection and educational messages
- **Scanner**: Complete tokenization including INDENT/DEDENT tokens
- **Parser**: Recursive parser with Python operator precedence
- **Executor**: Modular execution system
- **PyObjects**: Python-specific objects (PyNumber, PyString, PyBoolean)
- **Frame Generation**: Educational step-by-step execution visualization

## Test Coverage Evolution

### Historical Test Numbers

- **158 tests passing** with comprehensive coverage including control flow
- **Concept Tests**: 158 comprehensive tests covering all implemented features
  - Numbers: 5 tests for integer, float, and scientific notation parsing
  - Booleans: 18 tests for True/False literals and logical operations
  - Strings: 16 tests for single/double quotes and concatenation
  - Operations: 30 tests for arithmetic, comparison, logical, and precedence
  - Variables: 22 tests for assignment, access, reassignment, and complex expressions
  - Negation: 17 tests for basic negation, nested negation, and precedence rules
  - If Statements: 30 tests for if/elif/else parsing and execution with indentation
- **Syntax Error Tests**: 14 tests for undefined variables and invalid assignments
- **Parser Tests**: 13 tests for if statement parsing including error cases
- **Integration Tests**: End-to-end Python interpretation
- **Error Tests**: Proper error handling with Python-specific messages

## Python-Specific Features Development

### Indentation Handling

Python's error system includes specific error types for indentation:

- `IndentationError`: General indentation problems
- `UnexpectedIndentation`: Incorrect indentation structure
- 4-space enforcement for educational consistency

### Variable Scoping Implementation

Python implements LEGB (Local, Enclosing, Global, Built-in) scope resolution pattern for future function support.

### Python Syntax Support

- **Operator Precedence**: Python-specific precedence including power operator (\*\*)
- **Python Keywords**: and, or, not, True, False, None
- **Indented Blocks**: Python-style code blocks with proper tokenization

## Modular Architecture Implementation

### Executor Pattern

Python follows the established modular executor pattern:

- Individual executor modules for each AST node type
- Consistent interface: `(executor: Executor, node: ASTNode) → EvaluationResult`
- Complete coverage of implemented language constructs

**Current Executor Coverage**:
**Expression Executors**: Literal, Binary, Unary, Grouping, Identifier expressions
**Statement Executors**: Expression statements, Assignment statements, If statements, Block statements

## Error System Development

### Error Type Coverage

- **12 Syntax Error types**: Python-specific parsing and lexical errors
- **4 Runtime Error types**: Variable access, type operations, undefined variables
- Python-specific indentation error handling
- System message format: `"ErrorType: context: {{variable}}"` or `"Undefined variable '{{name}}'"`

### Translation System

- Self-contained translation system with system/en language support
- Python-specific error messages tailored to Python syntax and conventions
- Independent architecture while following shared naming conventions

## Historical Context

### Why Python Architecture Alignment Was Necessary

- **UI Compatibility**: Ensure consistent frame generation across all interpreters
- **Maintainability**: Eliminate architectural divergence
- **Educational Consistency**: Provide uniform learning experience across languages
- **Testing Reliability**: Establish consistent error handling patterns

### Lessons from Development

- Modular architecture enables rapid feature implementation
- Consistent error handling is critical for educational effectiveness
- Python-specific features (indentation, keywords) require specialized handling
- Cross-interpreter standardization improves maintainability

### Current Status

Python interpreter now serves as the third major interpreter in the Jiki ecosystem:

- Follows shared architecture patterns exactly
- Implements Python-specific syntax and semantics correctly
- Provides educational Python experience with frame-by-frame visualization
- Supports comprehensive Python language features for educational use

### Future Development

**Planned Features**:

- Loops (while, for statements)
- Functions and advanced scoping
- Data structures (lists, dictionaries, tuples)

This evolution establishes Python as a fully integrated component of the Jiki educational ecosystem with complete architectural consistency and comprehensive Python language support.

## Type Coercion Language Feature (January 2025)

### Implementation Overview

Added `allowTypeCoercion` language feature flag to control type coercion behavior in arithmetic operations.

### Feature Details

**Default Behavior (allowTypeCoercion: false)**:

- Only allows operations between same types (string + string, number + number)
- String multiplication works with numbers (`"hi" * 3 = "hihihi"`)
- Boolean arithmetic operations throw `TypeCoercionNotAllowed` errors
- Matches educational mode to prevent confusing implicit conversions

**When Enabled (allowTypeCoercion: true)**:

- Allows Python-style boolean coercion (True = 1, False = 0)
- String + number still throws error (Python doesn't coerce)
- String repetition continues to work (`"hi" * 3`)
- Matches standard Python behavior for most operations

### Implementation Changes

**1. Binary Expression Handler Refactor**:

- Split large `handleBinaryOperation` function into individual handlers
- `handlePlusOperation`, `handleMinusOperation`, `handleMultiplyOperation`, etc.
- Improved maintainability and readability

**2. Python-Specific Behaviors**:

- String repetition supported even with type coercion disabled
- String + number operations never allowed (matches Python)
- Boolean arithmetic allowed only when type coercion is enabled

**3. Error Handling**:

- Added `TypeCoercionNotAllowed` to runtime error types
- Comprehensive error messages with operator and type context
- Consistent with existing error format patterns

**4. String Multiplication Support**:

- `"hello" * 3` produces `"hellohellohello"`
- `3 * "hello"` also works (Python allows both forms)
- Works in both allowTypeCoercion modes (Python native feature)

### Test Coverage

**54 comprehensive tests** covering:

- Type coercion disabled (default): All mixed-type operations throw errors
- Type coercion enabled: Boolean arithmetic works, string+number still errors
- String repetition: Works in both modes
- Complex expressions: Proper error propagation
- Variable interactions: Type checking with stored values

### Technical Details

**Modular Implementation**:

- Each operator handled by dedicated function
- Type checking before operation execution
- Consistent error message formatting
- Proper Python semantics preservation

**Python Compliance**:

- Follows Python's type coercion rules exactly
- String + number never works (unlike JavaScript)
- Boolean treated as integer when coercion enabled
- String repetition as native Python feature

This implementation provides educational control over type coercion while maintaining Python semantic accuracy.
