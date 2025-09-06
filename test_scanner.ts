import { scan } from "./src/javascript/scanner";

console.log("Testing scanner with '{}'");
const tokens = scan("{}");
console.log("Tokens produced:");
tokens.forEach((token, i) => {
  console.log(`${i}: ${token.type} (${token.lexeme})`);
});
