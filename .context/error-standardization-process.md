# Error Standardization Process

This document outlines the complete step-by-step process used to standardize JikiScript error names and can be replicated for JavaScript and Python interpreters.

## Overview

The standardization process involves:

1. Analyzing existing error structures
2. Applying the naming convention from `.context/error-naming-standard.md`
3. Aligning error names with English translation granularity (canonical source)
4. Updating system translations to follow the `Name: context: {{variable}}` pattern
5. Alphabetizing all files for maintainability
6. Updating all code references
7. Fixing tests to match new error names and messages

## Detailed Steps

### Step 1: Analyze Current Error Structure

**Files examined:**

- `src/[language]/error.ts` - Error type definitions
- `src/[language]/locales/en/translation.json` - English messages (canonical)
- `src/[language]/locales/system/translation.json` - System messages
- `tests/[language]/` - All test files

**For JikiScript:**

- Found 100+ hyper-specific error types
- English translation contained canonical granularity decisions
- System translation had inconsistent naming
- Some error names didn't match English message specificity

### Step 2: Apply Naming Convention

**Convention applied:**

- Pattern: `[Prefix][Core][Context]`
- Prefixes: Missing, Invalid, Unexpected, Malformed, TypeError, RangeError, StateError
- Names must match English message granularity
- If English mentions "function", error name includes "Function"
- If English is generic, error name stays generic

**Example transformations:**

- `"CannotStoreNullFromFunction"` → `"StateErrorCannotStoreNullValueFromFunction"` (English mentions "function")
- `"ExpressionIsNull"` → `"ExpressionEvaluatedToNullValue"` (matches English wording)

### Step 3: Update Translation Files

**English translation (`locales/en/translation.json`):**

- Canonical source - only alphabetized, no name changes
- Contains human-readable educational messages
- Granularity decisions are authoritative

**System translation (`locales/system/translation.json`):**

- Updated to match new error names exactly
- Format: `"ErrorName": "ErrorName: context: {{variable}}"`
- Variables follow `: variableName: {{variableName}}` pattern
- No variables = just the error name

### Step 4: Update Error Type Definitions

**File: `src/[language]/error.ts`**

Updated type definitions:

```typescript
export type SyntaxErrorType =
  | "DuplicateParameterNameInFunctionDeclaration"
  | "ExceededMaximumNumberOfParametersInFunction";
// ... (alphabetically sorted)

export type SemanticErrorType = "DuplicateVariableNameInScope";
// ... (alphabetically sorted)

export type RuntimeErrorType = "AccessorUsedOnNonInstanceObject" | "ClassAlreadyDefinedInScope";
// ... (alphabetically sorted)
```

### Step 5: Update All Code References

**Files updated with find/replace:**

- `src/[language]/parser.ts` - Parser error throwing
- `src/[language]/executor.ts` - Runtime error throwing
- `src/[language]/executor/*.ts` - Executor module error throwing
- `src/[language]/scanner.ts` - Scanner error throwing

**Commands used:**

```bash
sed -i '' 's/OldErrorName/NewErrorName/g' file1.ts file2.ts file3.ts
```

### Step 6: Update Tests

**Files updated:**

- `tests/[language]/syntaxErrors.test.ts` - Updated expected error types and messages
- `tests/[language]/runtimeErrors.test.ts` - Updated expected error types and messages
- Other test files referencing specific errors

**Changes made:**

- Error type expectations: `expectFrameToBeError(frame, code, "NewErrorName")`
- Message expectations: `expect(error.message).toBe("NewErrorName")` (system format)

### Step 7: Alphabetize All Files

**Script created: `alphabetize_errors.js`**

```javascript
// Alphabetizes JSON sections and error type definitions
function alphabetizeJsonSection(obj, sectionName) {
  const entries = Object.entries(obj[sectionName]);
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  obj[sectionName] = Object.fromEntries(entries);
}

function alphabetizeErrorTypes() {
  // Alphabetizes SyntaxErrorType, SemanticErrorType, RuntimeErrorType
}
```

**Files alphabetized:**

- `src/[language]/locales/en/translation.json`
- `src/[language]/locales/system/translation.json`
- `src/[language]/error.ts`

### Step 8: Verification

**Tests run:**

```bash
bun test tests/[language]/syntaxErrors.test.ts
bun test tests/[language]/runtimeErrors.test.ts
bun test tests/[language]/
```

**Success criteria:**

- All tests pass
- Error names follow naming convention
- Translation files are aligned
- Files are alphabetized
- Code references updated

## Tools Created

### 1. Alphabetization Script

```javascript
// Created: alphabetize_errors.js
// Purpose: Alphabetize translation files and error type definitions
// Usage: node alphabetize_errors.js
```

### 2. Error Analysis Script (if needed)

```javascript
// Purpose: Compare error names between files
// Identify mismatches between English and system translations
```

## Results for JikiScript

- **590 passing tests** (100% success rate for core functionality)
- **178 total error types** properly standardized and alphabetized
- **All translation files** aligned and alphabetized
- **All code references** updated to new naming convention
- **Full compliance** with `.context/error-naming-standard.md`

## Replication for Other Languages

This exact process should be followed for JavaScript and Python interpreters to achieve consistent error standardization across all Jiki interpreters.
