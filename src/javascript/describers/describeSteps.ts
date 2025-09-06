import {
  EvaluationResult,
  EvaluationResultBinaryExpression,
  EvaluationResultGroupingExpression,
  EvaluationResultUnaryExpression,
} from "../evaluation-result";
import { Expression, GroupingExpression, BinaryExpression, UnaryExpression } from "../expression";
import { DescriptionContext } from "../../shared/frames";
import { describeBinaryExpression } from "./describeBinaryExpression";
import { describeGroupingExpression } from "./describeGroupingExpression";
import { describeUnaryExpression } from "./describeUnaryExpression";

export function describeExpression(
  expression: Expression,
  result: EvaluationResult,
  context: DescriptionContext
): String[] {
  if (expression instanceof BinaryExpression) {
    return describeBinaryExpression(expression, result as EvaluationResultBinaryExpression, context);
  }
  if (expression instanceof GroupingExpression) {
    return describeGroupingExpression(expression, result as EvaluationResultGroupingExpression, context);
  }
  if (expression instanceof UnaryExpression) {
    return describeUnaryExpression(expression, result as EvaluationResultUnaryExpression, context);
  }

  return [];
}
