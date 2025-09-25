import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import { JSArray, JSNumber, JSString, JSUndefined, JSDictionary, JSFunction, type JikiObject } from "../jikiObjects";
import { stdlib, getStdlibType, StdlibError, type Property, type Method } from "../stdlib";

// Generic function to use a property from stdlib
function useProperty(obj: JikiObject, propertyName: string, executor: Executor, location: any): JikiObject | null {
  const stdlibType = getStdlibType(obj);
  if (!stdlibType) {return null;}

  const property = stdlib[stdlibType]?.properties?.[propertyName];
  if (!property) {return null;}

  try {
    return property.get(executor.getExecutionContext(), obj);
  } catch (error) {
    if (error instanceof StdlibError) {
      throw new RuntimeError(
        `${error.errorType}: message: ${error.message}`,
        location,
        error.errorType as any,
        error.context
      );
    }
    throw error;
  }
}

// Generic function to use a method from stdlib
function useMethod(obj: JikiObject, methodName: string, executor: Executor, location: any): JSFunction | null {
  const stdlibType = getStdlibType(obj);
  if (!stdlibType) {return null;}

  const method = stdlib[stdlibType]?.methods?.[methodName];
  if (!method) {return null;}

  // Return a JSFunction that can be called
  // The error handling will happen when the function is actually called
  return new JSFunction(
    methodName,
    method.arity,
    (ctx, _thisObj, args) => {
      try {
        return method.call(ctx, obj, args);
      } catch (error) {
        if (error instanceof StdlibError) {
          throw new RuntimeError(
            `${error.errorType}: message: ${error.message}`,
            location,
            error.errorType as any,
            error.context
          );
        }
        throw error;
      }
    },
    method.description
  );
}

// Generic function to resolve a property or method from stdlib
function resolveStdlibMember(
  object: JikiObject,
  propertyName: string,
  executor: Executor,
  expression: MemberExpression,
  objectResult: any,
  propertyResult: any
): EvaluationResultMemberExpression {
  // Check if it's a property
  const propertyValue = useProperty(object, propertyName, executor, expression.location);
  if (propertyValue) {
    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: propertyValue,
      immutableJikiObject: propertyValue.clone(),
    };
  }

  // Check if it's a method
  const methodValue = useMethod(object, propertyName, executor, expression.location);
  if (methodValue) {
    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: methodValue,
      immutableJikiObject: methodValue.clone(),
    };
  }

  // Unknown property/method
  throw new RuntimeError(`PropertyNotFound: property: ${propertyName}`, expression.location, "PropertyNotFound", {
    property: propertyName,
  });
}

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

  // For arrays
  if (object instanceof JSArray) {
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

      // Resolve property or method from stdlib
      return resolveStdlibMember(object, propertyName, executor, expression, objectResult, propertyResult);
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
