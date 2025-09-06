import type { Expression } from "./expression";
import type { Token } from "./token";
import { Location } from "../shared/location";

export abstract class Statement {
  constructor(public type: string) {}
  abstract location: Location;
  abstract children(): Expression[];
}

export class ExpressionStatement extends Statement {
  constructor(
    public expression: Expression,
    public location: Location
  ) {
    super("ExpressionStatement");
  }
  public children() {
    return [this.expression];
  }
}

export class PrintStatement extends Statement {
  constructor(
    public expression: Expression,
    public location: Location
  ) {
    super("PrintStatement");
  }
  public children() {
    return [this.expression];
  }
}

export class AssignmentStatement extends Statement {
  constructor(
    public name: Token,
    public initializer: Expression,
    public location: Location
  ) {
    super("AssignmentStatement");
  }
  public children() {
    return [this.initializer];
  }
}
