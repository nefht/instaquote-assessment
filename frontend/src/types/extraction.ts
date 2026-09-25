export type PageSource = "pdf-text" | "ocr";

export interface Evidence {
  page: number;
  sourceText: string;
  source: PageSource;
}

export interface VerifiedValue<T> {
  value: T;
  evidence: Evidence;
}

export interface LineItem {
  description: VerifiedValue<string>;
  quantity: VerifiedValue<number> | null;
  unit: VerifiedValue<string> | null;
  unitPrice: VerifiedValue<number> | null;
  lineTotal: VerifiedValue<number> | null;
}

export interface Refusal {
  field: string;
  code: string;
  reason: string;
  evidence?: Evidence[];
}

export interface ExtractionResult {
  document: {
    fileName: string;
    pageCount: number;
  };
  items: LineItem[];
  refusals: Refusal[];
}
