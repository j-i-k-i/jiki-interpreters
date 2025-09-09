import { interpret } from "@javascript/interpreter";

describe("variables concept", () => {
  describe("parser", () => {
    test("parses variable declaration correctly", () => {
      const { frames, error } = interpret("let x = 42;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].context?.type).toBe("VariableDeclaration");
    });

    test("parses identifier expressions correctly", () => {
      const { frames, error } = interpret("let x = 42; x;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].context?.type).toBe("ExpressionStatement");
    });
  });

  describe("educational descriptions", () => {
    test("variable declaration has description", () => {
      const { frames, error } = interpret("let count = 5;");
      expect(error).toBeNull();
      expect(frames[0].description).toBeTruthy();
      expect(frames[0].description).toContain("count");
      expect(frames[0].description).toContain("5");
    });

    test("variable access has description", () => {
      const { frames, error } = interpret("let x = 10; x;");
      expect(error).toBeNull();
      expect(frames[1].description).toBeTruthy();
      expect(frames[1].description).toContain("x");
      expect(frames[1].description).toContain("10");
    });
  });

  describe("frame data integrity", () => {
    test("variable states are preserved across frames", () => {
      const { frames, error } = interpret("let a = 1; let b = 2; a + b;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);

      // Each frame should maintain variable state
      expect(frames[0].variables).toHaveProperty("a");
      expect(frames[1].variables).toHaveProperty("a");
      expect(frames[1].variables).toHaveProperty("b");
      expect(frames[2].variables).toHaveProperty("a");
      expect(frames[2].variables).toHaveProperty("b");
    });

    test("prior variables are captured", () => {
      const { frames, error } = interpret("let x = 1; let y = 2;");
      expect(error).toBeNull();

      // Second frame should have priorVariables showing state before this statement
      expect(frames[1].priorVariables).toHaveProperty("x");
      expect(frames[1].priorVariables.x.value).toBe(1);
      expect(frames[1].priorVariables).not.toHaveProperty("y");
    });
  });

  describe("assignment", () => {
    test("successful variable assignment", () => {
      const { frames, error } = interpret("let x = 5; x = 10;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].context?.type).toBe("ExpressionStatement");
      expect(frames[1].variables.x.value).toBe(10);
    });

    test("assignment updates variable correctly", () => {
      const { frames, error } = interpret("let count = 1; count = 2; count;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].variables.count.value).toBe(2);
    });

    test("assignment in different scopes", () => {
      const { frames, error } = interpret("let x = 1; { x = 2; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].variables.x.value).toBe(2);
    });

    test("assignment in different scopes persists", () => {
      const { frames, error } = interpret("let x = 1; { x = 2; } x;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].variables.x.value).toBe(2);
    });

    test("assignment with complex expressions", () => {
      const { frames, error } = interpret("let a = 5; let b = 10; a = b + 3;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].variables.a.value).toBe(13);
    });

    test("assignment in complex expressions (negation of assignment)", () => {
      const { frames, error } = interpret("let x = 5; -(x = 3);");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].variables.x.value).toBe(3); // Assignment happened inside negation
    });
  });
});
