import type { PageContent } from "../../types/document.types.js";
export function buildExtractionPrompt(pages: PageContent[]): string {
  const document = pages
    .map((p) => `--- PAGE ${p.page} (${p.source}) ---\n${p.text}`)
    .join("\n\n");
  return `You extract purchasable line items from construction supply documents.\n\nRULES:\n1. Extract only actual item rows. Do not treat document totals, summaries, pallet counts, notes, page numbers, dates, dimensions inside descriptions, or metadata as separate line items.\n2. Never calculate, infer, repair, or guess a numeric value. If a field is not explicitly present, return null.\n3. Every non-null field must cite the page number and an EXACT VERBATIM sourceText substring copied from that page. Do not paraphrase evidence.\n4. Quantity is the explicit ordered/delivered item quantity, not a dimension, weight, package size, item index, or count embedded in the description.\n5. Preserve the description as written, excluding the row index and columns that belong to quantity/unit/price/total.\n6. A unit price such as '$68.00 /bag' has numeric value 68. Do not turn '/bag' into a quantity.\n7. If a document has returns/credits/summary pages, extract rows as they appear; do not invent signs or deduplicate unless the source explicitly says to.\n8. Output JSON only, matching the provided schema.\n\nDOCUMENT:\n${document}`;
}
