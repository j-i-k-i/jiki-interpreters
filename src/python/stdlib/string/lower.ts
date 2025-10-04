import type { PyString } from "../../jikiObjects";
import { PyString as PyStringClass, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";

export const lower: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as PyString;

    // Validate no arguments
    if (args.length !== 0) {
      throw new StdlibError("TypeError", `lower() takes no arguments (${args.length} given)`, {
        expected: 0,
        received: args.length,
      });
    }

    return new PyStringClass(str.value.toLowerCase());
  },
  description: "returns a string with all characters converted to lowercase",
};
