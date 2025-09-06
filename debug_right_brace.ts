import { parse } from "./src/javascript/parser";
import { SyntaxError } from "./src/javascript/error";

console.log("Testing unexpected right brace...");

try {
  const result = parse("42; }");
  console.log("ERROR: Should have thrown an error but didn't!");
  console.log("Result:", result);
} catch (error) {
  console.log("✓ Correctly threw error:", error.message);
  console.log("Error type:", (error as SyntaxError).type);
}
