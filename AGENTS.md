# Agent Configuration

## ⚠️ IMPORTANT: Check .context/ Directory FIRST

**BEFORE making ANY changes or answering questions about this codebase, you MUST check the `.context/` directory for detailed technical information.**

The `.context/` folder contains comprehensive documentation about:

- **JikiScript interpreter architecture** (Scanner→Parser→Executor→Frames pipeline)
- **Key concepts** (JikiObjects, Frames, EvaluationResults, educational features)
- **Educational philosophy and UI integration**
- **Implementation details and relationships between components**

**Always start by reading the relevant `.context/` files to understand the system before proceeding with any task.**

## Project Overview

This is a Bun + TypeScript project that houses multiple educational interpreters for **Jiki** (by the Exercism team). Jiki is an educational coding environment that provides interactive, frame-by-frame code execution visualization.

### Interpreters

- **JikiScript** (current focus) - Educational language with simplified JavaScript-like syntax
- **JavaScript** (planned) - Standard JavaScript interpreter
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

## Notes

- This project uses Bun as the runtime and package manager
- TypeScript configuration is optimized for Bun's bundler
- When migrating Jest tests, convert them to Bun test format
