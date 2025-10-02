import { describe, it, expect } from "vitest";
import { interpret } from "../../src/javascript/interpreter";
import type { ExternalFunction } from "../../src/shared/interfaces";
import type { ExecutionContext } from "../../src/javascript/executor";

describe("JavaScript External Functions", () => {
  it("should call an external function with no arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "getAnswer",
      func: (context: ExecutionContext) => 42,
      description: "returns the answer to everything",
      arity: 0,
    };

    const result = interpret(`getAnswer();`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should call an external function with arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "add",
      func: (context: ExecutionContext, a: number, b: number) => a + b,
      description: "adds two numbers",
      arity: 2,
    };

    const result = interpret(`add(3, 5);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should call an external function with variable arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "sum",
      func: (context: ExecutionContext, ...args: number[]) => args.reduce((a, b) => a + b, 0),
      description: "sums all arguments",
      arity: [0, Infinity],
    };

    const result = interpret(`sum(1, 2, 3, 4, 5);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should error when calling a non-existent function", () => {
    const result = interpret(`nonExistent();`);

    expect(result.error).toBeNull(); // Runtime errors become frames
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
  });

  it("should error when calling with wrong number of arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "twoArgs",
      func: (context: ExecutionContext, a: number, b: number) => a + b,
      description: "needs two arguments",
      arity: 2,
    };

    const result = interpret(`twoArgs(1);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull(); // Runtime errors become frames
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
  });

  it("should allow external functions to be called in expressions", () => {
    const externalFunction: ExternalFunction = {
      name: "double",
      func: (context: ExecutionContext, n: number) => n * 2,
      description: "doubles a number",
      arity: 1,
    };

    const result = interpret(`let x = double(5) + 3;`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should allow external functions to receive variables as arguments", () => {
    const externalFunction: ExternalFunction = {
      name: "multiply",
      func: (context: ExecutionContext, a: number, b: number) => a * b,
      description: "multiplies two numbers",
      arity: 2,
    };

    const result = interpret(
      `
      let x = 3;
      let y = 4;
      multiply(x, y);
    `,
      {
        externalFunctions: [externalFunction],
      }
    );

    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(0);
    // Last frame should be SUCCESS
    expect(result.frames[result.frames.length - 1].status).toBe("SUCCESS");
  });

  it("should respect CallExpression node restrictions", () => {
    const externalFunction: ExternalFunction = {
      name: "test",
      func: (context: ExecutionContext) => 1,
      description: "test function",
      arity: 0,
    };

    const result = interpret(`test();`, {
      externalFunctions: [externalFunction],
      languageFeatures: {
        allowedNodes: ["LiteralExpression", "ExpressionStatement", "IdentifierExpression"], // CallExpression not allowed
      },
    });

    expect(result.error).not.toBeNull();
    expect(result.error?.type).toBe("CallExpressionNotAllowed");
  });

  it("should allow nested function calls", () => {
    const abs: ExternalFunction = {
      name: "abs",
      func: (context: ExecutionContext, n: number) => Math.abs(n),
      description: "absolute value",
      arity: 1,
    };

    const max: ExternalFunction = {
      name: "max",
      func: (context: ExecutionContext, a: number, b: number) => Math.max(a, b),
      description: "maximum of two numbers",
      arity: 2,
    };

    const result = interpret(`max(abs(-5), abs(-3));`, {
      externalFunctions: [abs, max],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should handle external functions that return strings", () => {
    const externalFunction: ExternalFunction = {
      name: "greet",
      func: (context: ExecutionContext, name: string) => `Hello, ${name}!`,
      description: "greets a person",
      arity: 1,
    };

    const result = interpret(`greet("World");`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should handle external functions that return booleans", () => {
    const externalFunction: ExternalFunction = {
      name: "isPositive",
      func: (context: ExecutionContext, n: number) => n > 0,
      description: "checks if positive",
      arity: 1,
    };

    const result = interpret(`isPositive(5);`, {
      externalFunctions: [externalFunction],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });

  it("should allow external functions in if conditions", () => {
    const externalFunction: ExternalFunction = {
      name: "isEven",
      func: (context: ExecutionContext, n: number) => n % 2 === 0,
      description: "checks if even",
      arity: 1,
    };

    const result = interpret(
      `
      if (isEven(4)) {
        let x = 1;
      }
    `,
      {
        externalFunctions: [externalFunction],
      }
    );

    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(0);
  });

  describe("Error handling", () => {
    it("should handle LogicError from external functions with educational messages", () => {
      const moveCharacter: ExternalFunction = {
        name: "move",
        func: (context: ExecutionContext, direction: string) => {
          if (direction === "off-edge") {
            context.logicError!("You can't walk through walls! The character is at the edge of the maze.");
          }
          return "OK";
        },
        description: "Moves the character in a direction",
        arity: 1,
      };

      const result = interpret('move("off-edge");', { externalFunctions: [moveCharacter] });

      expect(result.error).toBeNull(); // Runtime errors don't become parse errors
      expect(result.success).toBe(false);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("LogicErrorInExecution");
      expect((result.frames[0] as any).error.message).toBe(
        "You can't walk through walls! The character is at the edge of the maze."
      );
    });

    it("should catch and report errors thrown by external functions", () => {
      const throwingFunc: ExternalFunction = {
        name: "throwError",
        func: (context: ExecutionContext) => {
          throw new Error("Something went wrong");
        },
        description: "Function that throws an error",
        arity: 0,
      };

      const result = interpret("throwError();", { externalFunctions: [throwingFunc] });

      expect(result.error).toBeNull(); // Runtime errors don't become parse errors
      expect(result.success).toBe(false);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("FunctionExecutionError");
      expect((result.frames[0] as any).error.message).toBe(
        "FunctionExecutionError: function: throwError: message: Something went wrong"
      );
    });

    it("should handle errors with arguments", () => {
      const throwingFunc: ExternalFunction = {
        name: "riskyOperation",
        func: (context: ExecutionContext, value: number) => {
          if (value < 0) {
            throw new Error("Negative values not allowed");
          }
          return value * 2;
        },
        description: "Function that might throw",
        arity: 1,
      };

      // Should work with valid input
      let result = interpret("riskyOperation(5);", { externalFunctions: [throwingFunc] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect((result.frames[0] as any).result?.jikiObject?.value).toBe(10);

      // Should throw with invalid input
      result = interpret("riskyOperation(-5);", { externalFunctions: [throwingFunc] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
      expect((result.frames[0] as any).error.type).toBe("FunctionExecutionError");
      expect((result.frames[0] as any).error.message).toBe(
        "FunctionExecutionError: function: riskyOperation: message: Negative values not allowed"
      );
    });
  });
});
