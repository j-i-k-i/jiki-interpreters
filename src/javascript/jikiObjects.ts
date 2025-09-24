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

    // Handle sparse arrays - map over indices to show undefined for missing elements
    const elements: string[] = [];
    for (let i = 0; i < this._elements.length; i++) {
      const elem = this._elements[i];
      if (elem === undefined) {
        elements.push("undefined");
      } else if (elem instanceof JSString) {
        elements.push(JSON.stringify(elem.value));
      } else {
        elements.push(elem.toString());
      }
    }

    return `[ ${elements.join(", ")} ]`;
  }

  public clone(): JSList {
    // Deep clone - handle sparse arrays correctly
    const clonedElements: JikiObject[] = [];
    for (let i = 0; i < this._elements.length; i++) {
      if (i in this._elements) {
        clonedElements[i] = this._elements[i].clone();
      }
    }
    return new JSList(clonedElements);
  }
}

export class JSDictionary extends JikiObject {
  constructor(public readonly _value: Map<string, JikiObject>) {
    super("dictionary");
  }

  public get value(): Map<string, JikiObject> {
    return this._value;
  }

  public toString(): string {
    if (this._value.size === 0) {
      return "{}";
    }

    const entries: string[] = [];
    for (const [key, value] of this._value.entries()) {
      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      const valueStr = value instanceof JSString ? JSON.stringify(value.value) : value.toString();
      entries.push(`${keyStr}: ${valueStr}`);
    }

    return `{ ${entries.join(", ")} }`;
  }

  public clone(): JSDictionary {
    // Deep clone - recursively clone all values
    const clonedMap = new Map<string, JikiObject>();
    for (const [key, value] of this._value.entries()) {
      clonedMap.set(key, value.clone());
    }
    return new JSDictionary(clonedMap);
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
  } else if (typeof value === "object" && value !== null) {
    const map = new Map<string, JikiObject>();
    for (const [key, val] of Object.entries(value)) {
      map.set(key, createJSObject(val));
    }
    return new JSDictionary(map);
  } else {
    throw new Error(`Cannot create JSObject for value: ${value}`);
  }
}

// Helper function to unwrap JSObjects to JavaScript values
export function unwrapJSObject(obj: JikiObject | any): any {
  if (obj instanceof JSList) {
    return obj.value.map(elem => unwrapJSObject(elem));
  } else if (obj instanceof JSDictionary) {
    const result: any = {};
    for (const [key, val] of obj.value.entries()) {
      result[key] = unwrapJSObject(val);
    }
    return result;
  } else if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
