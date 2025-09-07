# Agent Overview

Your job is to work through this file. Find the next jobs that is not crossed off and work on it.

⚠️⚠️ If asked to work on a TODO, you should follow these steps: ⚠️⚠️

1. Read this file.
2. Come up with an execution plan. Always start by reading the `.context` files where things are clearly explained. The execution plan should include the steps in this list.
3. CONFIRM THE PLAN WITH THE HUMAN.
4. Once confirmed by the human, work on the task.
5. Ensure the tests all pass and the typescript types are correct.
6. Update the `.context` files to reflect what you've done.
7. Update this file to mark the TODO as complete
8. Commit to git

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
- [x] Add negation.
- [x] Add errors for missing variables, so if you do `5 + a` and there is no `a` that's a runtime error on that frame etc. For this you might need to add the ability to actually use variables if that's not defined yet. Make sure you read the .context file on how errors work.
- [ ] Add errors for updating a variable before it's defined. That should be a runtime error on that frame. Don't worry about seeing if it's defined later. We're just wanting to say "We don't know about this `a` thing you're discussing"
- [ ] Add a new language feature interpreter for allowShadowing. See language features for JikiScript to see how this works. If the feature is enabled, then inner variables can be created by let inside blocks to shadow outer variables. If it is false, then any attempt to shadow with let should result in a shadowing disabled runtime error. Remember to add tests for both cases. Look how runtime errors work in JikiScript.
- [ ] Add an if statement to the JavaScript interpreter. Add tests for parsing and executing. Ensure that any syntax errors are caught. Look at the JikiScript tests for examples.
- [ ] Add a language feature to the JavaScript interpreter for truthiness. See language features for JikiScript to see how this works. If enabled then truthiness should behave as normal in JS. If not, then only booleans (or functions/variables returning booleans etc) are allowed to be compared. If you compare non-booleans, a runtime error of TruthinessDisabled (or similar) should be added to the frame etc. Look how runtime errors work in JikiScript.
- [ ] Add an `if` statement. Look at the JikiScript implementation for inspriation. Don't do `else` yet. It should honor `allowShadowing` although that should be implicit anyway from the Binary Expression.
- [ ] Add `else` statements. Ensure they work with `else if`. Remember to add tests and check the JikiScript implementation as your base level.
- [ ] Add a feature flag for allowTypeCoercion. When it's true, the normal semantics for JS with `5 + true` should give the same results as JS (we can execute this just by running the normal JS on the jikiObject values). However, if it's off, we should raise a TypeCoercionNotAllowed (or something similar) RunTime error on the frame. It should be off by default. Add a dedicated test file that tests this feature flag, and test it in as many different scnearios are appropraite. Both in terms of the normal behaviour (e.g. `5 + true` is differnet to `true + 5`) and in the disallowed case (in which case both of those should result in errors).
- [ ] Don't allow statements that don't actually do anything. For example, a statement that is just a variable. Or a grouping expression that doesn't have assignmennt. Add a TOOD that you will need to modify this for calling functions (which should just be allowed by themselves) later. Look at how this works in JikiScript as there is a specific type for it.

## Python

- [x] Add basic scanning, parsing and exec of numbers for Python, using the same patterns as the JS and JikiScript interpteters. Add equivelent tests.
- [x] Add booleans
- [x] Add strings
- [x] Add basic grouping and other operations that are present to do with numbers/strings/bools in the JS implementation.
- [x] Add variables. Reference the JikiScript and JavaScript implementations to see how things should be set up. For now, don't worry about scoping, etc. We'll add that next. Just implement setting and updating of variables. Make sure to add corrosponding parser and implementer concept tests. Also add syntax error tests. Look at the JikiScript tests for inspiration.
- [x] Add errors for missing variables, so if you do `5 + a` and there is no `a` that's a runtime error on that frame etc.Don't worry about seeing if it's defined later. We're just wanting to say "We don't know about this `a` thing you're discussing
- [x] Add negation (-5)
- [ ] Add negation (python's "not" boolean operator)
- [ ] Don't allow statements that don't actually do anything. For example, a statement that is just a variable. Or a grouping expression that doesn't have assignmennt. Add a TOOD that you will need to modify this for calling functions (which should just be allowed by themselves) later. Look at how this works in JikiScript as there is a specific type for it.
