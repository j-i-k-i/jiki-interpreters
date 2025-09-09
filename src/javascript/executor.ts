import { Environment } from "./environment";
import { SyntaxError } from "./error";
import type { Expression } from "./expression";
import type { LanguageFeatures } from "./interfaces";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  AssignmentExpression,
  UpdateExpression,
  TemplateLiteralExpression,
} from "./expression";
import { Location } from "../shared/location";
import type { Statement } from "./statement";
import {
  ExpressionStatement,
  VariableDeclaration,
  BlockStatement,
  IfStatement,
  ForStatement,
  WhileStatement,
} from "./statement";
import type { EvaluationResult } from "./evaluation-result";
import { createJSObject, type JikiObject } from "./jikiObjects";
import { translate } from "./translator";
import type { Frame, FrameExecutionStatus } from "../shared/frames";
import { describeFrame } from "./frameDescribers";
import cloneDeep from "lodash.clonedeep";

// Import individual executors
import { executeAssignmentExpression } from "./executor/executeAssignmentExpression";
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeIdentifierExpression } from "./executor/executeIdentifierExpression";
import { executeUpdateExpression } from "./executor/executeUpdateExpression";
import { executeBlockStatement } from "./executor/executeBlockStatement";
import { executeExpressionStatement } from "./executor/executeExpressionStatement";
import { executeVariableDeclaration } from "./executor/executeVariableDeclaration";
import { executeIfStatement } from "./executor/executeIfStatement";
import { executeForStatement } from "./executor/executeForStatement";
import { executeWhileStatement } from "./executor/executeWhileStatement";
import { executeTemplateLiteralExpression } from "./executor/executeTemplateLiteralExpression";

export type RuntimeErrorType =
  | "InvalidBinaryExpression"
  | "InvalidUnaryExpression"
  | "UnsupportedOperation"
  | "VariableNotDeclared"
  | "ShadowingDisabled"
  | "ComparisonRequiresNumber"
  | "TruthinessDisabled"
  | "TypeCoercionNotAllowed"
  | "StrictEqualityRequired";

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

// InterpretResult type is now defined in interpreter.ts
export type ExecutorResult = {
  frames: Frame[];
  error: null; // Always null - runtime errors become frames
  success: boolean;
};

export class Executor {
  private frames: Frame[] = [];
  private location: Location | null = null;
  private time: number = 0;
  private timePerFrame: number = 0.01;
  public environment: Environment;
  public languageFeatures: LanguageFeatures;

  constructor(
    private readonly sourceCode: string,
    languageFeatures?: LanguageFeatures
  ) {
    this.environment = new Environment();
    this.languageFeatures = {
      allowShadowing: false, // Default to false (shadowing disabled)
      allowTypeCoercion: false, // Default to false (type coercion disabled)
      enforceStrictEquality: true, // Default to true (strict equality required)
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
    } else if (statement instanceof VariableDeclaration) {
      result = this.executeFrame(statement, () => executeVariableDeclaration(this, statement));
    } else if (statement instanceof BlockStatement) {
      // Block statements should not generate frames, just execute their contents
      executeBlockStatement(this, statement);
    } else if (statement instanceof IfStatement) {
      executeIfStatement(this, statement);
    } else if (statement instanceof ForStatement) {
      executeForStatement(this, statement);
    } else if (statement instanceof WhileStatement) {
      executeWhileStatement(this, statement);
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

    if (expression instanceof AssignmentExpression) {
      return executeAssignmentExpression(this, expression);
    }

    if (expression instanceof UpdateExpression) {
      return executeUpdateExpression(this, expression);
    }

    if (expression instanceof TemplateLiteralExpression) {
      return executeTemplateLiteralExpression(this, expression);
    }

    throw new RuntimeError(
      `Unsupported expression type: ${expression.type}`,
      expression.location,
      "UnsupportedOperation"
    );
  }

  public executeBlock(statements: Statement[], environment: Environment): void {
    // Don't create a new scope if we're already in the same environment
    if (this.environment === environment) {
      for (const statement of statements) {
        this.executeStatement(statement);
      }
      return;
    }

    const previous = this.environment;
    try {
      this.environment = environment;

      for (const statement of statements) {
        this.executeStatement(statement);
      }
    } finally {
      this.environment = previous;
    }
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
    if (location == null) {
      location = Location.unknown;
    }

    const frame: Frame = {
      code: location.toCode(this.sourceCode),
      line: location.line,
      status,
      result: result || undefined,
      error,
      time: this.time,
      timelineTime: Math.round(this.time * 100),
      description: "",
      context: context,
      priorVariables: this.frames.length > 0 ? cloneDeep(this.frames[this.frames.length - 1].variables) : {},
      variables: {},
    };

    // Clone current variables
    if (process.env.NODE_ENV === "test") {
      frame.variables = cloneDeep(this.getVariables());
    } else {
      frame.variables = this.getVariables();
    }

    // Generate description
    frame.description = describeFrame(frame, {
      functionDescriptions: {}, // JavaScript doesn't have external functions yet
    });

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
    const message = translate(`error.runtime.${type}`, context);
    throw new RuntimeError(message, location, type, context);
  }
}
