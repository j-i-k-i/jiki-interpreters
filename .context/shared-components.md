# Shared Components Architecture

## Overview

This document describes the shared components architecture implemented to unify common functionality between all interpreters (JikiScript, JavaScript, and future interpreters like Python).

## Shared Components

### `src/shared/frames.ts`

The unified frame system that all interpreters use for educational visualization.

#### Types

- **`Frame`**: Base frame interface representing a single step of code execution
  - `line: number` - Line number in source code
  - `code: string` - The actual code being executed
  - `status: FrameExecutionStatus` - "SUCCESS" or "ERROR"
  - `error?: any` - Error information if frame failed
  - `time: number` - Execution time (can be simulated)
  - `timelineTime: number` - Position in timeline
  - `description: string` - Human-readable description
  - `priorVariables: Record<string, any>` - Variables before execution
  - `variables: Record<string, any>` - Variables after execution
  - `result?: any` - Result of evaluation if applicable
  - `data?: Record<string, any>` - Additional interpreter-specific data
  - `context?: any` - Additional context (AST node, statement, etc.)

- **`FrameExecutionStatus`**: "SUCCESS" | "ERROR"

- **`Description`**: Educational explanation structure
  - `result: String` - What happened summary
  - `steps: String[]` - Step-by-step breakdown

- **`DescriptionContext`**: Context for generating descriptions
  - `functionDescriptions: Record<string, string>` - Function descriptions lookup

- **`FrameWithResult`**: Frame guaranteed to have a result (used by describers)

#### Helper Functions

- **`framesSucceeded(frames: Frame[]): boolean`** - Check if all frames succeeded
- **`framesErrored(frames: Frame[]): boolean`** - Check if any frames errored

### `src/shared/jikiObject.ts`

Abstract base class for all object representations across interpreters.

```typescript
export abstract class JikiObject {
  public readonly objectId: string;
  constructor(public readonly type: string) {
    this.objectId = Math.random().toString(36).substring(7);
  }

  public abstract toString(): string;
  public abstract get value(): any;
}
```

#### Features

- **Unique Object IDs**: Each object gets a unique ID for tracking
- **Type System**: All objects have a type string
- **Abstract Interface**: Enforces consistent toString() and value getter
- **Cross-Interpreter Compatibility**: Same base class used by all interpreters

## Interpreter-Specific Extensions

### JikiScript (`src/jikiscript/`)

- **`jikiObjects.ts`**: JikiScript objects extend shared `JikiObject`
- **`frameDescribers.ts`**: JikiScript-specific frame descriptions with educational explanations
- **Extended Frame Interface**: `JikiScriptFrame` extends base `Frame` with JikiScript-specific result types

### JavaScript (`src/javascript/`)

- **`jsObjects.ts`**: JavaScript objects extend shared `JikiObject`
- **`frameDescribers.ts`**: JavaScript-specific frame descriptions
- **Extended Frame Interface**: `JavaScriptFrame` extends base `Frame` with JavaScript-specific result types

## Architecture Benefits

### 1. **Unified UI Integration**

All interpreters generate the same frame format, enabling:

- Consistent timeline scrubbing across languages
- Universal variable inspection
- Shared educational visualization components

### 2. **Code Reuse**

- Common frame validation logic
- Shared object tracking system
- Unified error handling patterns

### 3. **Consistency**

- Same educational experience across languages
- Consistent object lifecycle management
- Standardized frame generation patterns

### 4. **Extensibility**

- Easy to add new interpreters (Python, etc.)
- Shared infrastructure reduces implementation time
- Common testing utilities

### 5. **Type Safety**

- TypeScript ensures consistent interfaces
- Compile-time validation of frame structures
- Abstract base classes enforce implementation contracts

## Implementation Details

### Migration Strategy

The shared components were created by:

1. **Analyzing Common Patterns**: Identified shared structures between JikiScript and JavaScript
2. **Creating Abstractions**: Built shared base classes and interfaces
3. **Updating Interpreters**: Modified existing interpreters to extend shared components
4. **Maintaining Compatibility**: Ensured all tests pass and functionality remains intact
5. **Adding Missing Features**: Implemented JavaScript `describeFrame` functionality

### File Structure

```
src/
├── shared/
│   ├── frames.ts          # Unified frame system
│   └── jikiObject.ts      # Abstract object base class
├── jikiscript/
│   ├── frameDescribers.ts # JikiScript-specific descriptions
│   └── jikiObjects.ts     # JikiScript objects (extends shared)
└── javascript/
    ├── frameDescribers.ts # JavaScript-specific descriptions
    └── jsObjects.ts       # JavaScript objects (extends shared)
```

### Testing

- All existing tests continue to pass
- Both interpreters use the same shared testing utilities
- Frame generation is validated across interpreters
- Object lifecycle testing is unified

## Future Considerations

### Python Interpreter

When implementing Python interpreter:

1. Create `src/python/pyObjects.ts` extending shared `JikiObject`
2. Create `src/python/frameDescribers.ts` for Python-specific descriptions
3. Extend base `Frame` interface as `PythonFrame` with Python-specific result types
4. All shared infrastructure will work immediately

### Additional Shared Components

Future candidates for shared components:

- Error handling utilities
- Educational messaging system
- Variable tracking utilities
- Timeline management
- Performance monitoring

## Testing Guidelines

- **Never comment out tests** to make things "work"
- Always fix the underlying issue properly
- Ensure all interpreters pass their tests after shared component changes
- Add tests for shared functionality that validate across interpreters
