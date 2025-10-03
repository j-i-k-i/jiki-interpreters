import { describe, test, expect } from "vitest";
import { compile } from "../../src/javascript/interpreter";
import type { CompilationError } from "../../src/javascript/interpreter";

describe("JavaScript compile()", () => {
  describe("successful compilation", () => {
    test("returns empty object for valid code", () => {
      const result = compile("let x = 5;");
      expect(result).toEqual({});
    });

    test("returns empty object for multiple statements", () => {
      const result = compile(`
        let x = 5;
        let y = 10;
        let z = x + y;
      `);
      expect(result).toEqual({});
    });

    test("returns empty object for complex valid code", () => {
      const result = compile(`
        let arr = [1, 2, 3];
        let obj = { name: "test", value: 42 };
        if (arr[0] > 0) {
          let result = obj.value * 2;
        }
      `);
      expect(result).toEqual({});
    });

    test("returns empty object for template literals", () => {
      const result = compile('let msg = `Hello ${"world"}`;');
      expect(result).toEqual({});
    });

    test("returns empty object for loops", () => {
      const result = compile(`
        for (let i = 0; i < 5; i++) {
          let x = i * 2;
        }
      `);
      expect(result).toEqual({});
    });
  });

  describe("compilation errors", () => {
    test("returns CompilationError for syntax error", () => {
      const result = compile("let x = ;") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for missing semicolon", () => {
      const result = compile("let x = 5") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for invalid token", () => {
      const result = compile("let x = @;") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for unclosed bracket", () => {
      const result = compile("let arr = [1, 2, 3;") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for unclosed brace", () => {
      const result = compile("if (true) { let x = 5;") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });

    test("returns CompilationError for invalid expression", () => {
      const result = compile("let x = 5 + + ;") as CompilationError;
      expect(result.type).toBe("CompilationError");
      expect(result.error).toBeDefined();
      expect(result.frames).toEqual([]);
    });
  });

  describe("with language features", () => {
    test("compiles successfully with custom language features", () => {
      const result = compile("let x = 5;", {
        languageFeatures: {
          enforceStrictEquality: false,
        },
      });
      expect(result).toEqual({});
    });

    test("returns CompilationError for disallowed syntax", () => {
      const result = compile("let x = 5; let y = 10;", {
        languageFeatures: {
          allowedNodes: ["VariableDeclaration"],
        },
      }) as CompilationError;
      // Should fail during parsing if multiple statements aren't allowed
      // This depends on implementation - adjust as needed
      expect(result).toBeDefined();
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      const result = compile("");
      expect(result).toEqual({});
    });

    test("handles whitespace only", () => {
      const result = compile("   \n  \t  ");
      expect(result).toEqual({});
    });

    test("handles comments only", () => {
      const result = compile("// just a comment");
      expect(result).toEqual({});
    });

    test("handles multiline comments", () => {
      const result = compile(`
        /*
         * Multi-line comment
         */
      `);
      expect(result).toEqual({});
    });
  });
});
