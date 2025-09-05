import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJikiObject } from "../jikiObjects";

export function executeLiteralExpression(executor: Executor, expression: LiteralExpression): EvaluationResult {
  const jikiObject = createJikiObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject,
    jsObject: jikiObject,
  };
}
