import { parse } from "./src/javascript/parser";
import { SyntaxError } from "./src/javascript/error";

console.log("Testing block parsing...");

// Test case that should work
try {
  const result1 = parse("{ 42; }");
  console.log("✓ Simple block parsed successfully");
} catch (error) {
  console.log("✗ Simple block failed:", error.message);
}

// Test case that should fail with MissingRightBraceAfterBlock
try {
  const result2 = parse("{ { 42; }");
  console.log("✗ Missing brace should have thrown an error");
} catch (error) {
  console.log("Error type:", (error as SyntaxError).type);
  console.log("Error message:", error.message);
  console.log("Error location:", (error as SyntaxError).location);
}
