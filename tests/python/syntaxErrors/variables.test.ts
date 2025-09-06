import { interpret } from "@python/interpreter";
import { SyntaxError } from "@python/error";
import { changeLanguage } from "@python/translator";

beforeAll(async () => {
  changeLanguage("system");
});

describe("variables syntax errors", () => {
  describe("undefined variable access", () => {
    test("accessing undefined variable", () => {
      const { frames, error } = interpret("undefined_var");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'undefined_var'");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("accessing undefined variable in expression", () => {
      const { frames, error } = interpret("5 + missing_var");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'missing_var'");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("using undefined variable after defining another", () => {
      const { frames, error } = interpret("x = 10\ny");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'y'");
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[1].status).toBe("ERROR");
    });
  });

  describe("invalid assignment syntax", () => {
    test("missing variable name", () => {
      const { frames, error } = interpret("= 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("ParseError");
    });

    test("missing value after equals", () => {
      const { frames, error } = interpret("x =");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("ParseError");
    });

    test("number as variable name", () => {
      const { frames, error } = interpret("123 = 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("ParseError");
    });

    test("keyword as variable name", () => {
      const { frames, error } = interpret("True = 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("ParseError");
    });

    test("string as variable name", () => {
      const { frames, error } = interpret('"hello" = 5');
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("ParseError");
    });
  });

  describe("complex undefined variable scenarios", () => {
    test("undefined variable in complex expression", () => {
      const { frames, error } = interpret("result = (5 + unknown) * 2");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'unknown'");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("multiple undefined variables", () => {
      const { frames, error } = interpret("a + b");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("assigning undefined variable to another variable", () => {
      const { frames, error } = interpret("x = undefined_var");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'undefined_var'");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("using undefined variable in comparison", () => {
      const { frames, error } = interpret("missing > 5");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'missing'");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("using undefined variable in logical expression", () => {
      const { frames, error } = interpret("True and missing");
      expect(error).not.toBeNull();
      expect(error?.message).toContain("Undefined variable 'missing'");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });
  });

  describe("edge cases", () => {
    test("empty variable name", () => {
      // This would be caught by the scanner as an invalid token
      const { frames, error } = interpret(" = 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("ParseError");
    });
  });
});
