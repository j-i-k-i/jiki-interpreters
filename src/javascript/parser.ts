import { SyntaxError, type SyntaxErrorType } from "./error";
import {
  Expression,
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  AssignmentExpression,
} from "./expression";
import { Location, Span } from "../shared/location";
import { Scanner } from "./scanner";
import { Statement, ExpressionStatement, VariableDeclaration, BlockStatement, IfStatement } from "./statement";
import { type Token, type TokenType } from "./token";
import { translate } from "./translator";

export class Parser {
  private readonly scanner: Scanner;
  private current: number = 0;
  private tokens: Token[] = [];

  constructor() {
    this.scanner = new Scanner();
  }

  public parse(sourceCode: string): Statement[] {
    this.tokens = this.scanner.scanTokens(sourceCode);

    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      const statement = this.statement();
      if (statement) {
        statements.push(statement);
      }
    }

    return statements;
  }

  private statement(): Statement | null {
    try {
      // Skip comments and EOL tokens (they don't produce statements)
      while (this.check("LINE_COMMENT", "BLOCK_COMMENT", "EOL")) {
        this.advance();
      }

      // If we've consumed all tokens, return null
      if (this.isAtEnd()) {
        return null;
      }

      // Handle variable declarations
      if (this.match("LET")) {
        return this.variableDeclaration(this.previous()); // Pass the LET token
      }

      // Handle if statements
      if (this.match("IF")) {
        return this.ifStatement();
      }

      // Handle block statements
      if (this.match("LEFT_BRACE")) {
        return this.blockStatement();
      }

      // If we've reached a right brace outside of a block context, it's an error
      if (this.check("RIGHT_BRACE")) {
        this.error("UnexpectedRightBrace", this.peek().location);
      }

      // Handle expression statements
      const expr = this.expression();
      const semicolonToken = this.consumeSemicolon();
      // Create location that spans from expression start to semicolon end
      const statementLocation = new Location(
        expr.location.line,
        expr.location.relative,
        new Span(expr.location.absolute.begin, semicolonToken.location.absolute.end)
      );
      return new ExpressionStatement(expr, statementLocation);
    } catch (error) {
      // Skip to next statement on error
      this.synchronize();
      throw error;
    }
  }

  private variableDeclaration(letToken: Token): Statement {
    const name = this.consume("IDENTIFIER", "MissingVariableName");
    this.consume("EQUAL", "MissingInitializerInVariableDeclaration");
    const initializer = this.expression();
    const semicolonToken = this.consumeSemicolon();
    return new VariableDeclaration(name, initializer, Location.between(letToken, semicolonToken));
  }

  private blockStatement(): Statement {
    const leftBrace = this.previous();
    const statements = this.block();
    const rightBrace = this.consume("RIGHT_BRACE", "MissingRightBraceAfterBlock");
    return new BlockStatement(statements, Location.between(leftBrace, rightBrace));
  }

  private block(): Statement[] {
    const statements: Statement[] = [];

    while (!this.check("RIGHT_BRACE") && !this.isAtEnd()) {
      const statement = this.statement();
      if (statement) {
        statements.push(statement);
      }
    }

    return statements;
  }

  private ifStatement(): Statement {
    const ifToken = this.previous();
    this.consume("LEFT_PAREN", "MissingLeftParenthesisAfterIf");
    const condition = this.expression();
    this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterIfCondition");
    const thenBranch = this.statement();
    let elseBranch: Statement | null = null;

    if (this.match("ELSE")) {
      elseBranch = this.statement();
    }

    const endToken = elseBranch || thenBranch;
    return new IfStatement(condition, thenBranch!, elseBranch, Location.between(ifToken, endToken!));
  }

  private expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.logicalOr();

    if (this.match("EQUAL")) {
      const value = this.assignment();

      if (expr instanceof IdentifierExpression) {
        return new AssignmentExpression(expr.name, value, Location.between(expr, value));
      }

      this.error("InvalidAssignmentTargetExpression", expr.location);
    }

    return expr;
  }

  private logicalOr(): Expression {
    let expr = this.logicalAnd();

    while (this.match("LOGICAL_OR")) {
      const operator = this.previous();
      const right = this.logicalAnd();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private logicalAnd(): Expression {
    let expr = this.addition();

    while (this.match("LOGICAL_AND")) {
      const operator = this.previous();
      const right = this.addition();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private addition(): Expression {
    let expr = this.multiplication();

    while (this.match("PLUS", "MINUS")) {
      const operator = this.previous();
      const right = this.multiplication();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private multiplication(): Expression {
    let expr = this.unary();

    while (this.match("STAR", "SLASH")) {
      const operator = this.previous();
      const right = this.unary();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match("MINUS", "PLUS", "NOT")) {
      const operator = this.previous();
      const right = this.unary();
      return new UnaryExpression(operator, right, Location.between(operator, right));
    }

    return this.primary();
  }

  private primary(): Expression {
    if (this.match("TRUE")) {
      return new LiteralExpression(true, this.previous().location);
    }

    if (this.match("FALSE")) {
      return new LiteralExpression(false, this.previous().location);
    }

    if (this.match("NUMBER")) {
      return new LiteralExpression(this.previous().literal as number, this.previous().location);
    }

    if (this.match("STRING")) {
      return new LiteralExpression(this.previous().literal as string, this.previous().location);
    }

    if (this.match("IDENTIFIER")) {
      return new IdentifierExpression(this.previous(), this.previous().location);
    }

    if (this.match("LEFT_PAREN")) {
      const lparen = this.previous();
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterExpression");
      const rparen = this.previous();
      return new GroupingExpression(expr, Location.between(lparen, rparen));
    }

    this.error("MissingExpression", this.peek().location);
  }

  private match(...tokenTypes: TokenType[]): boolean {
    for (const tokenType of tokenTypes) {
      if (this.check(tokenType)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(...tokenTypes: TokenType[]): boolean {
    if (this.isAtEnd()) return false;
    return tokenTypes.includes(this.peek().type);
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private consume(tokenType: TokenType, errorType: SyntaxErrorType): Token {
    if (this.check(tokenType)) return this.advance();
    this.error(errorType, this.peek().location);
  }

  private consumeSemicolon(): Token {
    if (this.match("SEMICOLON")) {
      return this.previous();
    }
    if (!this.isAtEnd()) {
      // In JavaScript, semicolons are often optional, but for simplicity we'll require them for now
      this.error("MissingSemicolon", this.peek().location);
    }
    // Return the current token as fallback (for end of file cases)
    return this.previous();
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === "SEMICOLON") return;

      switch (this.peek().type) {
        case "NUMBER":
        case "STRING":
          return;
      }

      this.advance();
    }
  }

  private error(type: SyntaxErrorType, location: Location, context?: any): never {
    throw new SyntaxError(translate(`error.syntax.${type}`, context), location, type, context);
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}

export function parse(sourceCode: string): Statement[] {
  return new Parser().parse(sourceCode);
}
