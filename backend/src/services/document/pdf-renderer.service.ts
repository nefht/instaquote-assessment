import { createCanvas } from "@napi-rs/canvas";
import { loadPdf } from "./pdf-parser.service.js";

export async function renderPdfPage(
  buffer: Buffer,
  pageNumber: number,
): Promise<Buffer> {
  const pdf = await loadPdf(buffer);
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2.2 });
  const canvas = createCanvas(
    Math.ceil(viewport.width),
    Math.ceil(viewport.height),
  );
  const ctx = canvas.getContext("2d");
  await page.render({
    canvas: canvas as never,
    canvasContext: ctx as never,
    viewport,
  }).promise;
  return canvas.toBuffer("image/png");
}
