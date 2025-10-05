import type { JSArray, JikiObject } from "../../jsObjects";
import type { JSNumber } from "../../jsObjects";
import { JSUndefined } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { guardExactArgs, guardArgType } from "../guards";

export const at: Method = {
  arity: 1,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const array = obj as JSArray;

    // Validate exactly one argument
    guardExactArgs(args, 1, "at");

    // Validate argument is a number
    guardArgType(args[0], "number", "at", "index");
    const indexArg = args[0] as JSNumber;

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
