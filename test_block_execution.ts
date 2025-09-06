import { interpret } from "./src/javascript/interpreter";

console.log("Testing block execution...");

// Test simple block
const result1 = interpret("{ 42; }");
console.log("Simple block error:", result1.error?.message);
console.log("Simple block frames:", result1.frames.length);
if (result1.frames.length > 0) {
  console.log(
    "Frame types:",
    result1.frames.map(f => f.context?.type)
  );
}

// Test block with variable
const result2 = interpret("{ let x = 10; }");
console.log("\nBlock with variable error:", result2.error?.message);
console.log("Block with variable frames:", result2.frames.length);
if (result2.frames.length > 0) {
  console.log(
    "Frame types:",
    result2.frames.map(f => f.context?.type)
  );
}
