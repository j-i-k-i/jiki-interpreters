import { SyntaxError, type SyntaxErrorType } from "./error";
import type {
  Expression} from "./expression";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  ListExpression,
  SubscriptExpression,
} from "./expression";
import { Location } from "../shared/location";
import { Scanner } from "./scanner";
import type {
  Statement} from "./statement";
import {
  ExpressionStatement,
  AssignmentStatement,
  PrintStatement,
  IfStatement,
  BlockStatement,
  ForInStatement,
  BreakStatement,
  ContinueStatement,
} from "./statement";
import { type Token, type TokenType } from "./token";

export class Parser {
  private readonly scanner: Scanner;
  private current: number = 0;
  private tokens: Token[] = [];

  constructor(private readonly fileName: string) {
    this.scanner = new Scanner(fileName);
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
      // Skip comments and newlines
      while (this.check("NEWLINE")) {
        this.advance();
      }

      // If we've consumed all tokens, return null
      if (this.isAtEnd()) {
        return null;
      }

      // Check for if statement
      if (this.match("IF")) {
        return this.ifStatement();
      }

      // Check for for statement
      if (this.match("FOR")) {
        return this.forInStatement();
      }

      // Check for break statement
      if (this.match("BREAK")) {
        return this.breakStatement();
      }

      // Check for continue statement
      if (this.match("CONTINUE")) {
        return this.continueStatement();
      }

      // Check for assignment statement (IDENTIFIER = expression or subscript = expression)
      // We need to parse the left side first to determine if it's an assignment
      if (this.check("IDENTIFIER")) {
        // Save current position
        const savedPosition = this.current;

        // Try to parse the left side
        const left = this.postfix();

        // Check if it's followed by an assignment
        if (this.check("EQUAL")) {
          this.advance(); // consume the EQUAL
          const value = this.expression();

          // Python doesn't require semicolons, but consume newline if present
          if (this.check("NEWLINE")) {
            this.advance();
          }

          // Create assignment based on left side type
          if (left instanceof IdentifierExpression) {
            return new AssignmentStatement(left.name, value, Location.between(left, value));
          } else if (left instanceof SubscriptExpression) {
            return new AssignmentStatement(left, value, Location.between(left, value));
          } 
            // Reset and fall through to expression statement
            this.current = savedPosition;
          
        } else {
          // Reset position - it's not an assignment
          this.current = savedPosition;
        }
      }

      return this.expressionStatement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  // No longer needed as assignment is handled in statement() method
  // Keep for potential future use or remove
  private assignmentStatement(): Statement {
    throw new Error("assignmentStatement should not be called directly");
  }

  private expressionStatement(): Statement {
    const expr = this.expression();
    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }
    return new ExpressionStatement(expr, Location.between(expr, expr));
  }

  private expression(): Expression {
    return this.or();
  }

  private or(): Expression {
    let expr = this.and();

    while (this.match("OR")) {
      const operator = this.previous();
      const right = this.and();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private and(): Expression {
    let expr = this.equality();

    while (this.match("AND")) {
      const operator = this.previous();
      const right = this.equality();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();

    while (this.match("NOT_EQUAL", "EQUAL_EQUAL")) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();

    while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      const operator = this.previous();
      const right = this.term();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private term(): Expression {
    let expr = this.factor();

    while (this.match("MINUS", "PLUS")) {
      const operator = this.previous();
      const right = this.factor();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private factor(): Expression {
    let expr = this.power();

    while (this.match("SLASH", "DOUBLE_SLASH", "STAR", "PERCENT")) {
      const operator = this.previous();
      const right = this.power();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private power(): Expression {
    let expr = this.unary();

    // Power operator is right-associative
    if (this.match("DOUBLE_STAR")) {
      const operator = this.previous();
      const right = this.power(); // Right-associative recursion
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match("NOT", "MINUS")) {
      const operator = this.previous();
      const right = this.unary();
      return new UnaryExpression(operator, right, Location.between(operator, right));
    }

    return this.postfix();
  }

  private postfix(): Expression {
    let expr = this.primary();

    // Handle subscript access (list[index])
    // This allows chaining like list[0][1] for nested lists
    while (this.match("LEFT_BRACKET")) {
      const index = this.expression();
      const rightBracket = this.consume("RIGHT_BRACKET", "Expect ']' after subscript index.");
      expr = new SubscriptExpression(expr, index, Location.between(expr, rightBracket));
    }

    return expr;
  }

  private primary(): Expression {
    if (this.match("FALSE")) {
      return new LiteralExpression(false, this.previous().location);
    }

    if (this.match("TRUE")) {
      return new LiteralExpression(true, this.previous().location);
    }

    if (this.match("NONE")) {
      return new LiteralExpression(null, this.previous().location);
    }

    if (this.match("NUMBER", "STRING")) {
      return new LiteralExpression(this.previous().literal, this.previous().location);
    }

    if (this.match("IDENTIFIER")) {
      return new IdentifierExpression(this.previous(), this.previous().location);
    }

    if (this.match("LEFT_PAREN")) {
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "Expect ')' after expression.");
      return new GroupingExpression(expr, Location.between(expr, expr));
    }

    if (this.match("LEFT_BRACKET")) {
      return this.listExpression();
    }

    throw this.error(this.peek(), "Expect expression.");
  }

  // Helper methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(...types: TokenType[]): boolean {
    if (this.isAtEnd()) {return false;}
    return types.includes(this.peek().type);
  }

  private checkNext(type: TokenType): boolean {
    if (this.current + 1 >= this.tokens.length) {return false;}
    return this.tokens[this.current + 1].type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {this.current++;}
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type == "EOF";
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {return this.advance();}

    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string): SyntaxError {
    return new SyntaxError("ParseError" as SyntaxErrorType, message, token.location);
  }

  private ifStatement(): Statement {
    const ifToken = this.previous();
    const condition = this.expression();
    this.consume("COLON", "Expect ':' after if condition.");

    // Consume the newline after the colon
    if (this.check("NEWLINE")) {
      this.advance();
    }

    const thenBranch = this.block();

    // Check for elif/else clauses
    let elseBranch: Statement | null = null;
    if (this.match("ELIF")) {
      // elif is handled as a nested if statement
      elseBranch = this.ifStatement();
    } else if (this.match("ELSE")) {
      this.consume("COLON", "Expect ':' after else.");

      // Consume the newline after the colon
      if (this.check("NEWLINE")) {
        this.advance();
      }

      elseBranch = this.block();
    }

    const endToken = elseBranch || thenBranch;
    return new IfStatement(condition, thenBranch, elseBranch, Location.between(ifToken, endToken));
  }

  private forInStatement(): Statement {
    const forToken = this.previous();

    // Parse the variable name
    const variable = this.consume("IDENTIFIER", "Expect variable name after 'for'.");

    // Parse 'in' keyword
    this.consume("IN", "Expect 'in' after variable name.");

    // Parse the iterable expression
    const iterable = this.expression();

    // Parse the colon
    this.consume("COLON", "Expect ':' after for iterable.");

    // Consume the newline after the colon
    if (this.check("NEWLINE")) {
      this.advance();
    }

    // Parse the block body
    const bodyBlock = this.block();

    // Extract statements from BlockStatement
    const body = bodyBlock instanceof BlockStatement ? bodyBlock.statements : [bodyBlock];

    return new ForInStatement(variable, iterable, body, Location.between(forToken, bodyBlock));
  }

  private breakStatement(): Statement {
    const breakToken = this.previous();

    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }

    return new BreakStatement(breakToken, breakToken.location);
  }

  private continueStatement(): Statement {
    const continueToken = this.previous();

    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }

    return new ContinueStatement(continueToken, continueToken.location);
  }

  private block(): Statement {
    const startToken = this.peek();

    // Expect an INDENT token to start the block
    this.consume("INDENT", "Expected indented block.");

    const statements: Statement[] = [];

    // Parse statements until we hit a DEDENT
    while (!this.check("DEDENT") && !this.isAtEnd()) {
      // Skip empty lines
      while (this.check("NEWLINE")) {
        this.advance();
      }

      if (this.check("DEDENT") || this.isAtEnd()) {
        break;
      }

      const stmt = this.statement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    // Consume the DEDENT token
    this.consume("DEDENT", "Expected dedent after block.");

    const endToken = this.previous();

    return new BlockStatement(statements, Location.between(startToken, endToken));
  }

  private listExpression(): Expression {
    const leftBracket = this.previous();
    const elements: Expression[] = [];

    // Handle empty list
    if (!this.check("RIGHT_BRACKET")) {
      do {
        elements.push(this.expression());
      } while (this.match("COMMA"));
    }

    const rightBracket = this.consume("RIGHT_BRACKET", "Expect ']' after list elements.");

    return new ListExpression(elements, Location.between(leftBracket, rightBracket));
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == "NEWLINE") {return;}

      switch (this.peek().type) {
        case "CLASS":
        case "DEF":
        case "IF":
        case "WHILE":
        case "FOR":
        case "RETURN":
        case "TRY":
          return;
      }

      this.advance();
    }
  }
}
