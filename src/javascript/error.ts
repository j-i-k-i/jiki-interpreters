import { Location } from "./location";

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "UnknownCharacter"
  | "MissingExpression"
  | "MissingRightParenthesisAfterExpression"
  | "MissingSemicolon"
  | "UnterminatedString"
  | "UnterminatedComment";

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
