import { Location } from "./location";

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "UnknownCharacter"
  | "UnexpectedCharacter"
  | "MissingExpression"
  | "MissingRightParenthesisAfterExpression"
  | "UnterminatedString"
  | "UnterminatedComment"
  | "MissingVariableName"
  | "MissingInitializerInVariableDeclaration"
  | "UnexpectedIndentation"
  | "IndentationError"
  | "ParseError";

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
