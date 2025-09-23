import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import { JSList, JSNumber, type JikiObject } from "../jikiObjects";

export function executeMemberExpression(
  executor: Executor,
  expression: MemberExpression
): EvaluationResultMemberExpression {
  // Evaluate the object (should be an array for now)
  const objectResult = executor.evaluate(expression.object);
  const object = objectResult.jikiObject;

  // Evaluate the property (index)
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // For now, we only support array indexing
  if (!(object instanceof JSList)) {
    throw new RuntimeError(
      `TypeError: message: Cannot read properties of non-array`,
      expression.location,
      "TypeError",
      { message: "Cannot read properties of non-array" }
    );
  }

  // Check that the property is a number
  if (!(property instanceof JSNumber)) {
    throw new RuntimeError(`TypeError: message: Array indices must be numbers`, expression.location, "TypeError", {
      message: "Array indices must be numbers",
    });
  }

  const index = property.value;
  const array = object.value; // This is JikiObject[]

  // Check for negative indices (JavaScript doesn't support them natively)
  if (index < 0) {
    throw new RuntimeError(
      `IndexOutOfRange: index: ${index}: length: ${array.length}`,
      expression.location,
      "IndexOutOfRange",
      { index: index, length: array.length }
    );
  }

  // Check bounds
  if (index >= array.length) {
    throw new RuntimeError(
      `IndexOutOfRange: index: ${index}: length: ${array.length}`,
      expression.location,
      "IndexOutOfRange",
      { index: index, length: array.length }
    );
  }

  // Check for non-integer indices
  if (!Number.isInteger(index)) {
    throw new RuntimeError(`TypeError: message: Array indices must be integers`, expression.location, "TypeError", {
      message: "Array indices must be integers",
    });
  }

  // Get the element
  const element = array[index];

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: element,
    immutableJikiObject: element.clone(),
  };
}
