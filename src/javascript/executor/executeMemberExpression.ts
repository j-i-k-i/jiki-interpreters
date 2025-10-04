import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import type { EvaluationResult } from "../evaluation-result";
import {
  JSNumber,
  JSString,
  JSUndefined,
  JSFunction,
  type JSArray,
  type JSDictionary,
  type JikiObject,
} from "../jikiObjects";
import { stdlib, getStdlibType, StdlibError, isStdlibMemberAllowed } from "../stdlib";

// Type-specific handler for arrays
function executeArrayMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResult,
  array: JSArray
): EvaluationResultMemberExpression {
  // Check if this is a non-computed access (property/method access like arr.length)
  if (!expression.computed) {
    // For dot notation, delegate to stdlib resolution
    return executeStdlibMemberExpression(executor, expression, objectResult, array);
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
  const element = array.getElement(index);

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: element || new JSUndefined(),
    immutableJikiObject: element ? element.clone() : new JSUndefined(),
  };
}

// Type-specific handler for dictionaries
function executeDictionaryMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResult,
  dictionary: JSDictionary
): EvaluationResultMemberExpression {
  // For both computed and non-computed access, evaluate the property
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
  const value = dictionary.getProperty(key);

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: value || new JSUndefined(),
    immutableJikiObject: value ? value.clone() : new JSUndefined(),
  };
}

// Generic stdlib member resolution
function executeStdlibMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResult,
  object: JikiObject
): EvaluationResultMemberExpression {
  // Evaluate the property to get its name
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // Get the property name
  let propertyName: string;
  if (property instanceof JSString) {
    propertyName = property.value;
  } else {
    propertyName = property.toString();
  }

  // Check if this object type has stdlib members
  const stdlibType = getStdlibType(object);
  if (!stdlibType) {
    // For types that don't support property access at all, throw TypeError
    throw new RuntimeError(
      `TypeError: message: Cannot read properties of ${object.type}`,
      expression.location,
      "TypeError",
      { message: `Cannot read properties of ${object.type}` }
    );
  }

  // Check if it's a property
  const stdlibProperty = stdlib[stdlibType].properties[propertyName];
  if (stdlibProperty) {
    // Check if it's a stub (not yet implemented)
    if (stdlibProperty.isStub) {
      throw new RuntimeError(
        `MethodNotYetImplemented: method: ${propertyName}`,
        expression.location,
        "MethodNotYetImplemented",
        { method: propertyName }
      );
    }

    // Check feature flags
    if (!isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, false)) {
      throw new RuntimeError(
        `MethodNotYetAvailable: method: ${propertyName}`,
        expression.location,
        "MethodNotYetAvailable",
        { method: propertyName }
      );
    }

    try {
      const value = stdlibProperty.get(executor.getExecutionContext(), object);
      return {
        type: "MemberExpression",
        object: objectResult,
        property: propertyResult,
        jikiObject: value,
        immutableJikiObject: value.clone(),
      };
    } catch (error) {
      if (error instanceof StdlibError) {
        throw new RuntimeError(
          `${error.errorType}: message: ${error.message}`,
          expression.location,
          error.errorType as any,
          error.context
        );
      }
      throw error;
    }
  }

  // Check if it's a method
  const stdlibMethod = stdlib[stdlibType].methods[propertyName];
  if (stdlibMethod) {
    // Check if it's a stub (not yet implemented)
    if (stdlibMethod.isStub) {
      // For stub methods, we still return a function, but it will throw when called
      // This maintains the correct semantics where arr.push returns a function
    }

    // Check feature flags before creating the function wrapper
    if (!isStdlibMemberAllowed(executor.languageFeatures, stdlibType, propertyName, true)) {
      throw new RuntimeError(
        `MethodNotYetAvailable: method: ${propertyName}`,
        expression.location,
        "MethodNotYetAvailable",
        { method: propertyName }
      );
    }

    // Return a JSFunction that can be called
    const methodFunction = new JSFunction(
      propertyName,
      stdlibMethod.arity,
      (ctx, _thisObj, args) => {
        try {
          return stdlibMethod.call(ctx, object, args);
        } catch (error) {
          if (error instanceof StdlibError) {
            throw new RuntimeError(
              `${error.errorType}: message: ${error.message}`,
              expression.location,
              error.errorType as any,
              error.context
            );
          }
          throw error;
        }
      },
      stdlibMethod.description
    );

    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: methodFunction,
      immutableJikiObject: methodFunction.clone(),
    };
  }

  // Unknown property/method
  throw new RuntimeError(`PropertyNotFound: property: ${propertyName}`, expression.location, "PropertyNotFound", {
    property: propertyName,
  });
}

// Main entry point - dispatches to type-specific handlers
export function executeMemberExpression(
  executor: Executor,
  expression: MemberExpression
): EvaluationResultMemberExpression {
  // Evaluate the object
  const objectResult = executor.evaluate(expression.object);
  const object = objectResult.jikiObject;

  // Dispatch based on object type
  switch (object.type) {
    case "list":
      return executeArrayMemberExpression(executor, expression, objectResult, object as JSArray);

    case "dictionary":
      return executeDictionaryMemberExpression(executor, expression, objectResult, object as JSDictionary);

    default:
      // For all other types (string, number, etc.), check stdlib
      return executeStdlibMemberExpression(executor, expression, objectResult, object);
  }
}
