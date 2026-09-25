import { env } from "../../config/env.js";
import type { PageContent } from "../../types/document.types.js";
import { ocrImage } from "./ocr.service.js";
import { parsePdfText } from "./pdf-parser.service.js";
import { renderPdfPage } from "./pdf-renderer.service.js";

function hasUsableText(text: string): boolean {
  return text.replace(/\s/g, "").length >= 30;
}

export async function processDocument(
  buffer: Buffer,
): Promise<{ pages: PageContent[]; unreadablePages: number[] }> {
  const parsed = await parsePdfText(buffer);
  const pages: PageContent[] = [];
  const unreadablePages: number[] = [];

  for (const page of parsed) {
    if (hasUsableText(page.text)) {
      pages.push({ ...page, source: "pdf-text" });
      continue;
    }

    if (!env.ocrEnabled) {
      pages.push({ ...page, source: "pdf-text" });
      unreadablePages.push(page.page);
      continue;
    }

    try {
      const image = await renderPdfPage(buffer, page.page);
      const text = await ocrImage(image);
      pages.push({ page: page.page, text, source: "ocr" });

      if (!hasUsableText(text)) unreadablePages.push(page.page);
    } catch {
      pages.push({ ...page, source: "pdf-text" });
      unreadablePages.push(page.page);
    }
  }

  return { pages, unreadablePages };
}
