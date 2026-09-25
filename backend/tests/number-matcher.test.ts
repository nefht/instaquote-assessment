import { describe, it, expect } from "vitest";
import { numberExistsInSource } from "../src/services/validation/number-matcher.js";
describe("number matcher", () => {
  it("matches currency formatting", () =>
    expect(numberExistsInSource(1195.2, "48 sheet $24.90 $1,195.20")).toBe(
      true,
    ));
  it("does not infer calculated values", () =>
    expect(numberExistsInSource(1195.2, "48 sheet $24.90")).toBe(false));
});
