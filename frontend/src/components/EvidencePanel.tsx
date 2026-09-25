import type { Evidence } from "../types/extraction";

interface EvidenceEntry {
  label: string;
  evidence: Evidence;
}

export function EvidencePanel({ entries }: { entries: EvidenceEntry[] }) {
  return (
    <details className="evidence">
      <summary>View evidence</summary>

      <div className="evidence-body">
        {entries.map((entry) => (
          <div className="evidence-entry" key={entry.label}>
            <div className="evidence-entry-head">
              <strong>{entry.label}</strong>

              <span>
                Page {entry.evidence.page} ·{" "}
                {entry.evidence.source === "ocr" ? "OCR" : "PDF text"}
              </span>
            </div>

            <blockquote>{entry.evidence.sourceText}</blockquote>
          </div>
        ))}
      </div>
    </details>
  );
}
