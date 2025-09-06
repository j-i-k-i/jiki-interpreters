/*
 * Python scanner for Jiki interpreter.
 * This scanner produces tokens for Python syntax.
 */

import {
  DisabledLanguageFeatureError,
  type DisabledLanguageFeatureErrorType,
  SyntaxError,
  type SyntaxErrorType,
} from "./error";
import type { Token, TokenType } from "./token";
import { Location } from "../shared/location";
import { translate } from "./translator";

export class Scanner {
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  private lineOffset: number = 0;
  private sourceCode: string = "";

  private static readonly keywords: Record<string, TokenType> = {
    and: "AND",
    as: "AS",
    assert: "ASSERT",
    async: "ASYNC",
    await: "AWAIT",
    break: "BREAK",
    class: "CLASS",
    continue: "CONTINUE",
    def: "DEF",
    del: "DEL",
    elif: "ELIF",
    else: "ELSE",
    except: "EXCEPT",
    False: "FALSE",
    finally: "FINALLY",
    for: "FOR",
    from: "FROM",
    global: "GLOBAL",
    if: "IF",
    import: "IMPORT",
    in: "IN",
    is: "IS",
    lambda: "LAMBDA",
    None: "NONE",
    nonlocal: "NONLOCAL",
    not: "NOT",
    or: "OR",
    pass: "PASS",
    raise: "RAISE",
    return: "RETURN",
    True: "TRUE",
    try: "TRY",
    while: "WHILE",
    with: "WITH",
    yield: "YIELD",
  };

  private readonly tokenizers: Record<string, Function> = {
    "(": this.tokenizeLeftParanthesis,
    ")": this.tokenizeRightParanthesis,
    "{": this.tokenizeLeftBrace,
    "}": this.tokenizeRightBrace,
    "[": this.tokenizeLeftBracket,
    "]": this.tokenizeRightBracket,
    ":": this.tokenizeColon,
    ",": this.tokenizeComma,
    ".": this.tokenizeDot,
    "+": this.tokenizePlus,
    "-": this.tokenizeMinus,
    "*": this.tokenizeStar,
    "/": this.tokenizeSlash,
    "%": this.tokenizePercent,
    ">": this.tokenizeGreater,
    "<": this.tokenizeLess,
    "!": this.tokenizeBang,
    "=": this.tokenizeEqual,
    ";": this.tokenizeSemicolon,
    " ": this.tokenizeWhitespace,
    "\t": this.tokenizeWhitespace,
    "\r": this.tokenizeWhitespace,
    "\n": this.tokenizeNewline,
    '"': this.tokenizeString,
    "'": this.tokenizeSingleQuoteString,
    "#": this.tokenizeComment,
  };

  constructor(private readonly fileName: string) {}

  public scanTokens(source: string): Token[] {
    this.sourceCode = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.lineOffset = 0;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push({
      type: "EOF",
      lexeme: "",
      literal: null,
      location: Location.fromLineOffset(this.current, this.current, this.line, this.lineOffset),
    });

    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    if (this.tokenizers[c]) {
      this.tokenizers[c].call(this);
    } else if (this.isDigit(c)) {
      this.tokenizeNumber();
    } else if (this.isAlpha(c)) {
      this.tokenizeIdentifier();
    } else {
      throw new SyntaxError(
        "GenericSyntaxError",
        translate("Unexpected character."),
        Location.fromLineOffset(this.start, this.current, this.line, this.lineOffset)
      );
    }
  }

  private advance(): string {
    return this.sourceCode.charAt(this.current++);
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.sourceCode.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.sourceCode.length) return "\0";
    return this.sourceCode.charAt(this.current + 1);
  }

  private isAtEnd(): boolean {
    return this.current >= this.sourceCode.length;
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.sourceCode.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private addToken(type: TokenType, literal?: any): void {
    const text = this.sourceCode.substring(this.start, this.current);
    this.tokens.push({
      type,
      lexeme: text,
      literal: literal,
      location: Location.fromLineOffset(this.start, this.current, this.line, this.lineOffset),
    });
  }

  // Tokenizer methods for basic symbols
  private tokenizeLeftParanthesis(): void {
    this.addToken("LEFT_PAREN");
  }

  private tokenizeRightParanthesis(): void {
    this.addToken("RIGHT_PAREN");
  }

  private tokenizeLeftBrace(): void {
    this.addToken("LEFT_BRACE");
  }

  private tokenizeRightBrace(): void {
    this.addToken("RIGHT_BRACE");
  }

  private tokenizeLeftBracket(): void {
    this.addToken("LEFT_BRACKET");
  }

  private tokenizeRightBracket(): void {
    this.addToken("RIGHT_BRACKET");
  }

  private tokenizeColon(): void {
    this.addToken("COLON");
  }

  private tokenizeComma(): void {
    this.addToken("COMMA");
  }

  private tokenizeDot(): void {
    this.addToken("DOT");
  }

  private tokenizePlus(): void {
    this.addToken("PLUS");
  }

  private tokenizeMinus(): void {
    this.addToken("MINUS");
  }

  private tokenizeStar(): void {
    if (this.match("*")) {
      this.addToken("DOUBLE_STAR");
    } else {
      this.addToken("STAR");
    }
  }

  private tokenizeSlash(): void {
    if (this.match("/")) {
      this.addToken("DOUBLE_SLASH");
    } else {
      this.addToken("SLASH");
    }
  }

  private tokenizePercent(): void {
    this.addToken("PERCENT");
  }

  private tokenizeGreater(): void {
    this.addToken(this.match("=") ? "GREATER_EQUAL" : "GREATER");
  }

  private tokenizeLess(): void {
    this.addToken(this.match("=") ? "LESS_EQUAL" : "LESS");
  }

  private tokenizeBang(): void {
    this.addToken(this.match("=") ? "NOT_EQUAL" : "NOT");
  }

  private tokenizeEqual(): void {
    this.addToken(this.match("=") ? "EQUAL_EQUAL" : "EQUAL");
  }

  private tokenizeSemicolon(): void {
    this.addToken("SEMICOLON");
  }

  private tokenizeWhitespace(): void {
    // Ignore whitespace except newlines
  }

  private tokenizeNewline(): void {
    this.line++;
    this.lineOffset = this.current;
    this.addToken("NEWLINE");
  }

  private tokenizeComment(): void {
    // A comment goes until the end of the line
    while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
  }

  private tokenizeString(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") {
        this.line++;
        this.lineOffset = this.current + 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new SyntaxError(
        "GenericSyntaxError",
        translate("Unterminated string."),
        Location.fromLineOffset(this.start, this.current, this.line, this.lineOffset)
      );
    }

    // The closing "
    this.advance();

    // Trim the surrounding quotes
    const value = this.sourceCode.substring(this.start + 1, this.current - 1);
    this.addToken("STRING", value);
  }

  private tokenizeSingleQuoteString(): void {
    while (this.peek() != "'" && !this.isAtEnd()) {
      if (this.peek() == "\n") {
        this.line++;
        this.lineOffset = this.current + 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new SyntaxError(
        "GenericSyntaxError",
        translate("Unterminated string."),
        Location.fromLineOffset(this.start, this.current, this.line, this.lineOffset)
      );
    }

    // The closing '
    this.advance();

    // Trim the surrounding quotes
    const value = this.sourceCode.substring(this.start + 1, this.current - 1);
    this.addToken("STRING", value);
  }

  private tokenizeNumber(): void {
    // Handle integer part
    while (this.isDigit(this.peek())) this.advance();

    // Look for a fractional part
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      this.advance(); // consume the .
      while (this.isDigit(this.peek())) this.advance();
    }

    // Look for scientific notation
    if (this.peek() == "e" || this.peek() == "E") {
      this.advance(); // consume e/E
      if (this.peek() == "+" || this.peek() == "-") {
        this.advance(); // consume +/-
      }
      while (this.isDigit(this.peek())) this.advance();
    }

    const value = parseFloat(this.sourceCode.substring(this.start, this.current));
    this.addToken("NUMBER", value);
  }

  private tokenizeIdentifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.sourceCode.substring(this.start, this.current);
    const type = Scanner.keywords[text] || "IDENTIFIER";
    this.addToken(type);
  }

  // Helper methods
  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}
