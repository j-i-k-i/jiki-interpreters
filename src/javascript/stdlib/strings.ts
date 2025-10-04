import { JSString, JSNumber, type JikiObject } from "../jsObjects";
import type { ExecutionContext } from "../executor";
import type { Property, Method } from "./index";
import { StdlibError, createNotYetImplementedStub } from "./index";

// String properties
export const stringProperties: Record<string, Property> = {
  length: {
    get: (_ctx: ExecutionContext, obj: JikiObject) => {
      const string = obj as JSString;
      return new JSNumber(string.value.length);
    },
    description: "the number of characters in the string",
  },
};

// List of string methods that are not yet implemented
const notYetImplementedMethods = [
  // Accessor methods
  "charCodeAt",
  "codePointAt",
  "indexOf",
  "lastIndexOf",
  "includes",
  "startsWith",
  "endsWith",
  "slice",
  "substring",
  "substr",
  "concat",
  "split",
  "match",
  "search",
  "replace",
  "replaceAll",

  // Case methods
  "toLowerCase",
  "toUpperCase",
  "toLocaleLowerCase",
  "toLocaleUpperCase",

  // Trim methods
  "trim",
  "trimStart",
  "trimEnd",
  "trimLeft",
  "trimRight",

  // Padding methods
  "padStart",
  "padEnd",

  // Other methods
  "repeat",
  "normalize",
  "localeCompare",
  "toString",
  "valueOf",
];

// String methods
export const stringMethods: Record<string, Method> = {
  // Implemented methods
  charAt: {
    arity: 1,
    call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
      const string = obj as JSString;
      const indexArg = args[0];

      // Check that the argument is a number
      if (!(indexArg instanceof JSNumber)) {
        throw new StdlibError("TypeError", `charAt() expects a number argument`, {
          expectedType: "number",
          receivedType: indexArg.type,
        });
      }

      let index = indexArg.value;

      // Check for non-integer indices
      if (!Number.isInteger(index)) {
        throw new StdlibError("TypeError", `charAt() expects an integer index`, { index });
      }

      // Handle negative indices (Python-style, for consistency with array.at)
      if (index < 0) {
        index = string.value.length + index;
      }

      // Check bounds - charAt returns empty string for out of bounds
      if (index < 0 || index >= string.value.length) {
        return new JSString("");
      }

      // Get the character
      return new JSString(string.value[index]);
    },
    description: "returns the character at the specified index",
  },

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
