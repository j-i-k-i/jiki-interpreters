import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { AssignmentStatement } from "../statement";
import { SubscriptExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { PyList, PyNumber } from "../jikiObjects";
import type { Token } from "../token";

export function executeAssignmentStatement(executor: Executor, statement: AssignmentStatement): EvaluationResult {
  const value = executor.evaluate(statement.initializer);

  // Handle subscript assignment (e.g., list[0] = value)
  if (statement.target instanceof SubscriptExpression) {
    const subscript = statement.target;

    // Evaluate the object (should be a list)
    const objectResult = executor.evaluate(subscript.object);
    const object = objectResult.jikiObject;

    // Check that it's a list
    if (!(object instanceof PyList)) {
      const typeName = (object as any).pythonTypeName ? (object as any).pythonTypeName() : object.type;
      throw new RuntimeError(
        `TypeError: message: '${typeName}' object does not support item assignment`,
        subscript.location,
        "TypeError",
        { message: `'${typeName}' object does not support item assignment` }
      );
    }

    // Evaluate the index
    const indexResult = executor.evaluate(subscript.index);
    const index = indexResult.jikiObject;

    // Check that the index is a number
    if (!(index instanceof PyNumber)) {
      const typeName = (index as any).pythonTypeName ? (index as any).pythonTypeName() : index.type;
      throw new RuntimeError(
        `TypeError: message: list indices must be integers, not ${typeName}`,
        subscript.location,
        "TypeError",
        { message: `list indices must be integers, not ${typeName}` }
      );
    }

    // Check for non-integer indices
    if (!index.isInteger()) {
      throw new RuntimeError(
        `TypeError: message: list indices must be integers, not float`,
        subscript.location,
        "TypeError",
        { message: `list indices must be integers, not float` }
      );
    }

    let actualIndex = index.value;
    const listLength = object.length;

    // Handle negative indexing (Python feature)
    if (actualIndex < 0) {
      actualIndex = listLength + actualIndex;
    }

    // Check bounds - Python doesn't extend arrays, it raises IndexError
    if (actualIndex < 0 || actualIndex >= listLength) {
      throw new RuntimeError(`IndexError: index: ${index.value}`, subscript.location, "IndexError", {
        index: index.value,
      });
    }

    // Set the element
    object.setElement(actualIndex, value.jikiObject);

    return {
      type: "AssignmentStatement",
      target: subscript,
      index: indexResult,
      value: value,
      jikiObject: value.jikiObject,
      immutableJikiObject: value.jikiObject.clone(),
    } as any;
  }

  // Handle regular identifier assignment
  const target = statement.target as Token;
  executor.environment.define(target.lexeme, value.jikiObject);

  return {
    type: "AssignmentStatement",
    name: target.lexeme,
    value: value,
    jikiObject: value.jikiObject,
    immutableJikiObject: value.jikiObject.clone(),
  } as any;
}
