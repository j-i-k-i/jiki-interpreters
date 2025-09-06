# Agent Configuration

## ⚠️ IMPORTANT: Check .context/ Directory FIRST

**BEFORE making ANY changes or answering questions about this codebase, you MUST check the `.context/` directory for detailed technical information.**

The `.context/` folder contains comprehensive documentation about:

- **JikiScript interpreter** (`.context/jikiscript/`)
  - Architecture (Scanner→Parser→Executor→Frames pipeline)
  - Key concepts (JikiObjects, Frames, EvaluationResults)
  - Educational features and progressive syntax
  - Implementation details and component relationships
- **JavaScript interpreter** (`.context/javascript/`)
  - Architecture overview and pipeline details
  - Modular executor system with describers
  - Frame generation for UI integration
  - Current features and planned extensions

**Always start by reading the relevant `.context/` files to understand the system before proceeding with any task.**

## Project Overview

This is a Bun + TypeScript project that houses multiple educational interpreters for **Jiki** (by the Exercism team). Jiki is an educational coding environment that provides interactive, frame-by-frame code execution visualization.

### Interpreters

- **JikiScript** (implemented) - Educational language with simplified JavaScript-like syntax
  - Full documentation in `.context/jikiscript/`
  - Complete Scanner→Parser→Executor→Frames pipeline
  - Educational features and progressive syntax support
- **JavaScript** (in development) - Standard JavaScript interpreter
  - Documentation in `.context/javascript/`
  - Scanner, Parser, and basic Executor implemented
  - Supports arithmetic, logical, and comparison operations
  - Describers system for educational explanations
  - Frame generation compatible with Jiki UI
- **Python** (planned) - Python interpreter

All interpreters generate the same frame format to power Jiki's unified UI, allowing students to learn different languages with consistent visual debugging tools.

### Key Educational Features

- **Frame-by-frame execution**: Students can scrub through code execution like a video timeline
- **Variable inspection**: Track how variables change over time
- **Line-by-line descriptions**: See exactly what each line of code does
- **Progressive language features**: Enable/disable syntax to gradually introduce concepts
- **Educational feedback**: Descriptive error messages and execution explanations

For detailed technical information, see the `.context/` folder, particularly `.context/jikiscript/` for the current interpreter.

## Commands

- **Build**: `bun run build` - Builds the project to dist/
- **Dev**: `bun run dev` - Runs in watch mode
- **Test**: `bun test` - Runs all tests
- **Test Watch**: `bun test --watch` - Runs tests in watch mode
- **Type Check**: `bun run typecheck` - Type checking without emit
- **Format**: `bun run format` - Format code with Prettier
- **Format Check**: `bun run format:check` - Check if code is formatted
- **Clean**: `bun run clean` - Removes dist/ folder

## Directory Structure

- `src/` - Source TypeScript files
- `tests/` - Test files (Bun's built-in test runner)
- `examples/` - Example JikiScript programs
- `docs/` - Documentation
- `dist/` - Built output (generated)

## Code Style

- Use TypeScript with strict mode enabled
- Follow ESNext module syntax
- Use Bun's built-in test runner instead of Jest
- Prefer `export/import` over `require()`

## Testing

- Use Bun's built-in test runner: `bun test`
- Test files should be in `tests/` directory
- Use `.test.ts` suffix for test files
- **NEVER comment out or disable tests to make things "work"** - always fix the underlying issue properly
- If tests are failing, identify and resolve the root cause rather than masking the problem

## Version Control Guidelines

**IMPORTANT: Always commit your changes when you complete an instruction or task.**

- Create descriptive commit messages that explain what was changed and why
- Commit after finishing each discrete task or instruction
- This ensures work is saved and provides clear history of changes
- Use conventional commit format when appropriate
- Include context about the implementation in commit messages

## Notes

- This project uses Bun as the runtime and package manager
- TypeScript configuration is optimized for Bun's bundler
- When migrating Jest tests, convert them to Bun test format
