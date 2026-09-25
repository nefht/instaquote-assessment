import type { PageSource } from "./document.types.js";
export interface CandidateEvidence {
  page: number;
  sourceText: string;
}
export interface CandidateValue<T> {
  value: T;
  evidence: CandidateEvidence;
}
export interface CandidateLineItem {
  description: CandidateValue<string>;
  quantity: CandidateValue<number> | null;
  unit: CandidateValue<string> | null;
  unitPrice: CandidateValue<number> | null;
  lineTotal: CandidateValue<number> | null;
}
export interface Evidence extends CandidateEvidence {
  source: PageSource;
}
export interface VerifiedValue<T> {
  value: T;
  evidence: Evidence;
}
export interface VerifiedLineItem {
  description: VerifiedValue<string>;
  quantity: VerifiedValue<number> | null;
  unit: VerifiedValue<string> | null;
  unitPrice: VerifiedValue<number> | null;
  lineTotal: VerifiedValue<number> | null;
}
export type RefusalCode =
  | "MISSING_EVIDENCE"
  | "EVIDENCE_MISMATCH"
  | "CONFLICTING_VALUES"
  | "UNREADABLE_CONTENT"
  | "LLM_EXTRACTION_FAILED";
export interface Refusal {
  field: string;
  code: RefusalCode;
  reason: string;
  evidence?: Evidence[];
}
export interface ExtractionResult {
  document: { fileName: string; pageCount: number };
  items: VerifiedLineItem[];
  refusals: Refusal[];
}
