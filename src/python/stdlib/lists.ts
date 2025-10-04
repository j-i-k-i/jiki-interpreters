import type { PyList } from "../jikiObjects";
import { PyNumber, type JikiObject } from "../jikiObjects";
import type { ExecutionContext } from "../executor";
import type { Property, Method } from "./index";
import { StdlibError, createNotYetImplementedStub } from "./index";

// List properties
export const listProperties: Record<string, Property> = {
  // Python lists don't have properties in the traditional sense
  // All attributes are methods
};

// List of list methods that are not yet implemented
const notYetImplementedMethods = [
  // Mutating methods
  "append",
  "extend",
  "insert",
  "remove",
  "pop",
  "clear",
  "sort",
  "reverse",

  // Accessor methods
  "index",
  "count",
  "copy",

  // Python-specific methods
  "__contains__",
  "__iter__",
  "__reversed__",
  "__add__",
  "__mul__",
  "__rmul__",
  "__iadd__",
  "__imul__",
];

// List methods
export const listMethods: Record<string, Method> = {
  // Python's len() is typically a built-in function, but we can provide it as a method too
  __len__: {
    arity: 0,
    call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
      const list = obj as PyList;

      // Validate no arguments
      if (args.length !== 0) {
        throw new StdlibError("TypeError", `__len__() takes no arguments (${args.length} given)`, {
          expected: 0,
          received: args.length,
        });
      }

      return new PyNumber(list.length);
    },
    description: "returns the number of elements in the list",
  },

  // Generate stub methods for all not-yet-implemented methods
  ...Object.fromEntries(notYetImplementedMethods.map(name => [name, createNotYetImplementedStub(name)])),
};
