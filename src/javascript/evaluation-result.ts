import type { JikiObject } from "./jsObjects";

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

export type EvaluationResultIdentifierExpression = {
  type: "IdentifierExpression";
  name: string;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};

export type EvaluationResultVariableDeclaration = {
  type: "VariableDeclaration";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};

export type EvaluationResultAssignmentExpression = {
  type: "AssignmentExpression";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  jsObject: JikiObject;
};
