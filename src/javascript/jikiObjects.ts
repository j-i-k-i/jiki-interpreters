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

  public clone(): JSNumber {
    // Numbers are immutable, so return self
    return this;
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

  public clone(): JSString {
    // Strings are immutable, so return self
    return this;
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

  public clone(): JSBoolean {
    // Booleans are immutable, so return self
    return this;
  }
}

export class JSNull extends JikiObject {
  constructor() {
    super("null");
  }

  public get value(): null {
    return null;
  }

  public toString(): string {
    return "null";
  }

  public clone(): JSNull {
    // Null is immutable, so return self
    return this;
  }
}

export class JSUndefined extends JikiObject {
  constructor() {
    super("undefined");
  }

  public get value(): undefined {
    return undefined;
  }

  public toString(): string {
    return "undefined";
  }

  public clone(): JSUndefined {
    // Undefined is immutable, so return self
    return this;
  }
}

export class JSList extends JikiObject {
  constructor(public readonly _elements: JikiObject[]) {
    super("list");
  }

  public get value(): JikiObject[] {
    return this._elements;
  }

  public toString(): string {
    if (this._elements.length === 0) {
      return "[]";
    }
    return `[ ${this._elements
      .map(elem => {
        // Add quotes around strings for consistency with JikiScript
        if (elem instanceof JSString) {
          return JSON.stringify(elem.value);
        }
        return elem.toString();
      })
      .join(", ")} ]`;
  }

  public clone(): JSList {
    // Deep clone - recursively clone all elements
    return new JSList(this._elements.map(elem => elem.clone()));
  }
}

// Helper function to create JSObjects from JavaScript values
export function createJSObject(value: any): JikiObject {
  if (value === null) {
    return new JSNull();
  } else if (value === undefined) {
    return new JSUndefined();
  } else if (typeof value === "number") {
    return new JSNumber(value);
  } else if (typeof value === "string") {
    return new JSString(value);
  } else if (typeof value === "boolean") {
    return new JSBoolean(value);
  } else if (Array.isArray(value)) {
    return new JSList(value.map(elem => createJSObject(elem)));
  } else {
    throw new Error(`Cannot create JSObject for value: ${value}`);
  }
}

// Helper function to unwrap JSObjects to JavaScript values
export function unwrapJSObject(obj: JikiObject | any): any {
  if (obj instanceof JSList) {
    return obj.value.map(elem => unwrapJSObject(elem));
  } else if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
