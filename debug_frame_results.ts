import { interpret } from "./src/javascript/interpreter";

console.log("Testing frame result values...");

// Test frame result for expression in block
const result = interpret("let outerVar = 10; { outerVar; }");
console.log("Error:", result.error?.message);
console.log("Frames count:", result.frames.length);

result.frames.forEach((frame, i) => {
  console.log(`Frame ${i}:`, {
    type: frame.context?.type,
    result: frame.result,
    variables: Object.keys(frame.variables),
  });
});
