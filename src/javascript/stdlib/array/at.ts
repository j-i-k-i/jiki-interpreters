import type { JSArray } from "../../jsObjects";
import { JSNumber, JSUndefined, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";

export const at: Method = {
  arity: 1,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate exactly one argument
    if (args.length !== 1) {
      throw new StdlibError("InvalidNumberOfArguments", `at() takes exactly 1 argument (${args.length} given)`, {
        expected: 1,
        received: args.length,
      });
    }

    const indexArg = args[0];
    if (!(indexArg instanceof JSNumber)) {
      throw new StdlibError("TypeError", "Index must be a number", {
        type: indexArg.type,
      });
    }

    let index = Math.trunc(indexArg.value); // Convert to integer

    // Handle negative indices (count from end)
    if (index < 0) {
      index = array.length + index;
    }

    // Check bounds
    if (index < 0 || index >= array.length) {
      return new JSUndefined();
    }

    const element = array.getElement(index);
    return element || new JSUndefined();
  },
  description: "returns the element at the specified index, supporting negative indices",
};
