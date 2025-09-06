import type { JikiObject } from "./pyObjects";

export type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  pyObject: JikiObject; // Alias for compatibility
};

export type EvaluationResultExpression = EvaluationResult;

export type EvaluationResultBinaryExpression = {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JikiObject;
  pyObject: JikiObject;
};

export type EvaluationResultUnaryExpression = {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JikiObject;
  pyObject: JikiObject;
};

export type EvaluationResultLiteralExpression = {
  type: "LiteralExpression";
  jikiObject: JikiObject;
  pyObject: JikiObject;
};

export type EvaluationResultGroupingExpression = {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JikiObject;
  pyObject: JikiObject;
};

export type EvaluationResultExpressionStatement = {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JikiObject;
  pyObject: JikiObject;
};

export type EvaluationResultIdentifierExpression = {
  type: "IdentifierExpression";
  name: string;
  jikiObject: JikiObject;
  pyObject: JikiObject;
};

export type EvaluationResultAssignmentStatement = {
  type: "AssignmentStatement";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  pyObject: JikiObject;
};
