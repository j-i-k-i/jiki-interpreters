# JikiScript Performance Optimization Plan

**NOTE: This optimization is focused on JikiScript only. JavaScript and Python interpreters will be updated later.**

## Problem Statement

The JikiScript interpreter currently has significant performance bottlenecks:

1. **Frame Description Generation** (~76% of execution time): The `describeFrame` function is called synchronously for every frame, generating complex HTML descriptions with recursive expression evaluation.

2. **Variable Cloning** (~29% of execution time): Every frame clones the entire environment's variables using `cloneDeep`, even though these variables are never used by the describers.

3. **Mutable Object Corruption**: When mutable objects (Lists, Dictionaries) are mutated in place, earlier frames that reference these objects incorrectly show the mutated state rather than their point-in-time state.

## Current Benchmark Results

- ~885ms for 100k frames
- ~880ms with profiling overhead
- ~628ms without variable cloning (but breaks tests)
- ~211ms without describeFrame calls

## Solution Overview

1. **Lazy Description Generation**: Convert frame descriptions from eagerly computed strings to lazy functions that generate descriptions on-demand. ✅ IMPLEMENTED

2. **Immutable Result Cloning**: Add an `immutableJikiObject` field to each EvaluationResult that contains a deep clone of the JikiObject at evaluation time. This preserves the point-in-time state for descriptions.

3. **Conditional Variable Cloning**: Only clone variables in test mode when actually needed, not in benchmarks or production. ✅ IMPLEMENTED

## Implementation Plan

### Phase 1: Benchmark Optimization

- Modify benchmark tests to not persist variables (set a flag or environment variable)
- Keep variable persistence for regular tests
- Never persist variables in production/development (only in tests)

### Phase 2: Lazy Description Generation ✅ COMPLETED

- Changed Frame interface from `description: string` to `generateDescription: () => string`
- Updated `describeFrame` to be called lazily
- All frame consumers handle the new lazy description format

### Phase 3: Immutable Result Cloning

#### Step 1: Comprehensive Test Creation
- Create tests for all primitive types (Number, String, Boolean, Null, Undefined)
- Create tests for collection types (List, Dictionary)
- Create tests for nested collections (List of Lists, Dictionary of Dictionaries, mixed)
- Create tests for deep nesting (3+ levels)
- All tests check log statement descriptions only

#### Step 2: Add immutableJikiObject Field
- Add `immutableJikiObject?: JikiObject` to EvaluationResult interface
- Update each execute function to populate this field
- Tests will fail with undefined immutableJikiObject

#### Step 3: Implement Clone Methods
- Add `clone(): JikiObject` method to base JikiObject class
- Immutable types (Number, String, Boolean, Null, Undefined) return `this`
- List implements deep clone of elements
- Dictionary implements deep clone of values
- Create recursive deep clone utility

#### Step 4: Update Describers
- Modify describeLogStatement to use `immutableJikiObject`
- Other describers that show values should also use immutable versions

### Phase 4: Testing

- Write tests that verify descriptions are correctly generated lazily
- Write tests that fail when lists/dictionaries are mutated in place (ensure copy-on-write works)
- Ensure all existing tests still pass

## Technical Details

### Copy-on-Write Strategy

When executing `change myList[0] to newValue`:

1. Create a shallow copy of the list: `const newList = [...oldList]`
2. Update the element: `newList[0] = newValue`
3. The variable `myList` now references `newList`
4. Store the old value for the frame result

For nested updates like `change myList[0]["prop"] to value`:

- This evaluates to multiple expressions
- Only the final dictionary is mutated
- We only need to shallow-copy that specific dictionary

### What Gets Mutated in JikiScript

- **Lists**: Via `change list[index] to value`
- **Dictionaries**: Via `change dict[key] to value`
- **Instances**: Via `change instance.property to value` (defer to later)

### Performance Expectations

- Removing synchronous description generation: ~76% improvement
- Removing unnecessary variable cloning: ~29% improvement
- Copy-on-write overhead: Minimal (only copying specific objects being mutated)
- Expected final benchmark: ~200-300ms (down from ~885ms)

## Success Criteria

1. Benchmark performance improves by at least 60%
2. All existing tests pass
3. Lazy descriptions work correctly
4. Mutable objects maintain correct point-in-time state in frames
5. No visible changes to interpreter behavior (only internal optimizations)

## Implementation Order

1. Create feature branch
2. Update benchmark to not clone variables
3. Implement lazy descriptions
4. Add tests for lazy descriptions with mutations
5. Implement copy-on-write for Lists
6. Implement copy-on-write for Dictionaries
7. Run full test suite
8. Run benchmark and measure improvement
9. Clean up and document changes

## TODO Progress

- [x] Create feature branch (`feature/jikiscript-performance-optimization`)
- [x] Update benchmark to not clone variables (using `SKIP_VARIABLE_CLONING` env var)
- [x] Change Frame interface to use lazy descriptions (`generateDescription: () => string`)
- [x] Update JikiScript executor to use lazy description generation
- [x] Add comprehensive benchmarks for various frame counts
- [ ] Create tests for immutable descriptions with mutations
- [ ] Add immutableJikiObject field to EvaluationResult types
- [ ] Implement clone() methods for all JikiObject types
- [ ] Update describers to use immutableJikiObject
- [ ] Run full test suite to ensure everything passes
- [ ] Run benchmark and measure final improvement with immutable cloning
- [ ] Update JavaScript/Python executors for interface compatibility (future work)

## Current Status

**⚠️ INCOMPLETE**: Copy-on-write implementation was attempted but reverted due to issues with nested mutations. Currently only lazy description generation is implemented.

### Partial Performance Improvements

- **Original baseline**: ~2144ms for 100k frames
- **Without variable cloning**: ~674ms (69% improvement)
- **With lazy descriptions only**: ~340ms for 100k frames (84% improvement from baseline)

### Benchmark Results Comparison

| Frame Count | Expression Type | Lazy Descriptions | Synchronous Descriptions | Speedup |
|------------|----------------|-------------------|-------------------------|---------|
| 10 frames | Simple addition | 2.44ms | 3.16ms | 1.3x |
| ~3,100 frames | List operations | 10.47ms | 22.23ms | 2.1x |
| 10,000 frames | Arithmetic operations | 61.32ms | 168.17ms | 2.7x |
| 100,000 frames | Complex expressions | 340ms | 948ms | 2.8x |
| 4,000,000 frames | Modulo and comparisons | 9,055ms | OOM (out of memory) | N/A |

**Key Findings:**
- Lazy description generation provides a **2.8x speedup** for 100k frames (340ms vs 948ms)
- The performance benefit increases with frame count (1.3x for 10 frames → 2.8x for 100k frames)
- Synchronous descriptions cause memory issues at very high frame counts (4M frames)
- The lazy description generation alone provides significant performance improvement (84% for 100k frames), even without the copy-on-write implementation

The copy-on-write implementation for mutable objects (Lists and Dictionaries) has been reverted. The issue is that when mutable objects are mutated in place, earlier frames that reference these objects show the mutated state rather than their point-in-time state. This needs to be addressed for full optimization.
