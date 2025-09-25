import { Environment } from "./environment";
import { SyntaxError } from "./error";
import type { Expression } from "./expression";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  ListExpression,
  SubscriptExpression,
} from "./expression";
import { Location } from "../shared/location";
import type { Statement } from "./statement";
import {
  ExpressionStatement,
  AssignmentStatement,
  PrintStatement,
  IfStatement,
  BlockStatement,
  ForInStatement,
  BreakStatement,
  ContinueStatement,
} from "./statement";
import type { EvaluationResult } from "./evaluation-result";
import { createPyObject, PyString, type JikiObject } from "./jikiObjects";
import { TIME_SCALE_FACTOR, type Frame, type FrameExecutionStatus, type TestAugmentedFrame } from "../shared/frames";
import { type ExecutionContext as SharedExecutionContext } from "../shared/interfaces";
import { createBaseExecutionContext } from "../shared/executionContext";
import type { LanguageFeatures } from "./interfaces";
import cloneDeep from "lodash.clonedeep";
import type { PythonFrame } from "./frameDescribers";
import { describeFrame } from "./frameDescribers";

// Import individual executors
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeExpressionStatement } from "./executor/executeExpressionStatement";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeIdentifierExpression } from "./executor/executeIdentifierExpression";
import { executeAssignmentStatement } from "./executor/executeAssignmentStatement";
import { executeIfStatement } from "./executor/executeIfStatement";
import { executeBlockStatement } from "./executor/executeBlockStatement";
import { executeListExpression } from "./executor/executeListExpression";
import { executeSubscriptExpression } from "./executor/executeSubscriptExpression";
import { executeForInStatement } from "./executor/executeForInStatement";
import { executeBreakStatement } from "./executor/executeBreakStatement";
import { executeContinueStatement } from "./executor/executeContinueStatement";

// Execution context for Python stdlib (future use)
export type ExecutionContext = SharedExecutionContext & {
  // Additional Python-specific properties can be added here
};

export type RuntimeErrorType =
  | "InvalidBinaryExpression"
  | "InvalidUnaryExpression"
  | "UndefinedVariable"
  | "UnsupportedOperation"
  | "TypeError"
  | "TruthinessDisabled"
  | "TypeCoercionNotAllowed"
  | "IndexError";

export class RuntimeError extends Error {
  public category: string = "RuntimeError";

  constructor(
    message: string,
    public location: Location,
    public type: RuntimeErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "RuntimeError";
  }
}

export interface ExecutorResult {
  frames: Frame[];
  error: null; // Always null - runtime errors become frames
  success: boolean;
}

export class Executor {
  private readonly frames: Frame[] = [];
  private location: Location | null = null;
  public time: number = 0;
  private readonly timePerFrame: number = 1;
  public environment: Environment;
  public languageFeatures: LanguageFeatures;

  constructor(
    private readonly sourceCode: string,
    languageFeatures?: LanguageFeatures
  ) {
    this.environment = new Environment();
    this.languageFeatures = {
      allowTruthiness: false, // Default to false for educational purposes
      allowTypeCoercion: false,
      ...languageFeatures,
    };
  }

  public execute(statements: Statement[]): ExecutorResult {
    for (const statement of statements) {
      try {
        const success = this.withExecutionContext(() => {
          this.executeStatement(statement);
        });

        if (!success) {
          break;
        }
      } catch (error) {
        if (error instanceof RuntimeError) {
          this.addErrorFrame(this.location || error.location, error);
          break;
        }
        throw error;
      }
    }

    return {
      frames: this.frames,
      error: null, // Always null - runtime errors are in frames
      success: !this.frames.find(f => f.status === "ERROR"),
    };
  }

  private withExecutionContext(fn: Function): boolean {
    try {
      fn();
      return true;
    } catch (error) {
      // Re-throw RuntimeErrors to be handled by outer try-catch
      if (error instanceof RuntimeError) {
        throw error;
      }
      throw error;
    }
  }

  public executeFrame<T extends EvaluationResult>(context: Statement | Expression, code: () => T): T {
    this.location = context.location;
    const result = code();
    this.addSuccessFrame(context.location, result, context);
    this.location = null;
    return result;
  }

  public executeStatement(statement: Statement): EvaluationResult | null {
    let result: EvaluationResult | null = null;

    if (statement instanceof ExpressionStatement) {
      result = this.executeFrame(statement, () => executeExpressionStatement(this, statement));
    } else if (statement instanceof AssignmentStatement) {
      result = this.executeFrame(statement, () => executeAssignmentStatement(this, statement));
    } else if (statement instanceof IfStatement) {
      result = executeIfStatement(this, statement);
    } else if (statement instanceof BlockStatement) {
      result = executeBlockStatement(this, statement);
    } else if (statement instanceof ForInStatement) {
      result = executeForInStatement(this, statement);
    } else if (statement instanceof BreakStatement) {
      executeBreakStatement(this, statement);
      result = null;
    } else if (statement instanceof ContinueStatement) {
      executeContinueStatement(this, statement);
      result = null;
    }

    return result;
  }

  public evaluate(expression: Expression): EvaluationResult {
    if (expression instanceof LiteralExpression) {
      return executeLiteralExpression(this, expression);
    }

    if (expression instanceof BinaryExpression) {
      return executeBinaryExpression(this, expression);
    }

    if (expression instanceof UnaryExpression) {
      return executeUnaryExpression(this, expression);
    }

    if (expression instanceof GroupingExpression) {
      return executeGroupingExpression(this, expression);
    }

    if (expression instanceof IdentifierExpression) {
      return executeIdentifierExpression(this, expression);
    }

    if (expression instanceof ListExpression) {
      return executeListExpression(this, expression);
    }

    if (expression instanceof SubscriptExpression) {
      return executeSubscriptExpression(this, expression);
    }

    throw new RuntimeError(`Unknown expression type: ${expression.type}`, expression.location, "UnsupportedOperation");
  }

  public addSuccessFrame(
    location: Location | null,
    result: EvaluationResult | null,
    context?: Statement | Expression
  ): void {
    this.addFrame(location, "SUCCESS", result, undefined, context);
  }

  public addErrorFrame(location: Location | null, error: RuntimeError, context?: Statement | Expression): void {
    this.addFrame(location, "ERROR", undefined, error, context);
  }

  private addFrame(
    location: Location | null,
    status: FrameExecutionStatus,
    result?: EvaluationResult | null,
    error?: RuntimeError,
    context?: Statement | Expression
  ): void {
    if (location === null) {
      location = Location.unknown;
    }

    const frame: PythonFrame = {
      code: location.toCode(this.sourceCode),
      line: location.line,
      status,
      result: result || undefined,
      error,
      time: this.time,
      timeInMs: Math.round(this.time / TIME_SCALE_FACTOR),
      generateDescription: () => describeFrame(frame),
      context: context,
    };

    // In testing mode (but not benchmarks), augment frame with test-only fields
    if (process.env.NODE_ENV === "test" && process.env.RUNNING_BENCHMARKS !== "true") {
      (frame as TestAugmentedFrame).variables = cloneDeep(this.getVariables());
      // Generate description immediately for testing
      (frame as TestAugmentedFrame).description = describeFrame(frame);
    }

    this.frames.push(frame);
    this.time += this.timePerFrame;
  }

  public getVariables(): Record<string, JikiObject> {
    return this.environment.getAllVariables();
  }

  public verifyBoolean(value: JikiObject, location: Location): void {
    // If truthiness is allowed, any value is acceptable
    if (this.languageFeatures.allowTruthiness) {
      return;
    }

    // If truthiness is disabled, only boolean values are allowed
    if (value.type !== "boolean") {
      this.error("TruthinessDisabled", location, {
        value: value.type,
      });
    }
  }

  public error(type: RuntimeErrorType, location: Location, context?: any): never {
    throw new RuntimeError(`${type}: ${JSON.stringify(context)}`, location, type, context);
  }

  // Get execution context for stdlib functions
  public getExecutionContext(): ExecutionContext {
    return createBaseExecutionContext.call(this);
  }
}
