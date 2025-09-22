# Jiki Interpreters

A collection of interpreters for Jiki's educational coding environment.

## Interpreters

This project contains multiple educational interpreters:

- **JikiScript** - Educational language with simplified JavaScript-like syntax (fully implemented)
- **JavaScript** - Standard JavaScript interpreter (in development)
- **Python** - Python interpreter (basic implementation)

All interpreters generate frame data that powers Jiki's interactive editor features:

- **Breakpoints**: Step-by-step code execution
- **Time Scrubber**: Navigate through execution history
- **Variable Inspection**: Track variable states over time
- **Execution Visualization**: See how code flows through different paths

## Features

- Execute student code in controlled environments
- Capture execution traces with variable states
- Generate timeline data for interactive debugging
- Support for educational code analysis and feedback

## Development

- **Test**: `pnpm test`
- **Type Check**: `pnpm run typecheck`
- **Format**: `pnpm run format`

The project uses parallel GitHub Actions workflows for CI: tests, type checking, and formatting.
