import { interpret } from "@jikiscript/interpreter";

describe("JikiScript performance benchmarks", () => {
  test("generates 100k frames with complex descriptions (benchmark)", () => {
    // Generates approximately 100k frames to benchmark performance
    // Need to increase loop iteration limits for this test
    const code = `
      set total to 0
      set multiplier to 2
      set divisor to 3
      set addend to 5
      set counter to 0

      repeat 183 times do
        repeat 183 times do
          change total to ((counter * multiplier) + (counter / divisor)) * addend + total - (counter - multiplier)
          change counter to counter + 1
        end
      end
    `;

    const startTime = performance.now();
    const result = interpret(code, {
      languageFeatures: {
        maxTotalLoopIterations: 1000000, // 1 million iterations allowed
        maxTotalExecutionTime: 60000, // 60 seconds allowed
      },
    });
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    const frameCount = result.frames.length;
    const framesPerMs = frameCount / executionTime;

    console.log(`
Benchmark Results:
==================
Total frames generated: ${frameCount}
Execution time: ${executionTime.toFixed(2)}ms
Frames per millisecond: ${framesPerMs.toFixed(2)}
Average time per frame: ${(executionTime / frameCount).toFixed(4)}ms
    `);

    // Basic assertions to ensure the test ran correctly
    expect(result.error).toBeNull();
    expect(frameCount).toBeGreaterThan(95000); // Should be around 100k
    expect(frameCount).toBeLessThan(105000); // But not too much more

    // Performance assertion - should complete in reasonable time
    // Adjust this threshold based on your performance requirements
    expect(executionTime).toBeLessThan(30000); // 30 seconds max

    // Log a warning if it's slow
    if (executionTime > 10000) {
      console.warn(`⚠️ Performance warning: Execution took ${(executionTime / 1000).toFixed(2)} seconds`);
    }

    // Verify the final value is computed correctly (spot check)
    const finalTotal = result.frames[result.frames.length - 1].variables.total;
    expect(finalTotal).toBeDefined();
    expect(finalTotal.value).toBeGreaterThan(0);
  });

  test.skip("generates 10k frames for quick benchmark", () => {
    // Smaller benchmark for faster CI runs
    // 100 * 100 = 10,000 frames
    const code = `
      set total to 0
      set i to 0
      while i < 100
        set j to 0
        while j < 100
          set total to total + (i * 10) + (j / 2) - 5
          set j to j + 1
        end
        set i to i + 1
      end
    `;

    const startTime = performance.now();
    const result = interpret(code, {
      languageFeatures: {
        maxTotalLoopIterations: 100000, // 100k iterations allowed for smaller test
        maxTotalExecutionTime: 10000, // 10 seconds allowed
      },
    });
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    const frameCount = result.frames.length;

    console.log(`
Quick Benchmark:
================
Frames: ${frameCount}, Time: ${executionTime.toFixed(2)}ms
    `);

    expect(result.error).toBeNull();
    expect(frameCount).toBeGreaterThan(10000);
    expect(executionTime).toBeLessThan(5000); // 5 seconds max for 10k frames
  });
});
