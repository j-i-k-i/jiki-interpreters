import type { PyList } from "../../jikiObjects";
import { PyNumber, type JikiObject } from "../../jikiObjects";
import type { ExecutionContext } from "../../executor";
import type { Method } from "../index";
import { StdlibError } from "../index";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __len__: Method = {
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
};
