import type { PyList } from "../../jikiObjects";
import { PyNumber, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";

// Named 'index_method' to avoid conflict with index.ts aggregator file
export const index: Method = {
  arity: [1, 3], // value required, start and end optional
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const list = obj as PyList;

    // Validate argument count (1-3 arguments)
    if (args.length < 1 || args.length > 3) {
      throw new StdlibError(
        "TypeError",
        `index() takes from 1 to 3 positional arguments but ${args.length} were given`,
        {
          expected: "1-3",
          received: args.length,
        }
      );
    }

    const searchValue = args[0];
    let start = 0;
    let end = list.length;

    // Handle optional start parameter
    if (args.length >= 2) {
      const startArg = args[1];
      if (!(startArg instanceof PyNumber)) {
        throw new StdlibError("TypeError", "'int' object cannot be interpreted as an integer", {
          argument: "start",
          type: startArg.type,
        });
      }
      start = Math.max(0, startArg.value);
    }

    // Handle optional end parameter
    if (args.length >= 3) {
      const endArg = args[2];
      if (!(endArg instanceof PyNumber)) {
        throw new StdlibError("TypeError", "'int' object cannot be interpreted as an integer", {
          argument: "end",
          type: endArg.type,
        });
      }
      end = Math.min(list.length, endArg.value);
    }

    // Search for the value in the specified range
    for (let i = start; i < end; i++) {
      const element = list.getElement(i);
      if (!element) {
        continue;
      }

      // In Python, index() uses equality comparison (==)
      // For now, we'll do simple value comparison
      if (element.type === searchValue.type && element.value === searchValue.value) {
        return new PyNumber(i);
      }
    }

    // Value not found - raise ValueError
    throw new StdlibError("TypeError", `${searchValue.toString()} is not in list`, {
      value: searchValue.toString(),
    });
  },
  description: "returns the index of the first occurrence of a value in the list",
};
