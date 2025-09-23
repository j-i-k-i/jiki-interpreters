import { interpret } from "@jikiscript/interpreter";

describe("JikiScript performance benchmarks - Synchronous Descriptions", () => {
  beforeEach(() => {
    // Set benchmarking mode - skips variable cloning and inline description generation
    process.env.RUNNING_BENCHMARKS = "true";
    // Enable synchronous descriptions for comparison
    process.env.BENCHMARK_SYNC_DESCRIPTIONS = "true";
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.RUNNING_BENCHMARKS;
    delete process.env.BENCHMARK_SYNC_DESCRIPTIONS;
  });

  test("10 frames - simple addition (sync)", () => {
    const code = `
      set x to 0
      repeat 10 times do
        change x to x + 1
      end
    `;

    const startTime = performance.now();
    const result = interpret(code);
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`10 frames (sync): ${executionTime.toFixed(2)}ms`);
    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(10);
  });

  test("1,000 frames - list operations (sync)", () => {
    const code = `
      set items to []
      set count to 0
      repeat 32 times do
        repeat 32 times do
          change items to [count, count * 2, count * 3]
          change count to count + 1
        end
      end
    `;

    const startTime = performance.now();
    const result = interpret(code, {
      languageFeatures: {
        maxTotalLoopIterations: 10000,
      },
    });
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`~1,000 frames (sync): ${executionTime.toFixed(2)}ms (${result.frames.length} frames)`);
    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(1000);
  });

  test("10,000 frames - arithmetic operations (sync)", () => {
    const code = `
      set total to 0
      set factor to 2.5
      repeat 100 times do
        repeat 100 times do
          change total to (total * factor) / (factor + 1) + 3
        end
      end
    `;

    const startTime = performance.now();
    const result = interpret(code, {
      languageFeatures: {
        maxTotalLoopIterations: 100000,
      },
    });
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`10,000 frames (sync): ${executionTime.toFixed(2)}ms`);
    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(10000);
  });

  test("100,000 frames - complex expressions (sync)", () => {
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
        maxTotalLoopIterations: 1000000,
        maxTotalExecutionTime: 60000,
      },
    });
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    const frameCount = result.frames.length;
    const framesPerMs = frameCount / executionTime;

    console.log(`
Benchmark Results (Sync):
==================
Total frames generated: ${frameCount}
Execution time: ${executionTime.toFixed(2)}ms
Frames per millisecond: ${framesPerMs.toFixed(2)}
Average time per frame: ${(executionTime / frameCount).toFixed(4)}ms
    `);

    expect(result.error).toBeNull();
    expect(frameCount).toBeGreaterThan(95000);
    expect(frameCount).toBeLessThan(105000);
    expect(executionTime).toBeLessThan(30000);
  });

  test.skip("1,000,000 frames - modulo and comparisons (sync)", { timeout: 60000 }, () => {
    const code = `
      set counter to 0
      set result to 0
      repeat 1000 times do
        repeat 1000 times do
          if counter % 2 is 0 do
            change result to result + counter
          else do
            change result to result - counter
          end
          change counter to counter + 1
        end
      end
    `;

    const startTime = performance.now();
    const result = interpret(code, {
      languageFeatures: {
        maxTotalLoopIterations: 10000000,
        maxTotalExecutionTime: 300000,
      },
    });
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    const frameCount = result.frames.length;

    console.log(`
1M Frames Benchmark (Sync):
====================
Total frames: ${frameCount}
Execution time: ${executionTime.toFixed(2)}ms (${(executionTime / 1000).toFixed(2)}s)
Frames per ms: ${(frameCount / executionTime).toFixed(2)}
    `);

    expect(result.error).toBeNull();
    expect(frameCount).toBeGreaterThan(1000000);
  });
});
