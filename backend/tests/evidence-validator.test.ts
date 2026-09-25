import { describe, it, expect } from "vitest";
import { validateEvidence } from "../src/services/validation/evidence-validator.service.js";

const pages = [
  {
    page: 1,
    source: "pdf-text" as const,
    text: "1 GIB board 48 sheet $24.90 $1,195.20",
  },
];

const base = {
  description: {
    value: "GIB board",
    evidence: {
      page: 1,
      sourceText: "1 GIB board 48 sheet $24.90 $1,195.20",
    },
  },
  quantity: {
    value: 48,
    evidence: {
      page: 1,
      sourceText: "1 GIB board 48 sheet $24.90 $1,195.20",
    },
  },
  unit: {
    value: "sheet",
    evidence: {
      page: 1,
      sourceText: "1 GIB board 48 sheet $24.90 $1,195.20",
    },
  },
  unitPrice: {
    value: 24.9,
    evidence: {
      page: 1,
      sourceText: "1 GIB board 48 sheet $24.90 $1,195.20",
    },
  },
  lineTotal: {
    value: 1195.2,
    evidence: {
      page: 1,
      sourceText: "1 GIB board 48 sheet $24.90 $1,195.20",
    },
  },
};

describe("evidence validator", () => {
  it("accepts values backed by exact evidence", () => {
    const r = validateEvidence([base], pages);

    expect(r.verified).toHaveLength(1);
    expect(r.refusals).toHaveLength(0);
  });

  it("refuses hallucinated numeric value without discarding item", () => {
    const r = validateEvidence(
      [
        {
          ...base,
          unitPrice: {
            value: 29.9,
            evidence: base.unitPrice.evidence,
          },
        },
      ],
      pages,
    );

    expect(r.verified).toHaveLength(1);
    expect(r.verified[0].unitPrice).toBeNull();
    expect(r.refusals[0].code).toBe("EVIDENCE_MISMATCH");
  });

  it("refuses evidence that references a page that does not exist", () => {
    const r = validateEvidence(
      [
        {
          ...base,
          quantity: {
            value: 48,
            evidence: {
              page: 99,
              sourceText: "1 GIB board 48 sheet $24.90 $1,195.20",
            },
          },
        },
      ],
      pages,
    );

    expect(r.verified).toHaveLength(1);
    expect(r.verified[0].quantity).toBeNull();

    expect(r.refusals).toHaveLength(1);
    expect(r.refusals[0].code).toBe("MISSING_EVIDENCE");
  });

  it("refuses source text that cannot be found on the cited page", () => {
    const r = validateEvidence(
      [
        {
          ...base,
          quantity: {
            value: 48,
            evidence: {
              page: 1,
              sourceText: "This text does not exist in the document",
            },
          },
        },
      ],
      pages,
    );

    expect(r.verified).toHaveLength(1);
    expect(r.verified[0].quantity).toBeNull();

    expect(r.refusals).toHaveLength(1);
    expect(r.refusals[0].code).toBe("EVIDENCE_MISMATCH");
  });

  it("allows an optional field to be absent without creating a refusal", () => {
    const r = validateEvidence(
      [
        {
          ...base,
          lineTotal: null,
        },
      ],
      pages,
    );

    expect(r.verified).toHaveLength(1);
    expect(r.verified[0].lineTotal).toBeNull();
    expect(r.refusals).toHaveLength(0);
  });

  it("refuses a calculated line total that is not present in the source", () => {
    const pagesWithoutTotal = [
      {
        page: 1,
        source: "pdf-text" as const,
        text: "1 Galv nails 90mm, bulk 4 25kg $68.00 /bag",
      },
    ];

    const candidate = {
      description: {
        value: "Galv nails 90mm, bulk",
        evidence: {
          page: 1,
          sourceText: "1 Galv nails 90mm, bulk 4 25kg $68.00 /bag",
        },
      },
      quantity: {
        value: 4,
        evidence: {
          page: 1,
          sourceText: "1 Galv nails 90mm, bulk 4 25kg $68.00 /bag",
        },
      },
      unit: {
        value: "bag",
        evidence: {
          page: 1,
          sourceText: "$68.00 /bag",
        },
      },
      unitPrice: {
        value: 68,
        evidence: {
          page: 1,
          sourceText: "$68.00 /bag",
        },
      },
      lineTotal: {
        value: 272,
        evidence: {
          page: 1,
          sourceText: "1 Galv nails 90mm, bulk 4 25kg $68.00 /bag",
        },
      },
    };

    const r = validateEvidence([candidate], pagesWithoutTotal);

    expect(r.verified).toHaveLength(1);
    expect(r.verified[0].quantity?.value).toBe(4);
    expect(r.verified[0].unitPrice?.value).toBe(68);

    // Calculated value is not accepted without source evidence.
    expect(r.verified[0].lineTotal).toBeNull();

    expect(r.refusals).toHaveLength(1);
    expect(r.refusals[0].field).toBe("item[0].lineTotal");
    expect(r.refusals[0].code).toBe("EVIDENCE_MISMATCH");
  });
});
