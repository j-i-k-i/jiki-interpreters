import type { PyString } from "../../jikiObjects";
import { PyString as PyStringClass, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";

export const upper: Method = {
  arity: 0,
  call: (_ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => {
    const str = obj as PyString;

    // Validate no arguments
    if (args.length !== 0) {
      throw new StdlibError("TypeError", `upper() takes no arguments (${args.length} given)`, {
        expected: 0,
        received: args.length,
      });
    }

    return new PyStringClass(str.value.toUpperCase());
  },
  description: "returns a string with all characters converted to uppercase",
};
