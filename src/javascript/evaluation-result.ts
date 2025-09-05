import type { JikiObject } from "./jikiObjects";

export type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
};

export type EvaluationResultExpression = EvaluationResult;

export type EvaluationResultBinaryExpression = {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JikiObject;
};

export type EvaluationResultUnaryExpression = {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JikiObject;
};

export type EvaluationResultLiteralExpression = {
  type: "LiteralExpression";
  jikiObject: JikiObject;
};

export type EvaluationResultGroupingExpression = {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JikiObject;
};
