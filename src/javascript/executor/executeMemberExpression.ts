import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import { JSList, JSNumber, JSString, JSUndefined, JSDictionary, JSFunction, type JikiObject } from "../jikiObjects";
import { hasArrayProperty, hasArrayMethod, getArrayProperty, getArrayMethod } from "../stdlib/arrays";

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
    const value = object.getProperty(key);

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
    // Check if this is a non-computed access (property/method access)
    if (!expression.computed) {
      // For dot notation, property should be a literal with the property name
      const propertyResult = executor.evaluate(expression.property);
      const property = propertyResult.jikiObject;

      // Get the property name
      let propertyName: string;
      if (property instanceof JSString) {
        propertyName = property.value;
      } else {
        // This shouldn't happen with our parser, but just in case
        propertyName = property.toString();
      }

      // Check if it's a property
      if (hasArrayProperty(propertyName)) {
        const prop = getArrayProperty(propertyName)!;
        const value = prop.get(executor.getExecutionContext(), object);

        return {
          type: "MemberExpression",
          object: objectResult,
          property: propertyResult,
          jikiObject: value,
          immutableJikiObject: value.clone(),
        };
      }

      // Check if it's a method
      if (hasArrayMethod(propertyName)) {
        const method = getArrayMethod(propertyName)!;
        // Return a JSFunction that can be called
        const jsFunc = new JSFunction(
          method.name,
          method.arity,
          (ctx, _thisObj, args) => method.call(ctx, object, args),
          method.description
        );

        return {
          type: "MemberExpression",
          object: objectResult,
          property: propertyResult,
          jikiObject: jsFunc,
          immutableJikiObject: jsFunc.clone(),
        };
      }

      // Unknown property/method
      throw new RuntimeError(`PropertyNotFound: property: ${propertyName}`, expression.location, "PropertyNotFound", {
        property: propertyName,
      });
    }

    // For computed access (bracket notation) - array indexing
    const propertyResult = executor.evaluate(expression.property);
    const property = propertyResult.jikiObject;

    // Check that the property is a number
    if (!(property instanceof JSNumber)) {
      throw new RuntimeError(`TypeError: message: Array indices must be numbers`, expression.location, "TypeError", {
        message: "Array indices must be numbers",
      });
    }

    const index = property.value;

    // Check for negative indices (JavaScript doesn't support them natively)
    if (index < 0) {
      throw new RuntimeError(
        `IndexOutOfRange: index: ${index}: length: ${object.length}`,
        expression.location,
        "IndexOutOfRange",
        { index: index, length: object.length }
      );
    }

    // Check bounds - in JavaScript, reading out of bounds returns undefined
    if (index >= object.length) {
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
    const element = object.getElement(index);

    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: element || new JSUndefined(),
      immutableJikiObject: element ? element.clone() : new JSUndefined(),
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
