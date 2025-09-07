# Common Development Issues

This document outlines the most common mistakes developers make when working on the Jiki interpreter system.

## Critical Architecture Violations

### ❌ Runtime Errors as Returned Errors

**WRONG**: Returning runtime errors as `error` in the result breaks UI compatibility.

**✅ CORRECT**: Parse errors are returned as `error`, runtime errors become error frames with `status: "ERROR"`.

### ❌ Manual Frame Creation in Interpreter

**WRONG**: Creating frames manually in interpreter.ts instead of letting the executor handle frame creation internally.

**✅ CORRECT**: Executor handles all frame creation using `addFrame()` methods.

### ❌ Missing executeFrame() Wrapper

**WRONG**: Direct execution without using `executeFrame()` wrapper for consistent frame generation.

**✅ CORRECT**: All execution must use `executeFrame()` wrapper.

## Error Message Format Issues

### ❌ Wrong System Message Format

**WRONG**: Expecting localized messages like "The variable 'x' has not been declared" in tests.

**✅ CORRECT**: System message format `"ErrorType: context: value"` (e.g., `"VariableNotDeclared: name: x"`).

### ❌ Missing Language Configuration in Tests

**WRONG**: Tests without `changeLanguage("system")` setup get English messages.

**✅ CORRECT**: Runtime error tests MUST use system language configuration.

## Location Tracking Problems

### ❌ Expression Location for Statement Errors

**WRONG**: Using only expression location for statement errors shows incomplete error context.

**✅ CORRECT**: Statement locations MUST include full statement span (with semicolons, keywords).

**Any deviation from the shared architecture WILL break UI compatibility!**
