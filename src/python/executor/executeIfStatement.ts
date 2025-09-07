import { Executor, RuntimeError } from "../executor";
import { IfStatement } from "../statement";
import { EvaluationResult } from "../evaluation-result";
import { PyBoolean } from "../jikiObjects";
import { translate } from "../translator";

export function executeIfStatement(executor: Executor, statement: IfStatement): EvaluationResult {
  // Evaluate the condition and generate a frame for it
  const conditionResult = executor.executeFrame(statement, () => {
    const result = executor.evaluate(statement.condition);

    // Check if the result is a boolean (for now, we'll enforce booleans)
    if (!(result.jikiObject instanceof PyBoolean)) {
      throw new RuntimeError(
        translate(`Condition must be a boolean, got ${result.jikiObject.type}`),
        statement.condition.location,
        "TypeError"
      );
    }

    return {
      type: "IfStatement",
      condition: result,
      jikiObject: result.jikiObject,
    };
  });

  // Check the condition value and execute the appropriate branch
  const conditionValue = (conditionResult.jikiObject as PyBoolean).value;

  if (conditionValue) {
    // Execute the then branch
    const result = executor.executeStatement(statement.thenBranch);
    return result || conditionResult;
  } else if (statement.elseBranch) {
    // Execute the else branch if it exists
    const result = executor.executeStatement(statement.elseBranch);
    return result || conditionResult;
  }

  // If condition is false and no else branch, return the condition result
  return conditionResult;
}
