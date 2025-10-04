import type { JSString } from "../../jsObjects";
import { JSString as JSStringClass, type JikiObject } from "../../jsObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";

export const toLowerCase: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as JSString;

    // Validate no arguments
    if (args.length !== 0) {
      throw new StdlibError("InvalidNumberOfArguments", `toLowerCase() takes no arguments (${args.length} given)`, {
        expected: 0,
        received: args.length,
      });
    }

    return new JSStringClass(str.value.toLowerCase());
  },
  description: "returns a string with all characters converted to lowercase",
};
