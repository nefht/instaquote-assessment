import type { ExtractionResult, Refusal } from "../types/extraction.types.js";
import { processDocument } from "./document/document-processor.service.js";
import { extractCandidates } from "./extraction/candidate-extractor.service.js";
import { validateEvidence } from "./validation/evidence-validator.service.js";
import { detectContradictions } from "./validation/contradiction-detector.service.js";
import { refusal } from "./validation/refusal-builder.js";
export async function extractDocument(
  buffer: Buffer,
  fileName: string,
): Promise<ExtractionResult> {
  const { pages, unreadablePages } = await processDocument(buffer);
  const refusals: Refusal[] = unreadablePages.map((p) =>
    refusal(
      `page[${p}]`,
      "UNREADABLE_CONTENT",
      `Page ${p} could not be read reliably enough to extract values.`,
    ),
  );
  const readable = pages.filter(
    (p) => !unreadablePages.includes(p.page) && p.text.trim(),
  );
  if (!readable.length)
    return {
      document: { fileName, pageCount: pages.length },
      items: [],
      refusals,
    };
  try {
    const candidates = await extractCandidates(readable);
    const validation = validateEvidence(candidates, pages);
    const contradictions = detectContradictions(validation.verified);
    return {
      document: { fileName, pageCount: pages.length },
      items: contradictions.items,
      refusals: [
        ...refusals,
        ...validation.refusals,
        ...contradictions.refusals,
      ],
    };
  } catch (error) {
    return {
      document: { fileName, pageCount: pages.length },
      items: [],
      refusals: [
        ...refusals,
        refusal(
          "document",
          "LLM_EXTRACTION_FAILED",
          error instanceof Error
            ? `Structured extraction failed: ${error.message}`
            : "Structured extraction failed.",
        ),
      ],
    };
  }
}
