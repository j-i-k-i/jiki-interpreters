import { isString } from "../checks";
import { EvaluationResultForeachStatement } from "../evaluation-result";
import { Description, DescriptionContext, FrameWithResult } from "../frames";
import { codeTag, formatJikiObject } from "../helpers";
import * as Jiki from "../jikiObjects";
import { ForeachStatement } from "../statement";
import { addOrdinalSuffix } from "./helpers";

export function describeForeachStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const frameContext = frame.context as ForeachStatement;
  const frameResult = frame.result as EvaluationResultForeachStatement;

  if (Jiki.unwrapJikiObject(frameResult.iterable.jikiObject)?.length === 0) {
    return describeEmptyList(frameResult);
  } else {
    return describePopulatedList(frameContext, frameResult);
  }
}
function describeEmptyList(frameResult: EvaluationResultForeachStatement): Description {
  const type = frameResult.iterable.jikiObject instanceof Jiki.JikiString ? "string" : "list";
  const result = `<p>The ${type} was empty so this line did nothing.</p>`;
  const steps = [
    `<li>Jiki checked the ${type}, saw it was empty, and decided not to do anything further on this line.</li>`,
  ];
  return {
    result,
    steps,
  };
}

function describePopulatedList(
  frameContext: ForeachStatement,
  frameResult: EvaluationResultForeachStatement
): Description {
  const name = frameContext.elementName.lexeme;
  const value = frameResult.temporaryVariableValue;
  const ordinaledIndex = addOrdinalSuffix(frameResult.index);

  let result = `<p>This line started the ${ordinaledIndex} iteration with the ${codeTag(
    name,
    frameContext.elementName.location
  )} variable set to ${value ? codeTag(value, frameContext.iterable.location) : "unknown"}`;

  if (frameContext.secondElementName && frameResult.secondTemporaryVariableValue) {
    result += ` and the ${codeTag(
      frameContext.secondElementName.lexeme,
      frameContext.secondElementName.location
    )} variable set to ${frameResult.secondTemporaryVariableValue ? codeTag(frameResult.secondTemporaryVariableValue, frameContext.iterable.location) : "unknown"}`;
  }
  result += `.</p>`;
  const steps = [
    `<li>Jiki created a new box called ${codeTag(name, frameContext.elementName.location)}.</li>`,
    `<li>Jiki put ${
      value ? codeTag(value, frameContext.iterable.location) : "unknown"
    } in the box, and put it on the shelf, ready to use in the code block.</li>`,
  ];

  if (frameContext.secondElementName && frameResult.secondTemporaryVariableValue) {
    steps.push(
      `<li>Jiki created a new box called ${codeTag(
        frameContext.secondElementName.lexeme,
        frameContext.secondElementName.location
      )}.</li>`,
      `<li>Jiki put ${codeTag(
        frameResult.secondTemporaryVariableValue,
        frameContext.iterable.location
      )} in the box, and put it on the shelf, ready to use in the code block.</li>`
    );
  }
  return {
    result,
    steps,
  };
}
