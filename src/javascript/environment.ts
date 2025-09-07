import type { JikiObject } from "./jsObjects";

export class Environment {
  private readonly values: Map<string, JikiObject> = new Map();
  public readonly id: string;

  constructor(private readonly enclosing: Environment | null = null) {
    this.id = Math.random().toString(36).substring(7);
  }

  public define(name: string, value: JikiObject): void {
    this.values.set(name, value);
  }

  public isDefinedInEnclosingScope(name: string): boolean {
    if (this.enclosing === null) {
      return false;
    }

    // Check if the variable is defined in any enclosing scope
    if (this.enclosing.values.has(name)) {
      return true;
    }

    return this.enclosing.isDefinedInEnclosingScope(name);
  }

  public get(name: string): JikiObject | undefined {
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    return undefined;
  }

  public update(name: string, value: JikiObject): boolean {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return true;
    }

    if (this.enclosing !== null) {
      return this.enclosing.update(name, value);
    }

    // Variable not found in any scope
    return false;
  }

  public getAllVariables(): Record<string, JikiObject> {
    const result: Record<string, JikiObject> = {};

    // Get variables from enclosing scopes first (so local variables can override)
    if (this.enclosing !== null) {
      Object.assign(result, this.enclosing.getAllVariables());
    }

    // Add variables from this scope
    for (const [name, value] of this.values) {
      result[name] = value;
    }

    return result;
  }
}
