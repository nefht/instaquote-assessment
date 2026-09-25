import { createWorker } from "tesseract.js";
import { normalizeText } from "../../utils/text-normalizer.js";

let workerPromise: ReturnType<typeof createWorker> | null = null;

async function getWorker() {
  workerPromise ??= createWorker("eng");
  return workerPromise;
}

export async function ocrImage(image: Buffer): Promise<string> {
  const worker = await getWorker();
  const result = await worker.recognize(image);
  return normalizeText(result.data.text);
}

export async function closeOcrWorker() {
  if (workerPromise) {
    const worker = await workerPromise;
    await worker.terminate();
    workerPromise = null;
  }
}
