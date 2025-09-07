import { interpret } from "@javascript/interpreter";

describe("blocks concept", () => {
  describe("parser", () => {
    test("parses empty block correctly", () => {
      const { frames, error } = interpret("{}");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].context?.type).toBe("BlockStatement");
    });

    test("parses block with single statement", () => {
      const { frames, error } = interpret("{ 42; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2); // Block frame + expression frame
      expect(frames[0].context?.type).toBe("ExpressionStatement");
      expect(frames[1].context?.type).toBe("BlockStatement");
    });

    test("parses block with multiple statements", () => {
      const { frames, error } = interpret("{ 1; 2; 3; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4); // 3 expression frames + block frame
      expect(frames[0].context?.type).toBe("ExpressionStatement");
      expect(frames[1].context?.type).toBe("ExpressionStatement");
      expect(frames[2].context?.type).toBe("ExpressionStatement");
      expect(frames[3].context?.type).toBe("BlockStatement");
    });

    test("parses nested blocks", () => {
      const { frames, error } = interpret("{ { 42; } }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // Expression + inner block + outer block
      expect(frames[0].context?.type).toBe("ExpressionStatement");
      expect(frames[1].context?.type).toBe("BlockStatement");
      expect(frames[2].context?.type).toBe("BlockStatement");
    });
  });

  describe("scope management", () => {
    test("variables declared in block are scoped to that block", () => {
      const { frames, error } = interpret("{ let innerVar = 42; }");
      expect(error).toBeNull();

      // Check that the variable exists during block execution
      const variableFrame = frames.find(frame => frame.context?.type === "VariableDeclaration");
      expect(variableFrame).toBeTruthy();
      expect(variableFrame!.variables.innerVar).toBeTruthy();

      // Check that the variable doesn't exist after block execution (in final frame)
      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.innerVar).toBeUndefined();
    });

    test("outer variables are accessible from inner blocks", () => {
      const { frames, error } = interpret("let outerVar = 10; { outerVar; }");
      expect(error).toBeNull();

      // Find the frame where we access outerVar inside the block
      const accessFrame = frames.find(
        frame =>
          frame.context?.type === "ExpressionStatement" && frame.context?.expression?.type === "IdentifierExpression"
      );
      expect(accessFrame).toBeTruthy();
      expect(accessFrame!.result.jikiObject.value).toBe(10);
    });

    test("inner variables are not accessible from outer scope", () => {
      // This should cause a runtime error when trying to access innerVar outside the block
      const { frames, error } = interpret("{ let innerVar = 42; } innerVar;");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toBe("VariableNotDeclared: name: innerVar");
    });

    test("multiple blocks have separate scopes", () => {
      const { frames, error } = interpret("{ let blockVar = 1; } { let blockVar = 2; }");
      expect(error).toBeNull();

      // Both blocks should execute successfully without conflicts
      const variableFrames = frames.filter(frame => frame.context?.type === "VariableDeclaration");
      expect(variableFrames).toBeArrayOfSize(2);
      expect(variableFrames[0].variables.blockVar).toBeTruthy();
      expect(variableFrames[1].variables.blockVar).toBeTruthy();
    });

    test("nested blocks have proper scope chain", () => {
      const { frames, error } = interpret(
        "let outerVar = 10; { let middleVar = 20; { let innerVar = 30; outerVar + middleVar + innerVar; } }"
      );
      expect(error).toBeNull();

      // Find the frame with the calculation
      const calcFrame = frames.find(frame => frame.result?.jikiObject?.value === 60);
      expect(calcFrame).toBeTruthy();
    });

    test("block variables shadow outer variables of different names", () => {
      const { frames, error } = interpret("let outerVar = 100; { let innerVar = 200; outerVar + innerVar; }");
      expect(error).toBeNull();

      // Should successfully access both variables with result 300
      const calcFrame = frames.find(frame => frame.result?.jikiObject?.value === 300);
      expect(calcFrame).toBeTruthy();
    });
  });

  describe("educational descriptions", () => {
    test("block statement has description", () => {
      const { frames, error } = interpret("{ 42; }");
      expect(error).toBeNull();

      const blockFrame = frames.find(frame => frame.context?.type === "BlockStatement");
      expect(blockFrame).toBeTruthy();
      expect(blockFrame!.description).toBeTruthy();
      expect(blockFrame!.description).toContain("block");
    });

    test("variable scoping is described in frames", () => {
      const { frames, error } = interpret("{ let scopedVar = 123; }");
      expect(error).toBeNull();

      const variableFrame = frames.find(frame => frame.context?.type === "VariableDeclaration");
      expect(variableFrame).toBeTruthy();
      expect(variableFrame!.description).toBeTruthy();
      expect(variableFrame!.description).toContain("scopedVar");
    });
  });
});
