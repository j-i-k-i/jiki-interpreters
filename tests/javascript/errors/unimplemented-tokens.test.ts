import { describe, expect, it } from "bun:test";
import { interpret } from "../../../src/javascript/interpreter";
import { changeLanguage } from "../../../src/javascript/translator";

describe("JavaScript - Unimplemented Tokens", () => {
  // Set language to system for consistent error messages
  changeLanguage("system");

  describe("Keywords", () => {
    const unimplementedKeywords = [
      { token: "break", type: "BREAK" },
      { token: "case", type: "CASE" },
      { token: "catch", type: "CATCH" },
      { token: "class", type: "CLASS" },
      { token: "const", type: "CONST" },
      { token: "continue", type: "CONTINUE" },
      { token: "debugger", type: "DEBUGGER" },
      { token: "default", type: "DEFAULT" },
      { token: "delete", type: "DELETE" },
      { token: "do", type: "DO" },
      { token: "export", type: "EXPORT" },
      { token: "extends", type: "EXTENDS" },
      { token: "finally", type: "FINALLY" },
      { token: "function", type: "FUNCTION" },
      { token: "import", type: "IMPORT" },
      { token: "in", type: "IN" },
      { token: "instanceof", type: "INSTANCEOF" },
      { token: "new", type: "NEW" },
      { token: "return", type: "RETURN" },
      { token: "super", type: "SUPER" },
      { token: "switch", type: "SWITCH" },
      { token: "this", type: "THIS" },
      { token: "throw", type: "THROW" },
      { token: "try", type: "TRY" },
      { token: "typeof", type: "TYPEOF" },
      { token: "var", type: "VAR" },
      { token: "void", type: "VOID" },
      { token: "with", type: "WITH" },
      { token: "yield", type: "YIELD" },
    ];

    unimplementedKeywords.forEach(({ token, type }) => {
      it(`should error on '${token}' keyword`, () => {
        const result = interpret(`${token};`);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context).toEqual({
          tokenType: type,
          lexeme: token,
        });
      });
    });
  });

  describe("Operators", () => {
    const unimplementedOperators = [
      { code: "5 & 3", token: "&", type: "AMPERSAND" },
      { code: "`template`", token: "`", type: "BACKTICK" },
      { code: "5 ^ 3", token: "^", type: "CARET" },
      { code: "obj: 1", token: ":", type: "COLON" },
      { code: "1, 2", token: ",", type: "COMMA" },
      { code: "obj.prop", token: ".", type: "DOT" },
      { code: "[1, 2]", token: "[", type: "LEFT_BRACKET" },
      { code: "5 % 2", token: "%", type: "PERCENT" },
      { code: "5 | 3", token: "|", type: "PIPE" },
      { code: "true ? 1 : 2", token: "?", type: "QUESTION" },
      { code: "~5", token: "~", type: "TILDE" },
      { code: "() => 5", token: "=>", type: "ARROW" },
      { code: "x &= 3", token: "&=", type: "AND_EQUAL" },
      { code: "x /= 2", token: "/=", type: "DIVIDE_EQUAL" },
      { code: "x << 2", token: "<<", type: "LEFT_SHIFT" },
      { code: "x -= 2", token: "-=", type: "MINUS_EQUAL" },
      { code: "x %= 2", token: "%=", type: "MODULO_EQUAL" },
      { code: "x *= 2", token: "*=", type: "MULTIPLY_EQUAL" },
      { code: "5 !== 3", token: "!==", type: "NOT_STRICT_EQUAL" },
      { code: "x |= 3", token: "|=", type: "OR_EQUAL" },
      { code: "x += 2", token: "+=", type: "PLUS_EQUAL" },
      { code: "x >> 2", token: ">>", type: "RIGHT_SHIFT" },
      { code: "5 === 5", token: "===", type: "STRICT_EQUAL" },
      { code: "x ^= 3", token: "^=", type: "XOR_EQUAL" },
    ];

    unimplementedOperators.forEach(({ code, token, type }) => {
      it(`should error on '${token}' operator`, () => {
        const result = interpret(code + ";");
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context.tokenType).toBe(type);
      });
    });
  });
});
