import type { Executor } from "../executor";
import { MemberExpression } from "../expression";
import type { AssignmentExpression } from "../expression";
import type { EvaluationResultAssignmentExpression } from "../evaluation-result";
import { JSList, JSUndefined } from "../jikiObjects";
import type { Token } from "../token";

export function executeAssignmentExpression(
  executor: Executor,
  expression: AssignmentExpression
): EvaluationResultAssignmentExpression {
  const valueResult = executor.evaluate(expression.value);

  // Handle member expression assignment (e.g., arr[0] = value)
  if (expression.target instanceof MemberExpression) {
    const memberExpr = expression.target;

    // Evaluate the object (which could be a nested MemberExpression)
    const objectResult = executor.evaluate(memberExpr.object);

    // Check if it's an array
    if (!(objectResult.jikiObject instanceof JSList)) {
      executor.error("TypeError", memberExpr.object.location, {
        message: "Cannot set property of non-array",
      });
    }

    const array = objectResult.jikiObject as JSList;

    // Evaluate the index
    const indexResult = executor.evaluate(memberExpr.property);

    // Check if index is a number
    if (typeof indexResult.jikiObject.value !== "number") {
      executor.error("TypeError", memberExpr.property.location, {
        message: "Array index must be a number",
      });
    }

    const index = indexResult.jikiObject.value as number;

    // Check if index is an integer
    if (!Number.isInteger(index)) {
      executor.error("TypeError", memberExpr.property.location, {
        message: "Array index must be an integer",
      });
    }

    // Handle negative indices - in JavaScript, they don't wrap around, they extend the array
    if (index < 0) {
      // In JavaScript, arr[-1] = value sets a property "-1", not the last element
      // For now, we'll throw an error to match our educational goals
      executor.error("IndexOutOfRange", memberExpr.property.location, {
        index: index,
        length: array.value.length,
      });
    }

    // Extend array if necessary (JavaScript behavior)
    // Just set the element at the index - JavaScript will handle sparse arrays
    // No need to fill with undefined values
    array.value[index] = valueResult.jikiObject;

    return {
      type: "AssignmentExpression",
      name: `[${index}]`,
      value: valueResult,
      jikiObject: valueResult.jikiObject,
      immutableJikiObject: valueResult.jikiObject.clone(),
    };
  }

  // Handle regular identifier assignment
  const target = expression.target as Token;
  const success = executor.environment.update(target.lexeme, valueResult.jikiObject);

  if (!success) {
    executor.error("VariableNotDeclared", target.location, {
      name: target.lexeme,
    });
  }

  return {
    type: "AssignmentExpression",
    name: target.lexeme,
    value: valueResult,
    jikiObject: valueResult.jikiObject,
    immutableJikiObject: valueResult.jikiObject.clone(),
  };
}
