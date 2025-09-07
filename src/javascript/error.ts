import { Location } from "../shared/location";

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "InvalidAssignmentTargetExpression"
  | "MissingBacktickToTerminateTemplateLiteral"
  | "MissingDoubleQuoteToTerminateString"
  | "MissingExpression"
  | "MissingInitializerInVariableDeclaration"
  | "MissingRightBraceAfterBlock"
  | "MissingRightParenthesisAfterExpression"
  | "MissingSemicolon"
  | "MissingVariableName"
  | "UnexpectedRightBrace"
  | "UnknownCharacter"
  | "UnterminatedComment"
  | "UnterminatedString";

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
