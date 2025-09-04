import { test, expect } from "bun:test";
import { sanityCheck } from "../src/sanity";

test("sanity check returns Hello World", () => {
  expect(sanityCheck()).toBe("Hello World");
});
