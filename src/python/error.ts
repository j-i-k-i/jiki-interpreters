import { Location } from "../shared/location";

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
  | "UnterminatedString";

export class SyntaxError extends Error {
  constructor(
    public type: SyntaxErrorType,
    message: string,
    public location: Location,
    public fileName?: string,
    public context?: any
  ) {
    super(message);
    this.name = "SyntaxError";
  }
}
