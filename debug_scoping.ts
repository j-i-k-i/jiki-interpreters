import { interpret } from "./src/javascript/interpreter";

console.log("Testing variable scoping...");

// Test 1: Variable should NOT be accessible outside block
const result1 = interpret("{ let innerVar = 42; }");
console.log("\nTest 1 - Block variable scoping:");
console.log("Error:", result1.error?.message);
console.log("Final frame variables:", Object.keys(result1.frames[result1.frames.length - 1]?.variables || {}));

// Test 2: Access variable outside block should error
const result2 = interpret("{ let innerVar = 42; } innerVar;");
console.log("\nTest 2 - Access outside block:");
console.log("Error:", result2.error?.message);
console.log("Should have error but got:", result2.error ? "ERROR" : "NO ERROR");
