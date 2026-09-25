import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { ParsedPage } from "../../types/document.types.js";
import { normalizeText } from "../../utils/text-normalizer.js";

export async function loadPdf(buffer: Buffer) {
  return pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
}

export async function parsePdfText(buffer: Buffer): Promise<ParsedPage[]> {
  const pdf = await loadPdf(buffer);
  const pages: ParsedPage[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const lines = new Map<number, { x: number; str: string }[]>();
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const x = item.transform[4];
      const y = Math.round(item.transform[5]);
      const key = [...lines.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
      const arr = lines.get(key) ?? [];
      arr.push({ x, str: item.str });
      lines.set(key, arr);
    }
    const text = [...lines.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, parts]) =>
        parts
          .sort((a, b) => a.x - b.x)
          .map((p) => p.str)
          .join(" "),
      )
      .join("\n");
    pages.push({ page: pageNo, text: normalizeText(text) });
  }
  return pages;
}
