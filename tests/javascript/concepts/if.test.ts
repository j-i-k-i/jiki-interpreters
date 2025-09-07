import { interpret } from "@javascript/interpreter";
import { changeLanguage } from "@javascript/translator";

beforeAll(async () => {
  await changeLanguage("system");
});

afterAll(async () => {
  await changeLanguage("en");
});

describe("if statement concept", () => {
  describe("parser", () => {
    test("parses if statement correctly", () => {
      const { frames, error } = interpret("if (true) { let x = 5; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // if condition frame + var decl frame + block frame
      expect(frames[0].context?.type).toBe("IfStatement");
    });

    test("parses if-else statement correctly", () => {
      const { frames, error } = interpret("if (false) { let x = 5; } else { let y = 10; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // if condition frame + var decl frame + block frame
      expect(frames[0].context?.type).toBe("IfStatement");
    });

    test("parses if with single statement correctly", () => {
      const { frames, error } = interpret("let x = 1; if (true) x = 2;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3); // variable declaration + if condition + assignment
      expect(frames[1].context?.type).toBe("IfStatement");
    });
  });

  describe("execution", () => {
    test("executes then branch when condition is true", () => {
      const { frames, error } = interpret("let x = 1; if (true) { x = 5; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4); // var decl + if condition + block + assignment

      // Check final variable value
      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.x.value).toBe(5);
    });

    test("skips then branch when condition is false", () => {
      const { frames, error } = interpret("let x = 1; if (false) { x = 5; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2); // var decl + if condition only

      // Check variable unchanged
      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.x.value).toBe(1);
    });

    test("executes else branch when condition is false", () => {
      const { frames, error } = interpret("let x = 1; if (false) { x = 5; } else { x = 10; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4); // var decl + if condition + else block + assignment

      // Check variable value from else branch
      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.x.value).toBe(10);
    });

    test("works with boolean conditions", () => {
      const { frames, error } = interpret("let x = 5; if (true) { x = 100; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4); // var decl + if condition + assignment + block

      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.x.value).toBe(100);
    });

    test("works with logical operators", () => {
      const { frames, error } = interpret("let a = true; let b = false; if (a && !b) { let result = 1; }");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(5); // 2 var decls + if condition + inner var decl + block

      // result variable should not exist in final frame (outside the block)
      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.result).toBeUndefined();
    });

    test("simple nested if statements work correctly", () => {
      const { frames, error } = interpret("let x = 1; if (true) x = 5;");
      expect(error).toBeNull();

      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.x.value).toBe(5);
    });
  });

  describe("scoping", () => {
    test("variables declared in if block are scoped correctly", () => {
      const { frames, error } = interpret(`
        if (true) {
          let blockVar = 42;
        }
      `);
      expect(error).toBeNull();

      // blockVar should not exist in final frame (outside the block)
      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.blockVar).toBeUndefined();
    });

    test("variables from outer scope accessible in if block", () => {
      const { frames, error } = interpret(`
        let outerVar = 10;
        if (true) {
          outerVar = 20;
        }
      `);
      expect(error).toBeNull();

      const finalFrame = frames[frames.length - 1];
      expect(finalFrame.variables.outerVar.value).toBe(20);
    });
  });

  describe("educational descriptions", () => {
    test("if statement has meaningful description", () => {
      const { frames, error } = interpret("if (true) { let x = 5; }");
      expect(error).toBeNull();
      expect(frames[0].description).toBeTruthy();
      expect(frames[0].description).toContain("condition");
      expect(frames[0].description).toContain("true");
    });

    test("if-else statement describes both branches", () => {
      const { frames, error } = interpret("if (false) { let x = 5; } else { let y = 10; }");
      expect(error).toBeNull();
      expect(frames[0].description).toBeTruthy();
      expect(frames[0].description).toContain("false");
      expect(frames[0].description).toContain("else");
    });
  });
});
