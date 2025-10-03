import type { Location } from "../shared/location";

export type DisabledLanguageFeatureErrorType =
  | "VariablesDisabled"
  | "ComparisonDisabled"
  | "FunctionsDisabled"
  | "LogicalDisabled"
  | "ConditionalDisabled";

export class DisabledLanguageFeatureError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: DisabledLanguageFeatureErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "DisabledLanguageFeatureError";
  }
}

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "IndentationError"
  | "MissingExpression"
  | "MissingInitializerInVariableDeclaration"
  | "MissingRightParenthesisAfterExpression"
  | "MissingVariableName"
  | "ParseError"
  | "UnexpectedCharacter"
  | "UnexpectedIndentation"
  | "UnimplementedToken"
  | "UnknownCharacter"
  | "UnterminatedComment"
  | "UnterminatedString"
  // Node restriction errors
  | "LiteralExpressionNotAllowed"
  | "BinaryExpressionNotAllowed"
  | "UnaryExpressionNotAllowed"
  | "GroupingExpressionNotAllowed"
  | "IdentifierExpressionNotAllowed"
  | "ListExpressionNotAllowed"
  | "SubscriptExpressionNotAllowed"
  | "CallExpressionNotAllowed"
  | "ExpressionStatementNotAllowed"
  | "PrintStatementNotAllowed"
  | "AssignmentStatementNotAllowed"
  | "BlockStatementNotAllowed"
  | "IfStatementNotAllowed"
  | "ForInStatementNotAllowed"
  | "BreakStatementNotAllowed"
  | "ContinueStatementNotAllowed";

export class SyntaxError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: SyntaxErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "SyntaxError";
  }
}

export class LogicError extends Error {}
