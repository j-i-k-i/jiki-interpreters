import { interpret } from "@javascript/interpreter";

describe("Debug Multiline Nested", () => {
  it("multiline nested - single line version", () => {
    const code = `let x = [{ something: [{ foo: [0, 1, 2, 3, 4, 5] }] }];`;
    const result = interpret(code);

    if (!result.success && result.error) {
    }

    expect(result.success).toBe(true);
  });

  it("multiline nested - formatted version", () => {
    const code = `
let x = [
  { something: [{ foo: [0, 1, 2, 3, 4, 5] }] }
];`;
    const result = interpret(code);

    if (!result.success && result.error) {
    }

    expect(result.success).toBe(true);
  });
});
