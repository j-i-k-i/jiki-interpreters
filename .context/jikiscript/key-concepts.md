# JikiScript Key Concepts

## Core Data Types

### JikiObjects

Wrapper objects around primitives providing enhanced error messages, educational descriptions, and better UI integration for student learning.

### Frames

Capture execution state snapshots enabling timeline scrubbing. Contains execution location, variable states, descriptions, and result values.

### EvaluationResults

Rich evaluation context beyond return values, including educational descriptions and error information to help students understand execution.

## Runtime Environment

### Environment

Manages variable scoping using nested environment chain (Global → Function → Block). Supports lexical scoping, variable shadowing, and provides clear error messages with scope visualization.

### ExecutionContext

Runtime configuration including language features, execution limits, state tracking, and educational controls.

## Educational Features

### Language Features

Configurable syntax and semantic options allowing progressive syntax enabling/disabling, timing controls, and safety limits.

### Describers

Generate human-readable execution explanations, converting technical operations into educational plain language with localization and context awareness.

### Error Handling

Educational error system with syntax errors (parsing issues), runtime errors (execution problems), disabled feature errors, and compilation errors.

## Function System

### User-Defined Functions

Support for student-created functions with arity checking, return handling, and proper function-local scoping.

### Standard Library

Built-in educational functions providing safe execution environment with predictable behavior for learning scenarios.

## Integration Points

### UI Frame Format

Standardized data structure across all interpreters providing rich metadata and timeline support for UI integration.

### Translation System

Internationalization support for error messages, execution descriptions, and educational content across different learning contexts.
