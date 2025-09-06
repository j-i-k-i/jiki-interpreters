import { Scanner } from "./src/javascript/scanner";

console.log("Testing scanner...");

const scanner = new Scanner();
const tokens = scanner.scanTokens("{ 42; }");

console.log("Tokens:");
tokens.forEach((token, i) => {
  console.log(
    `${i}: ${token.type} "${token.lexeme}" at ${token.location.line}:${token.location.relative.begin}-${token.location.relative.end}`
  );
});
