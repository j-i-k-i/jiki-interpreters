# Agent Overview

Your job is to work through this file. Find the next jobs that is not crossed off and work on it.

⚠️⚠️ If asked to work on a TODO, you should follow these steps: ⚠️⚠️

1. Read the TODO, come up with an execution plan (which should include these 4 steps), and CONFIRM IT WITH THE HUMAN.
2. Once confirmed by the human, work on the task.
3. Ensure the tests all pass and the typescript types are correct.
4. When a task is complete, mark it off here, commit to git, and then exit.

Important:

- Do not comment out any tests or run git with no-verify. Always solve problems.
- If you are unsure, or feel like you're going down a rabbit hole, stop and ask for advice and help.

## JavaScript

For everything in here, base your work in the JikiScript interpreter.

- [x] Add numbers.
- [x] Add strings.
- [x] Add booleans.
- [x] Add basic operations for working with numbers, strings and booleans.
- [x] Add variables to JavaScript. Reference the JikiScript implementation to see how things should be set up. For now, don't worry about scoping, etc. We'll add that next. Just implement `let`. Don't implement `const` or `var`. Make sure to add corrosponding parser and implementer concept tests. Also add syntax error tests. Look at the JikiScript tests for inspiration.
- [x] Add a block with scope to JavaScript. A variable defined via let in this scope should only exist inside the scope. For now, don't worry about shadowing. Remember to add concept tests and syntax error tests (e.g. an unclosing block). Look at the JikiScript tests for inspiration.
- [ ] Add a new language feature to JavaScript interpreter for allow_shadowing. See language features for JikiScript to see how this works. If the feature is enabled, then inner variables can be created by let inside blocks to shadow outer variables. If it is false, then any attempt to shadow with let should result in a shadowing disabled runtime error. Remember to add tests for both cases. Look how runtime errors work in JikiScript.
- [ ] Add an if statement to the JavaScript interpreter. Add tests for parsing and executing. Ensure that any syntax errors are caught. Look at the JikiScript tests for examples.
- [ ] Add a language feature to the JavaScript interpreter for truthiness. See language features for JikiScript to see how this works. If enabled then truthiness should behave as normal in JS. If not, then only booleans (or functions/variables returning booleans etc) are allowed to be compared. If you compare non-booleans, a runtime error of TruthinessDisabled (or similar) should be added to the frame etc. Look how runtime errors work in JikiScript.

## Python

- [x] Add basic scanning, parsing and exec of numbers for Python, using the same patterns as the JS and JikiScript interpteters. Add equivelent tests.
- [ ] Add booleans
- [ ] Add strings
- [ ] Add basic grouping and other operations that are present to do with numbers/strings/bools in the JS implementation.
