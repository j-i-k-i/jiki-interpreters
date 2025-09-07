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

export class ConsoleLogStatement extends Statement {
  constructor(
    public expression: Expression,
    public location: Location
  ) {
    super("ConsoleLogStatement");
  }
  public children() {
    return [this.expression];
  }
}

export class VariableDeclaration extends Statement {
  constructor(
    public name: Token,
    public initializer: Expression | null,
    public location: Location
  ) {
    super("VariableDeclaration");
  }
  public children() {
    return this.initializer ? [this.initializer] : [];
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
    return this.statements.flatMap(stmt => stmt.children());
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
    const children = [this.condition, ...this.thenBranch.children()];
    if (this.elseBranch) {
      children.push(...this.elseBranch.children());
    }
    return children;
  }
}
