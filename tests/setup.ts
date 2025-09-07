import { beforeAll } from "bun:test";
import { changeLanguage } from "@jikiscript/translator";

beforeAll(async () => {
  await changeLanguage("system");
});
