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

export class BlockStatement extends Statement {
  constructor(
    public statements: Statement[],
    public location: Location
  ) {
    super("BlockStatement");
  }
  public children() {
    // Return empty array since statements are not expressions
    return [];
  }
}

export class IfStatement extends Statement {
  constructor(
    public condition: Expression,
    public thenBranch: Statement,
    public elseBranch: Statement | null,
    public location: Location
  ) {
    super("IfStatement");
  }
  public children() {
    const children = [this.condition];
    // Note: thenBranch and elseBranch are statements, not expressions
    // so we don't include them in children() which returns Expression[]
    return children;
  }
}
