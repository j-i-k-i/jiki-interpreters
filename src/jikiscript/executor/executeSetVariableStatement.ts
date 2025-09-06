import type { Executor } from "../executor";
import { VariableLookupExpression } from "../expression";
import { isCallable } from "../functions";
import { RuntimeError } from "../error";
import type { SetVariableStatement } from "../statement";
import type { EvaluationResultSetVariableStatement } from "../evaluation-result";

export function executeSetVariableStatement(executor: Executor, statement: SetVariableStatement): void {
  executor.executeFrame<EvaluationResultSetVariableStatement>(statement, () => {
    executor.guardDefinedName(statement.name);

    if (statement.name.lexeme.includes("#")) {
      executor.error("VariableCannotBeNamespaced", statement.name.location, {
        name: statement.name.lexeme,
      });
    }

    let value;
    try {
      value = executor.evaluate(statement.value);
    } catch (e) {
      if (e instanceof RuntimeError && e.type == "ExpressionIsNull") {
        executor.error("CannotStoreNullFromFunction", statement.value.location);
      } else {
        throw e;
      }
    }
    executor.guardNoneJikiObject(value.jikiObject, statement.location);

    if (isCallable(value.jikiObject)) {
      executor.error("MissingParenthesesForFunctionCall", statement.value.location, {
        name: (statement.value as VariableLookupExpression).name.lexeme,
      });
    }

    executor.defineVariable(statement.name.lexeme, value.jikiObject as any);

    return {
      type: "SetVariableStatement",
      name: statement.name.lexeme,
      value: value,
    };
  });
}
