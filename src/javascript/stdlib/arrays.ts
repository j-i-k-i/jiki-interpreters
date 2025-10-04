import type { JSArray } from "../jsObjects";
import { JSNumber, JSUndefined, type JikiObject } from "../jsObjects";
import type { ExecutionContext } from "../executor";
import type { Property, Method } from "./index";
import { StdlibError, createNotYetImplementedStub } from "./index";

// Array properties
export const arrayProperties: Record<string, Property> = {
  length: {
    get: (_ctx: ExecutionContext, obj: JikiObject) => {
      const array = obj as JSArray;
      return new JSNumber(array.length);
    },
    description: "the number of elements in the array",
  },
};

// List of array methods that are not yet implemented
const notYetImplementedMethods = [
  // Mutating methods
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
  "fill",
  "copyWithin",

  // Accessor methods
  "indexOf",
  "lastIndexOf",
  "includes",
  "slice",
  "concat",
  "join",
  "toString",
  "toLocaleString",
  "entries",
  "keys",
  "values",

  // Iteration methods
  "forEach",
  "map",
  "filter",
  "reduce",
  "reduceRight",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "every",
  "some",
  "flat",
  "flatMap",

  // ES2023 methods
  "toReversed",
  "toSorted",
  "toSpliced",
  "with",
];

// Array methods
export const arrayMethods: Record<string, Method> = {
  // Implemented methods
  at: {
    arity: 1,
    call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
      const array = obj as JSArray;
      // Validate we have exactly one argument
      if (args.length !== 1) {
        throw new StdlibError("ArgumentError", `at() expects exactly 1 argument, got ${args.length}`, {
          expected: 1,
          received: args.length,
        });
      }

      const indexArg = args[0];

      // Check that the argument is a number
      if (!(indexArg instanceof JSNumber)) {
        throw new StdlibError("TypeError", `at() expects a number argument`, {
          expectedType: "number",
          receivedType: indexArg.type,
        });
      }

      let index = indexArg.value;

      // Check for non-integer indices
      if (!Number.isInteger(index)) {
        throw new StdlibError("TypeError", `at() expects an integer index`, { index });
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

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
