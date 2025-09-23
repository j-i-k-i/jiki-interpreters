// Python objects system extending shared base
import { JikiObject } from "../shared/jikiObject";
export { JikiObject } from "../shared/jikiObject";

export class PyNumber extends JikiObject {
  constructor(public readonly _value: number) {
    super("number");
  }

  public get value(): number {
    return this._value;
  }

  public toString(): string {
    return this._value.toString();
  }

  public clone(): PyNumber {
    // Numbers are immutable, so return self
    return this;
  }

  // Python-specific: Check if this is an integer
  public isInteger(): boolean {
    return Number.isInteger(this._value);
  }

  // Python-specific: Get the type name
  public getTypeName(): string {
    return this.isInteger() ? "int" : "float";
  }
}

export class PyString extends JikiObject {
  constructor(public readonly _value: string) {
    super("string");
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public clone(): PyString {
    // Strings are immutable, so return self
    return this;
  }

  // Python-specific: Get string representation with quotes
  public repr(): string {
    return `"${this._value}"`;
  }
}

export class PyBoolean extends JikiObject {
  constructor(public readonly _value: boolean) {
    super("boolean");
  }

  public get value(): boolean {
    return this._value;
  }

  public toString(): string {
    // Python uses True/False, not true/false
    return this._value ? "True" : "False";
  }

  public clone(): PyBoolean {
    // Booleans are immutable, so return self
    return this;
  }
}

export class PyNone extends JikiObject {
  constructor() {
    super("none");
  }

  public get value(): null {
    return null;
  }

  public toString(): string {
    return "None";
  }

  public clone(): PyNone {
    // None is immutable, so return self
    return this;
  }
}

export class PyList extends JikiObject {
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
      } else if (elem instanceof PyString) {
        // Python uses single quotes for string representation in lists
        elements.push(`'${elem.value}'`);
      } else {
        elements.push(elem.toString());
      }
    }

    return `[${elements.join(", ")}]`;
  }

  public clone(): PyList {
    // Deep clone - handle sparse arrays correctly
    const clonedElements: JikiObject[] = [];
    for (let i = 0; i < this._elements.length; i++) {
      if (i in this._elements) {
        clonedElements[i] = this._elements[i].clone();
      }
    }
    return new PyList(clonedElements);
  }
}

// Helper function to create PyObjects from Python values
export function createPyObject(value: any): JikiObject {
  if (typeof value === "number") {
    return new PyNumber(value);
  } else if (typeof value === "string") {
    return new PyString(value);
  } else if (typeof value === "boolean") {
    return new PyBoolean(value);
  } else if (value === null || value === undefined) {
    return new PyNone();
  } else if (Array.isArray(value)) {
    return new PyList(value.map(elem => createPyObject(elem)));
  } else {
    throw new Error(`Cannot create PyObject for value: ${value}`);
  }
}

// Helper function to unwrap PyObjects to JavaScript values
export function unwrapPyObject(obj: JikiObject | any): any {
  if (obj instanceof PyList) {
    return obj.value.map(elem => unwrapPyObject(elem));
  } else if (obj instanceof JikiObject) {
    return obj.value;
  }
  return obj;
}
