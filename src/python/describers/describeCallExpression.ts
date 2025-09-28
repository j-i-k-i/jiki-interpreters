import type { EvaluationResultCallExpression } from "../evaluation-result";
import type { CallExpression } from "../expression";
import { describeExpression } from "./describeSteps";
import { formatPyObject } from "./helpers";

export function describeCallExpression(expression: CallExpression, result: EvaluationResultCallExpression): string[] {
  const steps: string[] = [];

  // First, describe evaluation of all arguments
  for (let i = 0; i < result.args.length; i++) {
    const argResult = result.args[i];
    const argSteps = describeExpression(expression.args[i], argResult as any, { functionDescriptions: {} });
    if (argSteps.length > 0) {
      steps.push(...argSteps);
    }
  }

  // Build arguments description
  const argValues = result.args.map(arg => {
    return formatPyObject(arg.jikiObject);
  });

  // Then describe the function call
  if (argValues.length === 0) {
    steps.push(`<li>Python used the <code>${result.functionName}</code> function.</li>`);
  } else if (argValues.length === 1) {
    steps.push(
      `<li>Python used the <code>${result.functionName}</code> function with <code>${argValues[0]}</code>.</li>`
    );
  } else {
    const lastArg = argValues.pop();
    steps.push(
      `<li>Python used the <code>${result.functionName}</code> function with <code>${argValues.join("</code>, <code>")}</code> and <code>${lastArg}</code>.</li>`
    );
  }

  return steps;
}
