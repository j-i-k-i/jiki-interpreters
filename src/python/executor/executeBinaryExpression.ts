import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createPyObject, type JikiObject, PyBoolean } from "../jikiObjects";
import { RuntimeError } from "../executor";

export function executeBinaryExpression(executor: Executor, expression: BinaryExpression): EvaluationResult {
  const leftResult = executor.evaluate(expression.left);

  // For logical operators, we need to check truthiness before evaluating the right side
  // This also implements short-circuit evaluation
  if (expression.operator.type === "AND" || expression.operator.type === "OR") {
    return handleLogicalOperation(executor, expression, leftResult);
  }

  const rightResult = executor.evaluate(expression.right);

  const result = handleBinaryOperation(executor, expression, leftResult, rightResult);

  return {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: result,
  } as any;
}

function handleBinaryOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResult,
  rightResult: EvaluationResult
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;

  switch (expression.operator.type) {
    // Arithmetic operations
    case "PLUS":
      return createPyObject(left + right);
    case "MINUS":
      return createPyObject(left - right);
    case "STAR":
      return createPyObject(left * right);
    case "SLASH":
      return createPyObject(left / right);
    case "DOUBLE_SLASH":
      // Floor division in Python
      return createPyObject(Math.floor(left / right));
    case "PERCENT":
      return createPyObject(left % right);
    case "DOUBLE_STAR":
      // Power operator in Python
      return createPyObject(Math.pow(left, right));

    // Comparison operations
    case "GREATER":
      return new PyBoolean(left > right);
    case "GREATER_EQUAL":
      return new PyBoolean(left >= right);
    case "LESS":
      return new PyBoolean(left < right);
    case "LESS_EQUAL":
      return new PyBoolean(left <= right);
    case "EQUAL_EQUAL":
      return new PyBoolean(left === right);
    case "NOT_EQUAL":
      return new PyBoolean(left !== right);

    default:
      throw new RuntimeError(
        `Unsupported binary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidBinaryExpression"
      );
  }
}

// Python truthiness rules (same as in executeUnaryExpression)
function isTruthy(obj: JikiObject): boolean {
  const value = obj.value;
  const type = obj.type;

  // Python falsy values: False, None, 0, 0.0, "", [], {}, set()
  if (type === "boolean") return value as boolean;
  if (type === "none") return false;
  if (type === "number") return value !== 0;
  if (type === "string") return (value as string).length > 0;

  // For now, we'll treat any other type as truthy
  // This will be expanded when we add lists, dicts, etc.
  return true;
}

function handleLogicalOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResult
): EvaluationResult {
  const leftObject = leftResult.jikiObject;

  // Check if truthiness is disabled for non-boolean values
  if (!executor.languageFeatures.allowTruthiness && leftObject.type !== "boolean") {
    throw new RuntimeError(
      `TruthinessDisabled: value: ${leftObject.type}`,
      expression.left.location,
      "TruthinessDisabled"
    );
  }

  const leftTruthy = isTruthy(leftObject);

  if (expression.operator.type === "AND") {
    // Python's 'and' operator returns the first falsy value or the last value
    if (!leftTruthy) {
      // Short-circuit: return left value if it's falsy
      return {
        type: "BinaryExpression",
        left: leftResult,
        right: null,
        jikiObject: leftObject,
      } as any;
    }

    // Evaluate the right side
    const rightResult = executor.evaluate(expression.right);
    const rightObject = rightResult.jikiObject;

    // Check truthiness for the right operand
    if (!executor.languageFeatures.allowTruthiness && rightObject.type !== "boolean") {
      throw new RuntimeError(
        `TruthinessDisabled: value: ${rightObject.type}`,
        expression.right.location,
        "TruthinessDisabled"
      );
    }

    // Return the right value (Python semantics)
    return {
      type: "BinaryExpression",
      left: leftResult,
      right: rightResult,
      jikiObject: rightObject,
    } as any;
  } else {
    // OR
    // Python's 'or' operator returns the first truthy value or the last value
    if (leftTruthy) {
      // Short-circuit: return left value if it's truthy
      return {
        type: "BinaryExpression",
        left: leftResult,
        right: null,
        jikiObject: leftObject,
      } as any;
    }

    // Evaluate the right side
    const rightResult = executor.evaluate(expression.right);
    const rightObject = rightResult.jikiObject;

    // Check truthiness for the right operand
    if (!executor.languageFeatures.allowTruthiness && rightObject.type !== "boolean") {
      throw new RuntimeError(
        `TruthinessDisabled: value: ${rightObject.type}`,
        expression.right.location,
        "TruthinessDisabled"
      );
    }

    // Return the right value (Python semantics)
    return {
      type: "BinaryExpression",
      left: leftResult,
      right: rightResult,
      jikiObject: rightObject,
    } as any;
  }
}
