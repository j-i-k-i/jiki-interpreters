import { describe, expect, it } from "bun:test";
import { interpret } from "../../src/python/interpreter";
import { changeLanguage } from "../../src/python/translator";

// UNIMPLEMENTED TOKENS
// When implementing a token, move it from this section to the appropriate implemented section
// and create proper scanner tests for it.
describe("Python - Unimplemented Tokens", () => {
  // Set language to system for consistent error messages
  changeLanguage("system");

  describe("Unimplemented Keywords", () => {
    const unimplementedKeywords = [
      { token: "as", type: "AS" },
      { token: "assert", type: "ASSERT" },
      { token: "async", type: "ASYNC" },
      { token: "await", type: "AWAIT" },
      { token: "break", type: "BREAK" },
      { token: "class", type: "CLASS" },
      { token: "continue", type: "CONTINUE" },
      { token: "def", type: "DEF" },
      { token: "del", type: "DEL" },
      { token: "except", type: "EXCEPT" },
      { token: "finally", type: "FINALLY" },
      { token: "for", type: "FOR" },
      { token: "from", type: "FROM" },
      { token: "global", type: "GLOBAL" },
      { token: "import", type: "IMPORT" },
      { token: "in", type: "IN" },
      { token: "is", type: "IS" },
      { token: "lambda", type: "LAMBDA" },
      { token: "nonlocal", type: "NONLOCAL" },
      // { token: "not", type: "NOT" }, - Already implemented
      { token: "pass", type: "PASS" },
      { token: "raise", type: "RAISE" },
      { token: "return", type: "RETURN" },
      { token: "try", type: "TRY" },
      { token: "while", type: "WHILE" },
      { token: "with", type: "WITH" },
      { token: "yield", type: "YIELD" },
    ];

    unimplementedKeywords.forEach(({ token, type }) => {
      it(`should error on '${token}' keyword`, () => {
        const result = interpret(`${token}`);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context).toEqual({
          tokenType: type,
          lexeme: token,
        });
      });
    });
  });

  describe("Unimplemented Operators", () => {
    const unimplementedOperators = [
      { code: "1, 2", token: ",", type: "COMMA" },
      { code: "obj.prop", token: ".", type: "DOT" },
      // { code: "5 % 2", token: "%", type: "PERCENT" }, - Already implemented
      { code: "5;", token: ";", type: "SEMICOLON" },
      { code: "[1, 2]", token: "[", type: "LEFT_BRACKET" },
    ];

    unimplementedOperators.forEach(({ code, token, type }) => {
      it(`should error on '${token}' operator`, () => {
        const result = interpret(code);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context.tokenType).toBe(type);
      });
    });
  });

  describe("Compound statements", () => {
    it("should error on function definition", () => {
      const result = interpret("def foo():\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("DEF");
    });

    it("should error on class definition", () => {
      const result = interpret("class Foo:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("CLASS");
    });

    it("should error on for loop", () => {
      const result = interpret("for i in range(10):\n    print(i)");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("FOR");
    });

    it("should error on while loop", () => {
      const result = interpret("while True:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("WHILE");
    });

    it("should error on try statement", () => {
      const result = interpret("try:\n    pass\nexcept:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("TRY");
    });

    it("should error on with statement", () => {
      const result = interpret("with open('file') as f:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("WITH");
    });
  });

  // The 'not' operator is already implemented as a unary operator

  describe("Special operators", () => {
    it("should error on 'is' operator", () => {
      const result = interpret("a is b");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("IS");
    });

    it("should error on 'in' operator", () => {
      const result = interpret("a in b");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("IN");
    });
  });
});
