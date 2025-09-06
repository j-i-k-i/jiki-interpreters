import { Environment } from "./environment";
import { SyntaxError } from "./error";
import type { Expression } from "./expression";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
} from "./expression";
import { Location } from "./location";
import type { Statement } from "./statement";
import { ExpressionStatement, VariableDeclaration, BlockStatement } from "./statement";
import type { EvaluationResult } from "./evaluation-result";
import { createJSObject, type JikiObject } from "./jsObjects";

// Import individual executors
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeIdentifierExpression } from "./executor/executeIdentifierExpression";
import { executeBlockStatement } from "./executor/executeBlockStatement";

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
  public environment: Environment;

  constructor() {
    this.environment = new Environment();
  }

  public executeStatement(statement: Statement): EvaluationResult | null {
    if (statement instanceof ExpressionStatement) {
      const expressionResult = this.evaluate(statement.expression);
      return {
        type: "ExpressionStatement",
        expression: expressionResult,
        jikiObject: expressionResult.jsObject,
        jsObject: expressionResult.jsObject,
      } as any;
    }

    if (statement instanceof VariableDeclaration) {
      const value = this.evaluate(statement.initializer);
      this.environment.define(statement.name.lexeme, value.jikiObject);
      return {
        type: "VariableDeclaration",
        name: statement.name.lexeme,
        value: value,
        jikiObject: value.jikiObject,
        jsObject: value.jsObject,
      } as any;
    }

    if (statement instanceof BlockStatement) {
      executeBlockStatement(this, statement);
      return {
        type: "BlockStatement",
        statements: statement.statements,
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

    if (expression instanceof IdentifierExpression) {
      return executeIdentifierExpression(this, expression);
    }

    throw new RuntimeError(
      `Unsupported expression type: ${expression.type}`,
      expression.location,
      "UnsupportedOperation"
    );
  }

  public executeBlock(statements: Statement[], environment: Environment): void {
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

  public getVariables(): Record<string, JikiObject> {
    return this.environment.getAllVariables();
  }

  public error(type: RuntimeErrorType, location: Location, context?: any): never {
    throw new RuntimeError(`Runtime error: ${type}`, location, type, context);
  }
}
