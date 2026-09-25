import { GoogleGenAI } from "@google/genai";

import { env } from "../../config/env.js";

import {
  candidateExtractionSchema,
  geminiResponseSchema,
} from "./extraction-schema.js";
import type { CandidateLineItem } from "../../types/extraction.types.js";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

let client: GoogleGenAI | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isServiceUnavailable(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    if ("status" in error && error.status === 503) {
      return true;
    }

    if ("code" in error && error.code === 503) {
      return true;
    }

    if ("statusCode" in error && error.statusCode === 503) {
      return true;
    }
  }

  if (error instanceof Error) {
    return (
      error.message.includes('"code":503') ||
      error.message.includes("503") ||
      error.message.includes("UNAVAILABLE")
    );
  }

  return false;
}

export async function generateCandidates(
  prompt: string,
): Promise<CandidateLineItem[]> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  client ??= new GoogleGenAI({ apiKey: env.geminiApiKey });

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: env.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: geminiResponseSchema as never,
          temperature: 0,
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response");
      }

      return candidateExtractionSchema.parse(JSON.parse(response.text)).items;
    } catch (error) {
      const shouldRetry = isServiceUnavailable(error) && attempt < MAX_RETRIES;

      if (!shouldRetry) {
        throw error;
      }

      const delay = INITIAL_RETRY_DELAY_MS * 2 ** attempt;

      console.warn(
        `Gemini unavailable (503). Retrying in ${delay}ms ` +
          `(attempt ${attempt + 1}/${MAX_RETRIES})`,
      );

      await sleep(delay);
    }
  }

  throw new Error("Gemini request failed after retries");
}
