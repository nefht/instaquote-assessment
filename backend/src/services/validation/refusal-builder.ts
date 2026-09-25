import type {
  Evidence,
  Refusal,
  RefusalCode,
} from "../../types/extraction.types.js";
export function refusal(
  field: string,
  code: RefusalCode,
  reason: string,
  evidence?: Evidence[],
): Refusal {
  return { field, code, reason, ...(evidence?.length ? { evidence } : {}) };
}
