import type { Location } from "../shared/location";

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "InvalidAssignmentTargetExpression"
  | "MissingBacktickToTerminateTemplateLiteral"
  | "MissingDoubleQuoteToTerminateString"
  | "MissingExpression"
  | "MissingInitializerInVariableDeclaration"
  | "MissingLeftParenthesisAfterIf"
  | "MissingRightBraceAfterBlock"
  | "MissingRightBraceInTemplateLiteral"
  | "MissingRightBracketInArray"
  | "MissingRightBracketInMemberAccess"
  | "MissingRightParenthesisAfterExpression"
  | "MissingRightParenthesisAfterIfCondition"
  | "MissingSemicolon"
  | "MissingVariableName"
  | "MultipleStatementsPerLine"
  | "TrailingCommaInArray"
  | "TrailingCommaInDictionary"
  | "InvalidDictionaryKey"
  | "MissingColonInDictionary"
  | "DuplicateDictionaryKey"
  | "MissingRightBraceInDictionary"
  | "UnexpectedRightBrace"
  | "UnexpectedTokenInTemplateLiteral"
  | "UnimplementedToken"
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
