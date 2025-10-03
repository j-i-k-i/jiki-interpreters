import { describe, test, expect } from "vitest";
import { compile } from "../../src/python/interpreter";
import type { CompilationError } from "../../src/python/interpreter";

describe("Python compile()", () => {
  describe("successful compilation", () => {
    test("returns empty object for valid code", () => {
      const result = compile("x = 5");
      expect(result).toEqual({});
    });

    test("returns empty object for multiple statements", () => {
      const result = compile(`x = 5
y = 10
z = x + y`);
      expect(result).toEqual({});
    });

    test("returns empty object for if statement", () => {
      const result = compile(`x = 5
if x > 0:
    y = 10`);
      expect(result).toEqual({});
    });

    test("returns empty object for nested if statements", () => {
      const result = compile(`x = 5
if x > 0:
    y = 10
    if y > 5:
        z = 15`);
      expect(result).toEqual({});
    });

    test("returns empty object for arithmetic expressions", () => {
      const result = compile(`result = (5 + 3) * 2 - 4 / 2`);
      expect(result).toEqual({});
    });

    test("returns empty object for boolean operations", () => {
      const result = compile(`result = True and False or not True`);
      expect(result).toEqual({});
    });

    test("returns empty object for string operations", () => {
      const result = compile(`message = "hello" + " " + "world"`);
      expect(result).toEqual({});
    });

    test("returns empty object for lists", () => {
      const result = compile(`numbers = [1, 2, 3, 4, 5]
first = numbers[0]`);
      expect(result).toEqual({});
    });

    test("returns empty object for for loops", () => {
      const result = compile(`for i in range(5):
    x = i * 2`);
      expect(result).toEqual({});
    });
  });

  describe("compilation errors", () => {
    test("returns CompilationError for syntax error", () => {
      const result = compile("x = ") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for invalid indentation", () => {
      const result = compile(`if True:
  x = 5`) as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for missing colon", () => {
      const result = compile(`if True
    x = 5`) as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for unclosed bracket", () => {
      const result = compile("arr = [1, 2, 3") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for unclosed parenthesis", () => {
      const result = compile("result = (5 + 3") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for invalid expression", () => {
      const result = compile("x = 5 + + ") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for unexpected dedent", () => {
      const result = compile(`if True:
    x = 5
  y = 10`) as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });
  });

  describe("with custom fileName", () => {
    test("accepts custom fileName parameter", () => {
      const result = compile("x = 5", {}, "custom-script.py");
      expect(result).toEqual({});
    });

    test("returns CompilationError with custom fileName", () => {
      const result = compile("x = ", {}, "custom-script.py") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });
  });

  describe("with language features", () => {
    test("compiles successfully with custom language features", () => {
      const result = compile("x = 5", {
        languageFeatures: {
          allowTypeCoercion: true,
        },
      });
      expect(result).toEqual({});
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      const result = compile("");
      expect(result).toEqual({});
    });

    test("handles newlines only", () => {
      const result = compile("\n\n\n");
      expect(result).toEqual({});
    });

    test("handles comments only", () => {
      const result = compile("# just a comment");
      expect(result).toEqual({});
    });

    test("handles multiple comments", () => {
      const result = compile(`# comment 1
# comment 2
# comment 3`);
      expect(result).toEqual({});
    });

    test("handles inline comments", () => {
      const result = compile("x = 5  # assign 5 to x");
      expect(result).toEqual({});
    });
  });
});
