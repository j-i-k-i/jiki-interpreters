import { interpret } from "@python/interpreter";
import { PyList, PyString, PyNumber } from "@python/jikiObjects";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Python Concepts - For Loops", () => {
  describe("Basic for-in loops", () => {
    test("should iterate over a list", () => {
      const { frames, error } = interpret(`mylist = [1, 2, 3]
for x in mylist:
    x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(8);
      expect(testFrames[0].description).toBe("Assignment: mylist = [1, 2, 3]");
      expect(testFrames[1].description).toBe("Starting for loop over [1, 2, 3]");
      expect(testFrames[2].description).toBe("Iteration 1: x = 1");
      expect(testFrames[3].description).toBe("Evaluating expression: 1");
      expect(testFrames[4].description).toBe("Iteration 2: x = 2");
      expect(testFrames[5].description).toBe("Evaluating expression: 2");
      expect(testFrames[6].description).toBe("Iteration 3: x = 3");
      expect(testFrames[7].description).toBe("Evaluating expression: 3");
    });

    test("should iterate over a string", () => {
      const { frames, error } = interpret(`for c in "hi":
    c`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(5);
      expect(testFrames[0].description).toBe("Starting for loop over 'hi'");
      expect(testFrames[1].description).toBe("Iteration 1: c = 'h'");
      expect(testFrames[2].description).toBe("Evaluating expression: 'h'");
      expect(testFrames[3].description).toBe("Iteration 2: c = 'i'");
      expect(testFrames[4].description).toBe("Evaluating expression: 'i'");
    });

    test("should handle empty list", () => {
      const { frames, error } = interpret(`for x in []:
    x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(1);
      expect(testFrames[0].description).toBe("Starting for loop over []");
    });

    test("should maintain variable after loop", () => {
      const { frames, error } = interpret(`for x in [10, 20]:
    x
x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(6);
      expect(testFrames[0].description).toBe("Starting for loop over [10, 20]");
      expect(testFrames[1].description).toBe("Iteration 1: x = 10");
      expect(testFrames[2].description).toBe("Evaluating expression: 10");
      expect(testFrames[3].description).toBe("Iteration 2: x = 20");
      expect(testFrames[4].description).toBe("Evaluating expression: 20");
      expect(testFrames[5].description).toBe("Evaluating expression: 20");
    });
  });

  describe("Break statement", () => {
    test("should break out of loop", () => {
      const { frames, error } = interpret(`for x in [1, 2, 3]:
    if x == 2:
        break
    x`);

      expect(error).toBeNull();
      // Check that break works - only first element should be processed
      const testFrames = frames as TestAugmentedFrame[];
      const descriptions = testFrames.map(f => f.description);
      expect(descriptions).toContain("Breaking out of loop");
      expect(descriptions).toContain("Iteration 1: x = 1");
      expect(descriptions).toContain("Iteration 2: x = 2");
      expect(descriptions).not.toContain("Iteration 3: x = 3");
    });
  });

  describe("Continue statement", () => {
    test("should continue to next iteration", () => {
      const { frames, error } = interpret(`for x in [1, 2, 3]:
    if x == 2:
        continue
    x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      const descriptions = testFrames.map(f => f.description);
      expect(descriptions).toContain("Continuing to next iteration");
      expect(descriptions).toContain("Iteration 1: x = 1");
      expect(descriptions).toContain("Iteration 2: x = 2");
      expect(descriptions).toContain("Iteration 3: x = 3");
      // x == 2 should be skipped, so we should see x=1 and x=3 evaluated
      expect(descriptions).toContain("Evaluating expression: 1");
      expect(descriptions).not.toContain("Evaluating expression: 2");
      expect(descriptions).toContain("Evaluating expression: 3");
    });
  });

  describe("Runtime errors", () => {
    test("should error on non-iterable", () => {
      const { frames, error } = interpret(`for x in 5:
    x`);

      expect(error).toBeNull(); // Runtime errors become frames
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.message).toContain("'int' object is not iterable");
    });

    test("should error on None iterable", () => {
      const { frames, error } = interpret(`for x in None:
    x`);

      expect(error).toBeNull(); // Runtime errors become frames
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.message).toContain("'NoneType' object is not iterable");
    });
  });

  describe("Nested for loops", () => {
    test("should handle nested loops", () => {
      const { frames, error } = interpret(`total = 0
for x in [1, 2]:
    for y in [3, 4]:
        total = total + x * y
total`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      const lastFrame = testFrames[testFrames.length - 1];
      expect(lastFrame.description).toBe("Evaluating expression: 21");
    });
  });
});
