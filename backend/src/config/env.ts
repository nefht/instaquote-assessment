import "dotenv/config";

const number = (value: string | undefined, fallback: number) =>
  value ? Number(value) : fallback;

export const env = {
  port: number(process.env.PORT, 3001),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite",
  ocrEnabled: (process.env.OCR_ENABLED ?? "true").toLowerCase() === "true",
};
