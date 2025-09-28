import type { Arity, ExecutionContext } from "../shared/interfaces";
import { JikiObject } from "./jikiObjects";

export interface Callable {
  arity: Arity | undefined;
  call: (context: ExecutionContext, args: any[]) => any;
}

export function isCallable(obj: any): obj is Callable {
  return obj instanceof Object && "call" in obj;
}

export class JSCallable extends JikiObject {
  constructor(
    public readonly name: string,
    public readonly arity: Arity | undefined,
    private readonly func: Function
  ) {
    super("callable");
  }

  get value(): Function {
    return this.func;
  }

  call(context: ExecutionContext, args: any[]): any {
    return this.func(context, ...args);
  }

  clone(): JSCallable {
    return new JSCallable(this.name, this.arity, this.func);
  }

  toString(): string {
    return `function ${this.name}() { [native code] }`;
  }
}
