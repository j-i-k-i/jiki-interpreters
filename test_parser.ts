import { parse } from "./src/javascript/parser";

console.log("Testing parser with '{}'");
try {
  const statements = parse("{}");
  console.log("Success! Parsed statements:");
  statements.forEach((stmt, i) => {
    console.log(`${i}: ${stmt.type} at ${JSON.stringify(stmt.location)}`);
  });
} catch (error) {
  console.log("Error:", error.message);
  console.log("Stack:", error.stack);
}
