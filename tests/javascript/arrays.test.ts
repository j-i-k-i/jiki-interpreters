import { test, expect, describe } from "vitest";
import { interpret } from "../../src/javascript/interpreter";

// Type for frames augmented in test environment
interface TestFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
}

describe("JavaScript Arrays", () => {
  describe("Array creation", () => {
    test("empty array", () => {
      const code = `let arr = [];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[]");
      expect(frame.variables?.["arr"].toString()).toBe("[]");
    });

    test("array with single number", () => {
      const code = `let arr = [42];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 42 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 42 ]");
    });

    test("array with multiple numbers", () => {
      const code = `let arr = [1, 2, 3];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 1, 2, 3 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 1, 2, 3 ]");
    });

    test("array with mixed types", () => {
      const code = `let arr = [42, "hello", true, null];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe(`[ 42, hello, true, null ]`);
      expect(frame.variables?.["arr"].toString()).toBe(`[ 42, hello, true, null ]`);
    });

    test("array with expressions", () => {
      const code = `let arr = [1 + 1, 2 * 3, 10 - 5];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 2, 6, 5 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 2, 6, 5 ]");
    });

    test("array with variables", () => {
      const code = `
        let x = 10;
        let y = 20;
        let arr = [x, y, x + y];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(3);

      const frame = result.frames[2] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 10, 20, 30 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 10, 20, 30 ]");
    });

    test("nested arrays", () => {
      const code = `let arr = [[1, 2], [3, 4], []];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ [ 1, 2 ], [ 3, 4 ], [] ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ [ 1, 2 ], [ 3, 4 ], [] ]");
    });
  });

  describe("Array descriptions", () => {
    test("empty array description", () => {
      const code = `let arr = [];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      expect(frame.description).toContain("Created an empty list");
    });

    test("single element array description", () => {
      const code = `let arr = [42];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      expect(frame.description).toContain("Created a list with 1 element: [ 42 ]");
    });

    test("multiple elements array description", () => {
      const code = `let arr = [1, 2, 3];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      expect(frame.description).toContain("Created a list with 3 elements: [ 1, 2, 3 ]");
    });
  });

  describe("Syntax errors", () => {
    test("missing closing bracket", () => {
      const code = `let arr = [1, 2, 3;`;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingRightBracketInArray");
      expect(result.frames.length).toBe(0);
    });

    test("trailing comma", () => {
      const code = `let arr = [1, 2, 3,];`;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("TrailingCommaInArray");
      expect(result.frames.length).toBe(0);
    });

    test("trailing comma in empty array", () => {
      const code = `let arr = [,];`;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("TrailingCommaInArray");
      expect(result.frames.length).toBe(0);
    });
  });

  describe("Array cloning", () => {
    test("array cloning for immutability", () => {
      const code = `let arr = [1, 2, 3];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      const jikiObject = frame.result?.jikiObject;
      const immutableJikiObject = frame.result?.immutableJikiObject;

      // The objects should be different instances (cloned)
      expect(jikiObject).not.toBe(immutableJikiObject);

      // But their values should be the same
      expect(jikiObject?.toString()).toBe(immutableJikiObject?.toString());
    });
  });
});
