import { parse } from "./parser";
import { Executor, RuntimeError } from "./executor";
import type { Frame } from "../shared/frames";
import type { Statement } from "./statement";
import type { JikiObject } from "./jsObjects";
import type { EvaluationResult } from "./evaluation-result";
import { describeFrame } from "./frameDescribers";

export type InterpretResult = {
  frames: Frame[];
  error: Error | null;
  success: boolean;
};

export function interpret(sourceCode: string): InterpretResult {
  try {
    // Parse the source code
    const statements = parse(sourceCode);

    // Create executor
    const executor = new Executor();

    // Execute statements and create frames
    const frames: Frame[] = [];

    function executeStatementsWithFrames(statements: Statement[], currentSourceCode: string = sourceCode): void {
      for (const statement of statements) {
        try {
          // Handle block statements specially to manage scoping and generate frames for inner statements
          if (statement.type === "BlockStatement") {
            const blockStatement = statement as any; // BlockStatement type

            // Create new environment for block scope
            const previousEnv = executor.environment;
            const { Environment } = require("./environment");
            const blockEnv = new Environment(previousEnv);

            try {
              // Switch to block environment
              executor.environment = blockEnv;

              // Execute inner statements with block environment
              executeStatementsWithFrames(blockStatement.statements, currentSourceCode);

              // Create a frame for the block itself (but don't execute it again)
              const frame: Frame = {
                line: statement.location.line,
                code: currentSourceCode.substring(
                  statement.location.absolute.begin - 1,
                  statement.location.absolute.end
                ),
                status: "SUCCESS",
                result: {
                  type: "BlockStatement" as any,
                  statements: blockStatement.statements,
                } as any,
                time: 0.01,
                timelineTime: frames.length + 1,
                description: describeFrame({
                  line: statement.location.line,
                  code: currentSourceCode.substring(
                    statement.location.absolute.begin - 1,
                    statement.location.absolute.end - 1
                  ),
                  status: "SUCCESS",
                  result: { type: "BlockStatement", statements: blockStatement.statements } as any,
                  time: 0.01,
                  timelineTime: frames.length + 1,
                  description: "",
                  context: statement,
                  priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
                  variables: previousEnv.getAllVariables(), // Use previous environment for final variables
                }),
                context: statement,
                priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
                variables: previousEnv.getAllVariables(), // Block variables should not leak out
              };
              frames.push(frame);
            } finally {
              // Always restore previous environment
              executor.environment = previousEnv;
            }
          } else {
            const result = executor.executeStatement(statement);
            const frame: Frame = createFrame(statement, result, currentSourceCode, frames, executor);
            frames.push(frame);
          }
        } catch (error) {
          // Create an error frame
          const frame: Frame = {
            line: statement.location.line,
            code: currentSourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end),
            status: "ERROR",
            error: error as RuntimeError,
            time: 0.01,
            timelineTime: frames.length + 1,
            description: `Error: ${(error as Error).message}`,
            context: statement,
            priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
            variables: executor.getVariables(),
          };

          frames.push(frame);
          // Don't re-throw the error - we want to continue processing or return the error frame
          return;
        }
      }
    }

    function createFrame(
      statement: Statement,
      result: any,
      sourceCode: string,
      frames: Frame[],
      executor: Executor
    ): Frame {
      // Keep the original result as is - tests expect the full evaluation result
      let frameResult = result;

      return {
        line: statement.location.line,
        code: sourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end),
        status: "SUCCESS",
        result: frameResult || undefined,
        time: 0.01, // Simplified timing
        timelineTime: frames.length + 1,
        description: result
          ? describeFrame({
              line: statement.location.line,
              code: sourceCode.substring(statement.location.absolute.begin - 1, statement.location.absolute.end),
              status: "SUCCESS",
              result: result,
              time: 0.01,
              timelineTime: frames.length + 1,
              description: "", // Will be filled by describeFrame
              context: statement,
              priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
              variables: executor.getVariables(),
            })
          : `Executed statement: ${statement.type}`,
        context: statement,
        priorVariables: frames.length > 0 ? { ...frames[frames.length - 1].variables } : {},
        variables: executor.getVariables(),
      };
    }

    executeStatementsWithFrames(statements);

    // Check if any frame had an error
    const errorFrame = frames.find(f => f.status === "ERROR");
    if (errorFrame) {
      return { frames, error: errorFrame.error as Error, success: false };
    }

    return { frames, error: null, success: true };
  } catch (error) {
    // Parsing or other compilation error
    return {
      frames: [],
      error: error as Error,
      success: false,
    };
  }
}
