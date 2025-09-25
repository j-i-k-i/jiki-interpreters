import { Description, DescriptionContext } from "../../shared/frames";
import { FrameWithResult } from "../frameDescribers";

export function describeBlockStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const result = `<p>Python is executing a block of statements.</p>`;
  const steps = [`<li>Python started executing a block of code.</li>`];

  return { result, steps };
}
