# JikiScript Performance Optimization Plan

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

1. **Lazy Description Generation**: Convert frame descriptions from eagerly computed strings to lazy functions that generate descriptions on-demand.

2. **Copy-on-Write for Mutations**: Instead of mutating Lists and Dictionaries in place, create shallow copies when mutations occur.

3. **Conditional Variable Cloning**: Only clone variables in test mode when actually needed, not in benchmarks or production.

## Implementation Plan

### Phase 1: Benchmark Optimization

- Modify benchmark tests to not persist variables (set a flag or environment variable)
- Keep variable persistence for regular tests
- Never persist variables in production/development (only in tests)

### Phase 2: Lazy Description Generation

- Change Frame interface from `description: string` to `description: () => string`
- Update `describeFrame` to return a closure that captures the current frame state
- Ensure all frame consumers handle the new lazy description format

### Phase 3: Copy-on-Write Implementation

- Implement copy-on-write for List mutations (`change list[index] to value`)
- Implement copy-on-write for Dictionary mutations (`change dict[key] to value`)
- Use shallow copies (sufficient since we only mutate one level at a time)

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
