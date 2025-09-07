# Object Field Standardization (January 2025)

## Summary

This document describes the standardization of object field naming across all three interpreters (JikiScript, JavaScript, Python) completed in January 2025.

## Problem

Prior to standardization, the three interpreters had inconsistent object field naming in their `EvaluationResult` types:

- **JikiScript**: Used `jikiObject: JikiObject` (consistent)
- **JavaScript**: Used `jikiObject: JikiObject` + `jsObject: JikiObject` (duplicate fields)
- **Python**: Used `jikiObject: JikiObject` + `pyObject: JikiObject` (duplicate fields)

This inconsistency:

- Created confusion about which field to use
- Led to potential bugs when accessing object values
- Made cross-interpreter maintenance more difficult
- Violated the principle of having a single source of truth

## Solution

All interpreters now use a single, standardized `jikiObject` field:

```typescript
// STANDARDIZED across all interpreters:
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject; // Single field for all interpreters
};
```

## Changes Made

### File Renames

- `src/javascript/jsObjects.ts` → `src/javascript/jikiObjects.ts`
- `src/python/pyObjects.ts` → `src/python/jikiObjects.ts`
- `src/jikiscript/jikiObjects.ts` → `src/jikiscript/objects.ts` (further standardization)

### Code Changes

1. **Removed duplicate fields** from all `EvaluationResult` types in Python and JavaScript
2. **Updated all executor files** to use only `jikiObject` field
3. **Fixed import paths** to reference renamed object files
4. **Updated all test files** to use `jikiObject` instead of `jsObject`/`pyObject`
5. **Fixed duplicate property issues** that arose during the transition

### Documentation Updates

- Updated shared interpreter architecture documentation
- Updated language-specific architecture documents
- Added standardization notes to all relevant files
- Created this summary document

## Files Affected

### Source Files

- All `evaluation-result.ts` files in each interpreter
- All executor files in `src/*/executor/` directories
- All describer files that access object properties
- Object definition files (renamed as noted above)

### Test Files

- All test files that accessed `.jsObject` or `.pyObject` properties
- Updated to use `.jikiObject` consistently

### Documentation

- `.context/shared/interpreter-architecture.md`
- `.context/javascript/architecture.md`
- `.context/python/architecture.md`
- `.context/jikiscript/architecture.md`

## Benefits

1. **Consistency**: All three interpreters now use identical field naming
2. **Clarity**: No confusion about which field to use
3. **Maintainability**: Easier to maintain cross-interpreter functionality
4. **Single Source of Truth**: One field, one meaning
5. **Type Safety**: Eliminated potential type confusion

## Future Considerations

This standardization establishes the pattern for any future interpreters:

- All interpreters MUST use `jikiObject: JikiObject` as the single object field
- Object definition files SHOULD be named `jikiObjects.ts` for consistency
- Any deviation from this pattern will break UI compatibility

## Testing

All tests pass after the standardization, confirming:

- No functionality was broken during the transition
- All interpreters continue to work identically from the UI perspective
- Cross-interpreter compatibility is maintained

## Commit History

- **Initial standardization**: Removed duplicate fields and renamed files
- **Test updates**: Updated all test references to use standardized field
- **JikiScript rename**: Further standardized JikiScript to use `objects.ts`
- **Documentation updates**: Updated all context documentation

This standardization ensures long-term maintainability and consistency across the entire Jiki interpreter ecosystem.
