import { Environment } from "./environment";
import { SyntaxError } from "../jikiscript/error";
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
import { ExpressionStatement, AssignmentStatement, PrintStatement } from "./statement";
import type { EvaluationResult } from "./evaluation-result";
import { createPyObject, type JikiObject } from "./pyObjects";

// Import individual executors
import { executeLiteralExpression } from "./executor/executeLiteralExpression";
import { executeExpressionStatement } from "./executor/executeExpressionStatement";
import { executeBinaryExpression } from "./executor/executeBinaryExpression";
import { executeUnaryExpression } from "./executor/executeUnaryExpression";
import { executeGroupingExpression } from "./executor/executeGroupingExpression";
import { executeIdentifierExpression } from "./executor/executeIdentifierExpression";
import { executeAssignmentStatement } from "./executor/executeAssignmentStatement";

export type RuntimeErrorType =
  | "InvalidBinaryExpression"
  | "InvalidUnaryExpression"
  | "UnsupportedOperation"
  | "UndefinedVariable";

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
      return executeExpressionStatement(this, statement);
    }

    if (statement instanceof AssignmentStatement) {
      return executeAssignmentStatement(this, statement);
    }

    // TODO: Add other statement types as needed
    // if (statement instanceof PrintStatement) {
    //   return executePrintStatement(this, statement);
    // }

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

    throw new RuntimeError(`Unknown expression type: ${expression.type}`, expression.location, "UnsupportedOperation");
  }
}
