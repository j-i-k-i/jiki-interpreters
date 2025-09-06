import { scan } from "./src/javascript/scanner";
import { Parser } from "./src/javascript/parser";

class DebugParser extends Parser {
  debugParse(sourceCode: string) {
    const scanner = (this as any).scanner;
    this.tokens = scanner.scanTokens(sourceCode);
    console.log("All tokens:");
    this.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.type} (${token.lexeme})`);
    });

    this.current = 0;

    console.log("\nStarting parse...");
    console.log(`Current token: ${this.peek().type}`);

    const statement = this.debugStatement();
    return statement;
  }

  private debugStatement() {
    console.log(`\nIn statement() method:`);
    console.log(`  Current token: ${this.peek().type}`);
    console.log(`  Checking LEFT_BRACE...`);

    if (this.check("LEFT_BRACE")) {
      console.log(`  ✓ Found LEFT_BRACE`);
      if (this.match("LEFT_BRACE")) {
        console.log(`  ✓ Matched LEFT_BRACE, calling blockStatement()`);
        return "would call blockStatement";
      }
    } else {
      console.log(`  ✗ LEFT_BRACE check failed`);
    }

    console.log(`  Falling through to expression parsing...`);
    return null;
  }

  private check(...tokenTypes: any[]): boolean {
    if (this.isAtEnd()) return false;
    return tokenTypes.includes(this.peek().type);
  }

  private match(...tokenTypes: any[]): boolean {
    for (const tokenType of tokenTypes) {
      if (this.check(tokenType)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek() {
    return this.tokens[this.current];
  }

  private previous() {
    return this.tokens[this.current - 1];
  }

  private tokens: any[] = [];
  private current: number = 0;
}

const parser = new DebugParser();
parser.debugParse("{}");
