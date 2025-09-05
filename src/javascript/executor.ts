import { Environment } from "./environment";
import { SyntaxError } from "./error";
import type { Expression } from "./expression";
import { LiteralExpression, BinaryExpression, UnaryExpression, GroupingExpression } from "./expression";
import { Location } from "./location";
import type { Statement } from "./statement";
import { ExpressionStatement } from "./statement";
import type { EvaluationResult } from "./evaluation-result";
import { createJikiObject, type JikiObject } from "./jikiObjects";

// Import individual executors
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";

export type RuntimeErrorType = "InvalidBinaryExpression" | "InvalidUnaryExpression" | "UnsupportedOperation";

export class RuntimeError extends Error {
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

export class Executor {
  private environment: Environment;

  constructor() {
    this.environment = new Environment();
  }

  public executeStatement(statement: Statement): EvaluationResult | null {
    if (statement instanceof ExpressionStatement) {
      const expressionResult = this.evaluate(statement.expression);
      return {
        type: "ExpressionStatement",
        expression: expressionResult,
        jikiObject: expressionResult.jikiObject,
        jsObject: expressionResult.jikiObject,
      } as any;
    }

    return null;
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

    throw new RuntimeError(
      `Unsupported expression type: ${expression.type}`,
      expression.location,
      "UnsupportedOperation"
    );
  }

  public getVariables(): Record<string, JikiObject> {
    return this.environment.getAllVariables();
  }

  public error(type: RuntimeErrorType, location: Location, context?: any): never {
    throw new RuntimeError(`Runtime error: ${type}`, location, type, context);
  }
}
