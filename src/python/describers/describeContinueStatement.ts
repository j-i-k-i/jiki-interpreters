import { Description, DescriptionContext } from "../../shared/frames";
import { FrameWithResult } from "../frameDescribers";

export function describeContinueStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const result = `<p>Python encountered a <code>continue</code> statement and is moving to the next iteration.</p>`;
  const steps = [`<li>Python is continuing to the next iteration of the loop.</li>`];

  return { result, steps };
}
