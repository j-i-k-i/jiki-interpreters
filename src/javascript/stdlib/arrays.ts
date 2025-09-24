import { JSNumber, JSUndefined, JSList, type JikiObject } from "../jsObjects";
import type { ExecutionContext } from "../executor";

// Type for array properties (values that can be accessed but not called)
export type ArrayProperty = {
  name: string;
  get: (ctx: ExecutionContext, array: JSList) => JikiObject;
  description: string;
};

// Type for array methods (values that can be called with arguments)
export type ArrayMethod = {
  name: string;
  arity: number | [number, number]; // exact or [min, max]
  call: (ctx: ExecutionContext, array: JSList, args: JikiObject[]) => JikiObject;
  description: string;
};

// Array properties
export const arrayProperties: Record<string, ArrayProperty> = {
  length: {
    name: "length",
    get: (_ctx: ExecutionContext, array: JSList) => {
      return new JSNumber(array.length);
    },
    description: "the number of elements in the array",
  },
};

// Array methods
export const arrayMethods: Record<string, ArrayMethod> = {
  at: {
    name: "at",
    arity: 1,
    call: (_ctx: ExecutionContext, array: JSList, args: JikiObject[]) => {
      // Validate we have exactly one argument
      if (args.length !== 1) {
        throw new Error(`at() expects exactly 1 argument, got ${args.length}`);
      }

      const indexArg = args[0];

      // Check that the argument is a number
      if (!(indexArg instanceof JSNumber)) {
        throw new Error(`at() expects a number argument`);
      }

      let index = indexArg.value;

      // Check for non-integer indices
      if (!Number.isInteger(index)) {
        throw new Error(`at() expects an integer index`);
      }

      // Handle negative indices (Python-style)
      if (index < 0) {
        index = array.length + index;
      }

      // Check bounds
      if (index < 0 || index >= array.length) {
        return new JSUndefined();
      }

      // Get the element
      const element = array.getElement(index);
      return element || new JSUndefined();
    },
    description: "returns the element at the specified index",
  },
};

// Helper to check if a property exists on an array
export function hasArrayProperty(name: string): boolean {
  return name in arrayProperties;
}

// Helper to check if a method exists on an array
export function hasArrayMethod(name: string): boolean {
  return name in arrayMethods;
}

// Helper to get an array property
export function getArrayProperty(name: string): ArrayProperty | undefined {
  return arrayProperties[name];
}

// Helper to get an array method
export function getArrayMethod(name: string): ArrayMethod | undefined {
  return arrayMethods[name];
}
