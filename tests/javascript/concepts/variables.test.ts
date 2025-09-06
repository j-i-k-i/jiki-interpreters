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
});
