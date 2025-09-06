import { Scanner } from "./src/javascript/scanner";

// Let's manually walk through the parser logic
const scanner = new Scanner();
const tokens = scanner.scanTokens("{ 42; }");

console.log("Tokens:");
tokens.forEach((token, i) => {
  console.log(`${i}: ${token.type} "${token.lexeme}"`);
});

console.log("\nManual parsing simulation:");
let current = 0;

function peek() {
  return tokens[current];
}

function advance() {
  if (current < tokens.length - 1) current++;
  return tokens[current - 1];
}

function check(type: string) {
  return !isAtEnd() && peek().type === type;
}

function isAtEnd() {
  return peek().type === "EOF";
}

console.log(`Current token: ${peek().type}`);
console.log(`Is LEFT_BRACE: ${check("LEFT_BRACE")}`);

if (check("LEFT_BRACE")) {
  console.log("Matching LEFT_BRACE");
  advance(); // consume {
  console.log(`After consuming LEFT_BRACE, current token: ${peek().type}`);

  // Now we're in block() method
  while (!check("RIGHT_BRACE") && !isAtEnd()) {
    console.log(`In block loop, current token: ${peek().type}`);

    // This calls statement() which should handle the "42;"
    if (peek().type === "NUMBER") {
      console.log("Found NUMBER, should parse as expression statement");
      // This would call expression() -> ... -> primary()
      // primary() should handle NUMBER tokens
      break;
    }
  }
}
