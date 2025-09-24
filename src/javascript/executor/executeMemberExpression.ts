import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import { JSList, JSNumber, JSString, JSUndefined, JSDictionary, type JikiObject } from "../jikiObjects";

export function executeMemberExpression(
  executor: Executor,
  expression: MemberExpression
): EvaluationResultMemberExpression {
  // Evaluate the object
  const objectResult = executor.evaluate(expression.object);
  const object = objectResult.jikiObject;

  // For dictionaries (objects)
  if (object instanceof JSDictionary) {
    // For computed access (bracket notation), evaluate the property expression
    // For non-computed access (dot notation), the property is already a string literal
    const propertyResult = executor.evaluate(expression.property);
    const property = propertyResult.jikiObject;

    // Convert property to string key
    let key: string;
    if (property instanceof JSString) {
      key = property.value;
    } else if (property instanceof JSNumber) {
      key = property.value.toString();
    } else {
      // In JavaScript, any value can be used as a property key and will be converted to string
      key = property.toString();
    }

    // Get the value from the dictionary
    const value = object._value.get(key);

    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: value || new JSUndefined(),
      immutableJikiObject: value ? value.clone() : new JSUndefined(),
    };
  }

  // For arrays (lists)
  if (object instanceof JSList) {
    // Evaluate the property (index)
    const propertyResult = executor.evaluate(expression.property);
    const property = propertyResult.jikiObject;

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

    // Check bounds - in JavaScript, reading out of bounds returns undefined
    if (index >= array.length) {
      return {
        type: "MemberExpression",
        object: objectResult,
        property: propertyResult,
        jikiObject: new JSUndefined(),
        immutableJikiObject: new JSUndefined(),
      };
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

  // For other types, throw an error
  throw new RuntimeError(
    `TypeError: message: Cannot read properties of ${object.type}`,
    expression.location,
    "TypeError",
    { message: `Cannot read properties of ${object.type}` }
  );
}
