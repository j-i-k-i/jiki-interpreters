import { Environment } from "./environment";
import { SyntaxError } from "./error";
import type { Expression } from "./expression";
import { LiteralExpression, BinaryExpression, UnaryExpression, GroupingExpression } from "./expression";
import { Location } from "./location";
import type { Statement } from "./statement";
import { ExpressionStatement } from "./statement";
import type { EvaluationResult } from "./evaluation-result";
import { createJikiObject, type JikiObject } from "./jikiObjects";

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
      return this.evaluate(statement.expression);
    }

    return null;
  }

  public evaluate(expression: Expression): EvaluationResult {
    if (expression instanceof LiteralExpression) {
      return this.executeLiteralExpression(expression);
    }

    if (expression instanceof BinaryExpression) {
      return this.executeBinaryExpression(expression);
    }

    if (expression instanceof UnaryExpression) {
      return this.executeUnaryExpression(expression);
    }

    if (expression instanceof GroupingExpression) {
      return this.executeGroupingExpression(expression);
    }

    throw new RuntimeError(
      `Unsupported expression type: ${expression.type}`,
      expression.location,
      "UnsupportedOperation"
    );
  }

  private executeLiteralExpression(expression: LiteralExpression): EvaluationResult {
    const jikiObject = createJikiObject(expression.value);
    return {
      type: "LiteralExpression",
      jikiObject,
    };
  }

  private executeBinaryExpression(expression: BinaryExpression): EvaluationResult {
    const leftResult = this.evaluate(expression.left);
    const rightResult = this.evaluate(expression.right);

    const result = this.handleBinaryOperation(expression, leftResult, rightResult);

    return {
      type: "BinaryExpression",
      jikiObject: result,
    };
  }

  private executeUnaryExpression(expression: UnaryExpression): EvaluationResult {
    const operandResult = this.evaluate(expression.operand);

    const result = this.handleUnaryOperation(expression, operandResult);

    return {
      type: "UnaryExpression",
      jikiObject: result,
    };
  }

  private executeGroupingExpression(expression: GroupingExpression): EvaluationResult {
    return this.evaluate(expression.inner);
  }

  private handleBinaryOperation(
    expression: BinaryExpression,
    leftResult: EvaluationResult,
    rightResult: EvaluationResult
  ): JikiObject {
    const left = leftResult.jikiObject.value;
    const right = rightResult.jikiObject.value;

    switch (expression.operator.type) {
      case "PLUS":
        return createJikiObject(left + right);
      case "MINUS":
        return createJikiObject(left - right);
      case "STAR":
        return createJikiObject(left * right);
      case "SLASH":
        return createJikiObject(left / right);
      case "LOGICAL_AND":
        return createJikiObject(left && right);
      case "LOGICAL_OR":
        return createJikiObject(left || right);
      default:
        throw new RuntimeError(
          `Unsupported binary operator: ${expression.operator.type}`,
          expression.location,
          "InvalidBinaryExpression"
        );
    }
  }

  private handleUnaryOperation(expression: UnaryExpression, operandResult: EvaluationResult): JikiObject {
    const operand = operandResult.jikiObject.value;

    switch (expression.operator.type) {
      case "MINUS":
        return createJikiObject(-operand);
      case "PLUS":
        return createJikiObject(+operand);
      default:
        throw new RuntimeError(
          `Unsupported unary operator: ${expression.operator.type}`,
          expression.location,
          "InvalidUnaryExpression"
        );
    }
  }

  public getVariables(): Record<string, JikiObject> {
    return this.environment.getAllVariables();
  }

  public error(type: RuntimeErrorType, location: Location, context?: any): never {
    throw new RuntimeError(`Runtime error: ${type}`, location, type, context);
  }
}
