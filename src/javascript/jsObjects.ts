// JavaScript objects system extending shared base
import { JikiObject } from "../shared/jikiObject";
export { JikiObject } from "../shared/jikiObject";

export class JSNumber extends JikiObject {
  constructor(public readonly _value: number) {
    super("number");
  }

  public get value(): number {
    return this._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}

export class JSString extends JikiObject {
  constructor(public readonly _value: string) {
    super("string");
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }
}

export class JSBoolean extends JikiObject {
  constructor(public readonly _value: boolean) {
    super("boolean");
  }

  public get value(): boolean {
    return this._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}

// Helper function to create JSObjects from JavaScript values
export function createJSObject(value: any): JikiObject {
  if (typeof value === "number") {
    return new JSNumber(value);
  } else if (typeof value === "string") {
    return new JSString(value);
  } else if (typeof value === "boolean") {
    return new JSBoolean(value);
  } else {
    throw new Error(`Cannot create JSObject for value: ${value}`);
  }
}

// Helper function to unwrap JSObjects to JavaScript values
export function unwrapJSObject(obj: JikiObject | any): any {
  if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
