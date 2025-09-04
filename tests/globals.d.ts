/// <reference types="bun-types" />

declare global {
  // Bun test globals
  const test: typeof import("bun:test").test;
  const describe: typeof import("bun:test").describe;
  const expect: typeof import("bun:test").expect;
  const beforeAll: typeof import("bun:test").beforeAll;
  const beforeEach: typeof import("bun:test").beforeEach;
  const afterAll: typeof import("bun:test").afterAll;
  const afterEach: typeof import("bun:test").afterEach;
}

// Extend Bun's Matchers interface to include Jest-like matchers
declare module "bun:test" {
  interface Matchers {
    toBeArrayOfSize(size: number): void;
    toBeEmpty(): void;
    toIncludeSameMembers(members: any[]): void;
  }
}

export {};
