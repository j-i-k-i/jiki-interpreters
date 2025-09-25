import { isArray, isNumber } from "lodash";
import type { EvaluationResult, EvaluationResultBinaryExpression, EvaluationResultExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import * as JikiTypes from "../jikiObjects";

const DP_MULTIPLE = 100000;

export function executeBinaryExpression(
  executor: Executor,
  expression: BinaryExpression
): EvaluationResultBinaryExpression {
  const leftResult = executor.evaluate(expression.left);
  const rightResult = executor.evaluate(expression.right);

  guardLists(executor, expression, leftResult, rightResult);
  guardObjects(executor, expression, leftResult, rightResult);

  const jikiObject = handleExpression(executor, expression, leftResult, rightResult);
  const result: EvaluationResult = {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
  return result;
}

function handleExpression(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  switch (expression.operator.type) {
    case "INEQUALITY":
      return handle_inequality(executor, expression, leftResult, rightResult);
    case "EQUALITY":
      return handle_equality(executor, expression, leftResult, rightResult);
    case "GREATER":
      return handle_greater(executor, expression, leftResult, rightResult);
    case "GREATER_EQUAL":
      return handle_greater_equal(executor, expression, leftResult, rightResult);
    case "LESS":
      return handle_less(executor, expression, leftResult, rightResult);
    case "LESS_EQUAL":
      return handle_less_equal(executor, expression, leftResult, rightResult);
    case "MINUS":
      return handle_minus(executor, expression, leftResult, rightResult);
    case "PLUS":
      return handle_plus(executor, expression, leftResult, rightResult);
    case "SLASH":
      return handle_slash(executor, expression, leftResult, rightResult);
    case "STAR":
      return handle_star(executor, expression, leftResult, rightResult);
    case "PERCENT":
      return handle_percent(executor, expression, leftResult, rightResult);
    case "EQUAL":
      executor.error("UnexpectedEqualsOperatorForEqualityComparison", expression.location, {
        expression,
      });
    default:
      executor.error("InvalidBinaryExpressionOperation", expression.location, {
        expression,
      });
  }
}

function handle_inequality(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  return new JikiTypes.Boolean(leftResult.jikiObject.value !== rightResult.jikiObject.value);
}

function handle_equality(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  return new JikiTypes.Boolean(leftResult.jikiObject.value === rightResult.jikiObject.value);
}

function handle_greater(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value > rightResult.jikiObject.value);
}

function handle_greater_equal(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value >= rightResult.jikiObject.value);
}

function handle_less(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value < rightResult.jikiObject.value);
}

function handle_less_equal(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value <= rightResult.jikiObject.value);
}

function handle_minus(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const minusValue = leftResult.jikiObject.value - rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(minusValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handle_plus(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const plusValue = leftResult.jikiObject.value + rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(plusValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handle_slash(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const slashValue = leftResult.jikiObject.value / rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(slashValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handle_star(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const starValue = leftResult.jikiObject.value * rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(starValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handle_percent(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Number(leftResult.jikiObject.value % rightResult.jikiObject.value);
}

function guardLists(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
) {
  if (leftResult.jikiObject instanceof JikiTypes.List && rightResult.jikiObject instanceof JikiTypes.List) {
    executor.error("TypeErrorCannotCompareListObjects", expression.location);
  }
}

function guardObjects(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
) {
  if (leftResult.jikiObject instanceof JikiTypes.Instance || rightResult.jikiObject instanceof JikiTypes.Instance) {
    executor.error("TypeErrorCannotCompareObjectInstances", expression.location);
  }
}
