import type { ExtractionResult } from "../types/extraction";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function extractPdf(file: File): Promise<ExtractionResult> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${API}/api/extract`, {
    method: "POST",
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "The document could not be processed.");
  }

  return data;
}
