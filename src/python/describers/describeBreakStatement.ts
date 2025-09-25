import { Description, DescriptionContext } from "../../shared/frames";
import { FrameWithResult } from "../frameDescribers";

export function describeBreakStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const result = `<p>Python encountered a <code>break</code> statement and is exiting the current loop.</p>`;
  const steps = [`<li>Python is breaking out of the current loop.</li>`];

  return { result, steps };
}
