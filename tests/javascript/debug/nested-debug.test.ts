import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Debug Nested", () => {
  it("debug first failure", () => {
    const code = `
      let x = [
        { something: [{ foo: [0, 1, 2, 3, 4, 5] }] }
      ];
      x[0].something[0]['foo'][5] = 'bar';
    `;
    const result = interpret(code);


    if (!result.success && result.error) {
    }

    if (result.frames.length > 0) {
      for (let i = 0; i < result.frames.length; i++) {
        const frame = result.frames[i] as TestAugmentedFrame;
        if (frame.error) {
        }
      }
    }

    expect(result.success).toBe(true);
  });
});
