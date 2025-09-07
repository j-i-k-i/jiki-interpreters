import { EvaluationResultIfStatement } from "../evaluation-result";
import { Executor } from "../executor";
import { IfStatement } from "../statement";

export function executeIfStatement(executor: Executor, statement: IfStatement) {
  const conditionResult = executor.executeFrame<EvaluationResultIfStatement>(statement, () =>
    executeCondition(executor, statement)
  );

  if (conditionResult.jikiObject.value) {
    executor.executeStatement(statement.thenBranch);
    return;
  }

  if (statement.elseBranch === null) return;
  executor.executeStatement(statement.elseBranch!);
}

function executeCondition(executor: Executor, statement: IfStatement): EvaluationResultIfStatement {
  const result = executor.evaluate(statement.condition);

  // Convert the result to boolean for if statement logic
  const booleanValue = Boolean(result.jikiObject.value);

  return {
    type: "IfStatement",
    condition: result,
    jikiObject: result.jikiObject,
  };
}
