import { interpret } from "@javascript/interpreter";

describe("Debug Simple Nested", () => {
  it("simple array with object", () => {
    const code = `let x = [{ a: 1 }];`;
    const result = interpret(code);

    if (!result.success && result.error) {
    }

    expect(result.success).toBe(true);
  });

  it("nested object in array", () => {
    const code = `let x = [{ something: [1, 2] }];`;
    const result = interpret(code);

    if (!result.success && result.error) {
    }

    expect(result.success).toBe(true);
  });
});
