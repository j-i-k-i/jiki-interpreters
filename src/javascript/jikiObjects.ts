// Simplified JavaScript objects system based on JikiScript
export abstract class JikiObject {
  public readonly objectId: string;
  constructor(public readonly type: string) {
    this.objectId = Math.random().toString(36).substring(7);
  }

  public abstract get value(): any;
  public abstract toString(): string;
}

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

// Helper function to create JikiObjects from JavaScript values
export function createJikiObject(value: any): JikiObject {
  if (typeof value === "number") {
    return new JSNumber(value);
  } else if (typeof value === "string") {
    return new JSString(value);
  } else if (typeof value === "boolean") {
    return new JSBoolean(value);
  } else {
    throw new Error(`Cannot create JikiObject for value: ${value}`);
  }
}

// Helper function to unwrap JikiObjects to JavaScript values
export function unwrapJikiObject(obj: JikiObject | any): any {
  if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
