import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJSObject } from "../jsObjects";

export function executeLiteralExpression(executor: Executor, expression: LiteralExpression): EvaluationResult {
  const jsObject = createJSObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject: jsObject,
    jsObject: jsObject,
  };
}
