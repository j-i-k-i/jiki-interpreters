import { Executor, RuntimeError } from "../executor";
import { IfStatement } from "../statement";
import { EvaluationResult } from "../evaluation-result";
import { PyBoolean, JikiObject } from "../jikiObjects";
import { translate } from "../translator";

// Python truthiness rules (same as in executeBinaryExpression)
function isTruthy(obj: JikiObject): boolean {
  const value = obj.value;
  const type = obj.type;

  // Python falsy values: False, None, 0, 0.0, "", [], {}, set()
  if (type === "boolean") return value as boolean;
  if (type === "none") return false;
  if (type === "number") return value !== 0;
  if (type === "string") return (value as string).length > 0;

  // For now, we'll treat any other type as truthy
  // This will be expanded when we add lists, dicts, etc.
  return true;
}

export function executeIfStatement(executor: Executor, statement: IfStatement): EvaluationResult {
  // Evaluate the condition and generate a frame for it
  const conditionResult = executor.executeFrame(statement, () => {
    const result = executor.evaluate(statement.condition);

    // Check if truthiness is disabled and we have a non-boolean
    if (!executor.languageFeatures.allowTruthiness && result.jikiObject.type !== "boolean") {
      throw new RuntimeError(
        `TruthinessDisabled: value: ${result.jikiObject.type}`,
        statement.condition.location,
        "TruthinessDisabled"
      );
    }

    return {
      type: "IfStatement",
      condition: result,
      jikiObject: result.jikiObject,
    };
  });

  // Check the condition value using truthiness rules
  const conditionValue = isTruthy(conditionResult.jikiObject);

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
