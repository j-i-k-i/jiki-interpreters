import type { JikiObject } from "./jikiObjects";

export type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  jsObject: JikiObject; // Alias for compatibility
};

export type EvaluationResultExpression = EvaluationResult;

export type EvaluationResultBinaryExpression = {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};

export type EvaluationResultUnaryExpression = {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};

export type EvaluationResultLiteralExpression = {
  type: "LiteralExpression";
  jikiObject: JikiObject;
  jsObject: JikiObject;
};

export type EvaluationResultGroupingExpression = {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};

export type EvaluationResultExpressionStatement = {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};
