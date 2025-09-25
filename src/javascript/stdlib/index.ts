import { arrayProperties, arrayMethods } from "./arrays";
import type { JikiObject } from "../jsObjects";
import type { ExecutionContext } from "../executor";

// General types for properties and methods
export type Property = {
  get: (ctx: ExecutionContext, obj: JikiObject) => JikiObject;
  description: string;
};

export type Method = {
  arity: number | [number, number]; // exact or [min, max]
  call: (ctx: ExecutionContext, obj: JikiObject, args: JikiObject[]) => JikiObject;
  description: string;
};

// Type definitions for the stdlib structure
type StdlibType = {
  properties: Record<string, Property>;
  methods: Record<string, Method>;
};

// The main stdlib object
export const stdlib: Record<string, StdlibType> = {
  array: {
    properties: arrayProperties as Record<string, Property>,
    methods: arrayMethods as Record<string, Method>,
  },
};

// Get the stdlib type for a JikiObject
export function getStdlibType(obj: JikiObject): string | null {
  // Map JikiObject types to stdlib types
  if (obj.type === "list") return "array";
  // Future: if (obj.type === "string") return "string";
  // Future: if (obj.type === "number") return "number";
  return null;
}

// Internal error class for stdlib functions
// This gets caught and converted to a RuntimeError with proper location
export class StdlibError extends Error {
  constructor(
    public errorType: string,
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = "StdlibError";
  }
}
