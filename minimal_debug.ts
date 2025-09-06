import { Parser } from "./src/javascript/parser";

// Monkey patch the Parser to add debug logs
const originalStatement = (Parser.prototype as any).statement;
(Parser.prototype as any).statement = function () {
  console.log(`[DEBUG] statement() called. Current token: ${this.peek().type}`);
  console.log(`[DEBUG] Checking LET match: ${this.match("LET")}`);
  console.log(`[DEBUG] Current token after LET check: ${this.peek().type}`);
  console.log(`[DEBUG] Checking LEFT_BRACE match: ${this.match("LEFT_BRACE")}`);
  console.log(`[DEBUG] Current token after LEFT_BRACE check: ${this.peek().type}`);

  // If we consumed LEFT_BRACE, return early with success message
  if (this.previous().type === "LEFT_BRACE") {
    console.log(`[DEBUG] SUCCESS: LEFT_BRACE was matched!`);
    return null; // Fake return to avoid further execution
  }

  console.log(`[DEBUG] LEFT_BRACE was NOT matched, falling through to expression parsing`);
  return null; // Avoid actually running expression parsing
};

try {
  const parser = new Parser();
  parser.parse("{}");
} catch (e) {
  console.log("Error:", e.message);
}
