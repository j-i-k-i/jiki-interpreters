import type { JikiObject } from "./jikiObjects";

export type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultExpression = EvaluationResult;

export type EvaluationResultBinaryExpression = {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultUnaryExpression = {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultLiteralExpression = {
  type: "LiteralExpression";
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultGroupingExpression = {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultExpressionStatement = {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultIdentifierExpression = {
  type: "IdentifierExpression";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultAssignmentStatement = {
  type: "AssignmentStatement";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};

export type EvaluationResultSubscriptExpression = {
  type: "SubscriptExpression";
  object: EvaluationResultExpression;
  index: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
};
