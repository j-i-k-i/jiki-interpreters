import type { JSObject } from "./jsObjects";

export type EvaluationResult = {
  type: string;
  jikiObject: JSObject;
  jsObject: JSObject; // Alias for compatibility
};

export type EvaluationResultExpression = EvaluationResult;

export type EvaluationResultBinaryExpression = {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JSObject;
  jsObject: JSObject;
};

export type EvaluationResultUnaryExpression = {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JSObject;
  jsObject: JSObject;
};

export type EvaluationResultLiteralExpression = {
  type: "LiteralExpression";
  jikiObject: JSObject;
  jsObject: JSObject;
};

export type EvaluationResultGroupingExpression = {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JSObject;
  jsObject: JSObject;
};

export type EvaluationResultExpressionStatement = {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JSObject;
  jsObject: JSObject;
};
