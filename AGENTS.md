# Agent Configuration

## Project Setup
This is a Bun + TypeScript project for Jiki's interpreters. The primary focus is JikiScript, which executes student JavaScript code and captures execution data for Jiki's interactive editor (breakpoints, time scrubbing, variable inspection, etc.).

## Commands
- **Build**: `bun run build` - Builds the project to dist/
- **Dev**: `bun run dev` - Runs in watch mode
- **Test**: `bun test` - Runs all tests
- **Test Watch**: `bun test --watch` - Runs tests in watch mode
- **Type Check**: `bun run typecheck` - Type checking without emit
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
