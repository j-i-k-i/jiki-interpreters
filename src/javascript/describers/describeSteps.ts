import {
  EvaluationResult,
  EvaluationResultBinaryExpression,
  EvaluationResultGroupingExpression,
  EvaluationResultUnaryExpression,
} from "../evaluation-result";
import type { EvaluationResultTemplateLiteralExpression } from "../executor/executeTemplateLiteralExpression";
import {
  Expression,
  GroupingExpression,
  BinaryExpression,
  UnaryExpression,
  TemplateLiteralExpression,
} from "../expression";
import { DescriptionContext } from "../../shared/frames";
import { describeBinaryExpression } from "./describeBinaryExpression";
import { describeGroupingExpression } from "./describeGroupingExpression";
import { describeUnaryExpression } from "./describeUnaryExpression";
import { describeTemplateLiteralExpression } from "./describeTemplateLiteralExpression";

export function describeExpression(
  expression: Expression,
  result: EvaluationResult,
  context: DescriptionContext
): string[] {
  if (expression instanceof BinaryExpression) {
    return describeBinaryExpression(expression, result as EvaluationResultBinaryExpression, context);
  }
  if (expression instanceof GroupingExpression) {
    return describeGroupingExpression(expression, result as EvaluationResultGroupingExpression, context);
  }
  if (expression instanceof UnaryExpression) {
    return describeUnaryExpression(expression, result as EvaluationResultUnaryExpression, context);
  }
  if (expression instanceof TemplateLiteralExpression) {
    return describeTemplateLiteralExpression(expression, result as EvaluationResultTemplateLiteralExpression, context);
  }

  return [];
}
