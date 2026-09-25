import { describe, it, expect, vi } from "vitest";
vi.mock("../src/services/document/document-processor.service.js", () => ({
  processDocument: vi.fn(async () => ({
    pages: [
      { page: 1, text: "1 Board 2 sheet $10.00 $20.00", source: "pdf-text" },
    ],
    unreadablePages: [],
  })),
}));
vi.mock("../src/services/extraction/candidate-extractor.service.js", () => ({
  extractCandidates: vi.fn(async () => [
    {
      description: {
        value: "Board",
        evidence: { page: 1, sourceText: "1 Board 2 sheet $10.00 $20.00" },
      },
      quantity: {
        value: 2,
        evidence: { page: 1, sourceText: "1 Board 2 sheet $10.00 $20.00" },
      },
      unit: {
        value: "sheet",
        evidence: { page: 1, sourceText: "1 Board 2 sheet $10.00 $20.00" },
      },
      unitPrice: {
        value: 10,
        evidence: { page: 1, sourceText: "1 Board 2 sheet $10.00 $20.00" },
      },
      lineTotal: {
        value: 20,
        evidence: { page: 1, sourceText: "1 Board 2 sheet $10.00 $20.00" },
      },
    },
  ]),
}));
import { extractDocument } from "../src/services/extraction.service.js";
describe("extraction service", () => {
  it("returns verified items and domain refusals separately", async () => {
    const r = await extractDocument(Buffer.from("x"), "test.pdf");
    expect(r.items).toHaveLength(1);
    expect(r.refusals).toHaveLength(0);
  });
});
