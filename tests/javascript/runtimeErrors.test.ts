import { interpret } from "@javascript/interpreter";
import { RuntimeErrorType } from "@javascript/executor";
import { Frame } from "../../src/shared/frames";
import { changeLanguage } from "@javascript/translator";

beforeAll(async () => {
  await changeLanguage("system");
});

afterAll(async () => {
  await changeLanguage("en");
});

function expectFrameToBeError(frame: Frame, code: string, type: RuntimeErrorType) {
  expect(frame.code.trim()).toBe(code.trim());
  expect(frame.status).toBe("ERROR");
  expect(frame.error).not.toBeNull();
  expect(frame.error!.category).toBe("RuntimeError");
  expect(frame.error!.type).toBe(type);
}

describe("Runtime Errors", () => {
  describe("VariableNotDeclared", () => {
    test("simple undefined variable", () => {
      const code = "x;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in expression", () => {
      const code = "5 + a;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: a");
    });

    test("undefined variable on right side of binary expression", () => {
      const code = "10 * b;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: b");
    });

    test("undefined variable on left side of binary expression", () => {
      const code = "c - 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: c");
    });

    test("multiple undefined variables - should error on first", () => {
      const code = "x + y;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable after defined variable", () => {
      const code = "let x = 5; y;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expectFrameToBeError(frames[1], "y;", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable in complex expression", () => {
      const code = "let a = 10; let b = 20; a + b + c;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[1].status).toBe("SUCCESS");
      expectFrameToBeError(frames[2], "a + b + c;", "VariableNotDeclared");
      expect(frames[2].error!.message).toBe("VariableNotDeclared: name: c");
    });

    test("undefined variable in block scope", () => {
      const code = "{ x; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x;", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("variable out of scope", () => {
      const code = "{ let x = 5; } x;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].status).toBe("SUCCESS"); // Variable declaration inside block
      expect(frames[1].status).toBe("SUCCESS"); // Block statement
      expectFrameToBeError(frames[2], "x;", "VariableNotDeclared");
      expect(frames[2].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("nested block undefined variable", () => {
      const code = "{ { y; } }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "y;", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable in string concatenation", () => {
      const code = '"Hello " + name;';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: name");
    });

    test("undefined variable in boolean expression", () => {
      const code = "true && flag;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: flag");
    });

    test.skip("undefined variable in comparison", () => {
      // Skip: Comparison operators not yet implemented in parser
      const code = "x > 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in negation", () => {
      const code = "-x;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable in grouping", () => {
      const code = "(x + 5);";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });
  });

  describe("VariableNotDeclared for Updates", () => {
    test("simple undefined variable assignment", () => {
      const code = "x = 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable assignment with expression", () => {
      const code = "y = 10 + 5;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable assignment after defined variable", () => {
      const code = "let x = 5; y = 10;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expectFrameToBeError(frames[1], "y = 10;", "VariableNotDeclared");
      expect(frames[1].error!.message).toBe("VariableNotDeclared: name: y");
    });

    test("undefined variable assignment in block scope", () => {
      const code = "{ x = 5; }";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "x = 5;", "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("undefined variable assignment with string value", () => {
      const code = 'name = "John";';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: name");
    });

    test("undefined variable assignment with boolean value", () => {
      const code = "flag = true;";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], code, "VariableNotDeclared");
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: flag");
    });

    test("variable out of scope assignment", () => {
      const code = "{ let x = 5; } x = 10;";
      const { frames } = interpret(code);
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].status).toBe("SUCCESS"); // Variable declaration inside block
      expect(frames[1].status).toBe("SUCCESS"); // Block statement
      expectFrameToBeError(frames[2], "x = 10;", "VariableNotDeclared");
      expect(frames[2].error!.message).toBe("VariableNotDeclared: name: x");
    });
  });
});
