import { JSNumber, JSUndefined, JSArray, type JikiObject } from "../jsObjects";
import type { ExecutionContext } from "../executor";
import type { Property, Method } from "./index";

// Array properties
export const arrayProperties: Record<string, Property> = {
  length: {
    name: "length",
    get: (_ctx: ExecutionContext, obj: JikiObject) => {
      const array = obj as JSArray;
      return new JSNumber(array.length);
    },
    description: "the number of elements in the array",
  },
};

// Array methods
export const arrayMethods: Record<string, Method> = {
  at: {
    name: "at",
    arity: 1,
    call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
      const array = obj as JSArray;
      // Validate we have exactly one argument
      if (args.length !== 1) {
        throw new Error(`at() expects exactly 1 argument, got ${args.length}`);
      }

      const indexArg = args[0];

      // Check that the argument is a number
      if (!(indexArg instanceof JSNumber)) {
        throw new Error(`at() expects a number argument`);
      }

      let index = indexArg.value;

      // Check for non-integer indices
      if (!Number.isInteger(index)) {
        throw new Error(`at() expects an integer index`);
      }

      // Handle negative indices (Python-style)
      if (index < 0) {
        index = array.length + index;
      }

      // Check bounds
      if (index < 0 || index >= array.length) {
        return new JSUndefined();
      }

      // Get the element
      const element = array.getElement(index);
      return element || new JSUndefined();
    },
    description: "returns the element at the specified index",
  },
};
