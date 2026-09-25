import { describe, it, expect } from "vitest";
import { detectContradictions } from "../src/services/validation/contradiction-detector.service.js";
const evidence = {
  page: 1,
  sourceText: "Return item -2 ea",
  source: "pdf-text" as const,
};
describe("contradiction detector", () => {
  it("keeps conservative checks isolated", () => {
    const item = {
      description: { value: "Return item", evidence },
      quantity: { value: -2, evidence },
      unit: null,
      unitPrice: null,
      lineTotal: null,
    };
    const r = detectContradictions([item]);
    expect(r.items).toHaveLength(1);
    expect(r.refusals[0].code).toBe("CONFLICTING_VALUES");
  });
});
