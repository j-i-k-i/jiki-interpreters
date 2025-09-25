import { Location } from "./location";

export interface SomethingWithLocation {
  location: Location;
}

export type DisabledLanguageFeatureErrorType =
  | "DisabledFeatureExcludeListViolation"
  | "DisabledFeatureIncludeListViolation";

export class DisabledLanguageFeatureError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: DisabledLanguageFeatureErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "DisabledLanguageFeatureError";
  }
}

export interface ExecutionContext {
  fastForward: (milliseconds: number) => void;
  getCurrentTimeInMs: () => number;
}
