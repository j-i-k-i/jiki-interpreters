import type { Token } from "./token";
import { Location } from "../shared/location";

export abstract class Expression {
  constructor(public type: string) {}
  abstract location: Location;
  abstract children(): Expression[];
}

export class LiteralExpression extends Expression {
  constructor(
    public value: number | string | boolean | null,
    public location: Location
  ) {
    super("LiteralExpression");
  }
  public children() {
    return [];
  }
}

export class BinaryExpression extends Expression {
  constructor(
    public left: Expression,
    public operator: Token,
    public right: Expression,
    public location: Location
  ) {
    super("BinaryExpression");
  }
  public children() {
    return [this.left, this.right];
  }
}

export class UnaryExpression extends Expression {
  constructor(
    public operator: Token,
    public operand: Expression,
    public location: Location
  ) {
    super("UnaryExpression");
  }
  public children() {
    return [this.operand];
  }
}

export class GroupingExpression extends Expression {
  constructor(
    public inner: Expression,
    public location: Location
  ) {
    super("GroupingExpression");
  }
  public children() {
    return [this.inner];
  }
}

export class IdentifierExpression extends Expression {
  constructor(
    public name: Token,
    public location: Location
  ) {
    super("IdentifierExpression");
  }
  public children() {
    return [];
  }
}

export class ListExpression extends Expression {
  constructor(
    public elements: Expression[],
    public location: Location
  ) {
    super("ListExpression");
  }
  public children() {
    return this.elements;
  }
}
