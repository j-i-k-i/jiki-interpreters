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

## JikiScript

[x] Implement

## JavaScript

For everything in here, base your work in the JikiScript interpreter.

- [x] Add numbers.
- [x] Add strings.
- [x] Add booleans.
- [x] Add basic operations for working with numbers, strings and booleans.
- [x] Add variables. Reference the JikiScript implementation to see how things should be set up. For now, don't worry about scoping, etc. We'll add that next. Just implement `let`. Don't implement `const` or `var`. Make sure to add corrosponding parser and implementer concept tests. Also add syntax error tests. Look at the JikiScript tests for inspiration.
- [x] Add a block with scope. A variable defined via let in this scope should only exist inside the scope. For now, don't worry about shadowing. Remember to add concept tests and syntax error tests (e.g. an unclosing block). Look at the JikiScript tests for inspiration.
- [ ] Add errors for missing variables, so if you do `5 + a` and there is no `a` that's a runtime error on that frame etc. For this you might need to add the ability to actually use variables if that's not defined yet.
- [ ] Add errors for updating a variable before it's defined. That should be a runtime error on that frame. Don't worry about seeing if it's defined later. We're just wanting to say "We don't know about this `a` thing you're discussing"
- [ ] Add negation.
- [ ] Add a new language feature interpreter for allowShadowing. See language features for JikiScript to see how this works. If the feature is enabled, then inner variables can be created by let inside blocks to shadow outer variables. If it is false, then any attempt to shadow with let should result in a shadowing disabled runtime error. Remember to add tests for both cases. Look how runtime errors work in JikiScript.
- [ ] Add an if statement to the JavaScript interpreter. Add tests for parsing and executing. Ensure that any syntax errors are caught. Look at the JikiScript tests for examples.
- [ ] Add a language feature to the JavaScript interpreter for truthiness. See language features for JikiScript to see how this works. If enabled then truthiness should behave as normal in JS. If not, then only booleans (or functions/variables returning booleans etc) are allowed to be compared. If you compare non-booleans, a runtime error of TruthinessDisabled (or similar) should be added to the frame etc. Look how runtime errors work in JikiScript.
- [ ] Add an `if` statement. Look at the JikiScript implementation for inspriation. Don't do `else` yet. It should honor `allowShadowing` although that should be implicit anyway from the Binary Expression

## Python

- [x] Add basic scanning, parsing and exec of numbers for Python, using the same patterns as the JS and JikiScript interpteters. Add equivelent tests.
- [x] Add booleans
- [ ] Add strings
- [ ] Add basic grouping and other operations that are present to do with numbers/strings/bools in the JS implementation.
- [ ] Add variables. Reference the JikiScript and JavaScript implementations to see how things should be set up. For now, don't worry about scoping, etc. We'll add that next. Just implement setting and updating of variables. Make sure to add corrosponding parser and implementer concept tests. Also add syntax error tests. Look at the JikiScript tests for inspiration.
- [ ] Add errors for missing variables, so if you do `5 + a` and there is no `a` that's a runtime error on that frame etc.Don't worry about seeing if it's defined later. We're just wanting to say "We don't know about this `a` thing you're discussing
- [ ] Add negation.
