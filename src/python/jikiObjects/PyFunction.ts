import { JikiObject } from "../../shared/jikiObject";
import type { ExecutionContext } from "../executor";
import type { PyList } from "../jikiObjects";

// Represents a Python function/method that can be called
export class PyFunction extends JikiObject {
  constructor(
    public readonly name: string,
    public readonly arity: number | [number, number], // exact or [min, max]
    public readonly fn: (ctx: ExecutionContext, thisObj: PyList | null, args: JikiObject[]) => JikiObject,
    public readonly description: string
  ) {
    super("function");
  }

  public get value(): any {
    return this.fn;
  }

  public call(ctx: ExecutionContext, thisObj: PyList | null, args: JikiObject[]): JikiObject {
    return this.fn(ctx, thisObj, args);
  }

  public toString(): string {
    return `<function ${this.name}>`;
  }

  public clone(): PyFunction {
    // Functions are immutable, so return self
    return this;
  }

  public pythonTypeName(): string {
    return "function";
  }
}
