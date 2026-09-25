import type {
  CandidateLineItem,
  CandidateValue,
  Evidence,
  Refusal,
  VerifiedLineItem,
  VerifiedValue,
} from "../../types/extraction.types.js";
import type { PageContent } from "../../types/document.types.js";
import { normalizeForEvidence } from "../../utils/text-normalizer.js";
import { numberExistsInSource } from "./number-matcher.js";
import { refusal } from "./refusal-builder.js";

type Field = "description" | "quantity" | "unit" | "unitPrice" | "lineTotal";
function verify<T extends string | number>(
  field: Field,
  candidate: CandidateValue<T> | null,
  pages: PageContent[],
): { value: VerifiedValue<T> | null; refusal?: Refusal } {
  if (!candidate) return { value: null };
  const page = pages.find((p) => p.page === candidate.evidence.page);
  if (!page)
    return {
      value: null,
      refusal: refusal(
        field,
        "MISSING_EVIDENCE",
        `The proposed ${field} references a page that does not exist.`,
      ),
    };
  const exact = normalizeForEvidence(candidate.evidence.sourceText);
  const hay = normalizeForEvidence(page.text);
  const evidence: Evidence = { ...candidate.evidence, source: page.source };
  if (!exact || !hay.includes(exact))
    return {
      value: null,
      refusal: refusal(
        field,
        "EVIDENCE_MISMATCH",
        `The proposed ${field} could not be matched to exact source text on page ${page.page}.`,
        [evidence],
      ),
    };
  if (
    typeof candidate.value === "number" &&
    !numberExistsInSource(candidate.value, candidate.evidence.sourceText)
  )
    return {
      value: null,
      refusal: refusal(
        field,
        "EVIDENCE_MISMATCH",
        `The proposed numeric ${field} does not appear in its cited source text.`,
        [evidence],
      ),
    };
  if (
    typeof candidate.value === "string" &&
    !normalizeForEvidence(candidate.evidence.sourceText).includes(
      normalizeForEvidence(candidate.value),
    )
  )
    return {
      value: null,
      refusal: refusal(
        field,
        "EVIDENCE_MISMATCH",
        `The proposed ${field} does not appear in its cited source text.`,
        [evidence],
      ),
    };
  return { value: { value: candidate.value, evidence } };
}
export function validateEvidence(
  candidates: CandidateLineItem[],
  pages: PageContent[],
): { verified: VerifiedLineItem[]; refusals: Refusal[] } {
  const verified: VerifiedLineItem[] = [];
  const refusals: Refusal[] = [];
  candidates.forEach((c, index) => {
    const d = verify("description", c.description, pages);
    const q = verify("quantity", c.quantity, pages);
    const u = verify("unit", c.unit, pages);
    const p = verify("unitPrice", c.unitPrice, pages);
    const t = verify("lineTotal", c.lineTotal, pages);
    [d, q, u, p, t].forEach((x) => {
      if (x.refusal)
        refusals.push({
          ...x.refusal,
          field: `item[${index}].${x.refusal.field}`,
        });
    });
    if (d.value)
      verified.push({
        description: d.value,
        quantity: q.value,
        unit: u.value,
        unitPrice: p.value,
        lineTotal: t.value,
      });
  });
  return { verified, refusals };
}
