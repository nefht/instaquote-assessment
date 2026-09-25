import type { PageContent } from "../../types/document.types.js";
import type { CandidateLineItem } from "../../types/extraction.types.js";
import { buildExtractionPrompt } from "./extraction-prompt.js";
import { generateCandidates } from "./gemini.service.js";

export async function extractCandidates(
  pages: PageContent[],
): Promise<CandidateLineItem[]> {
  return generateCandidates(
    buildExtractionPrompt(pages.filter((page) => page.text.trim())),
  );
}
