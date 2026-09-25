import { AlertTriangle } from "lucide-react";
import type { Refusal } from "../types/extraction";

function getFieldLabel(field: string): string {
  const fieldName = field.split(".").pop() ?? field;

  const labels: Record<string, string> = {
    description: "Description",
    quantity: "Quantity",
    unit: "Unit",
    unitPrice: "Unit price",
    lineTotal: "Line total",
  };

  return labels[fieldName] ?? "Value";
}

function getUserMessage(refusal: Refusal): {
  title: string;
  message: string;
} {
  const fieldLabel = getFieldLabel(refusal.field);

  switch (refusal.code) {
    case "EVIDENCE_MISMATCH":
      return {
        title: `${fieldLabel} could not be verified`,
        message: `The ${fieldLabel.toLowerCase()} could not be confirmed from the source document, so no value was selected.`,
      };

    case "MISSING_EVIDENCE":
      return {
        title: `${fieldLabel} needs review`,
        message: `No source evidence was found for the ${fieldLabel.toLowerCase()}, so no value was selected.`,
      };

    case "AMBIGUOUS_VALUE":
      return {
        title: `${fieldLabel} is unclear`,
        message: `The document does not provide one clear ${fieldLabel.toLowerCase()}, so no value was selected.`,
      };

    case "CONFLICTING_VALUES":
      return {
        title: `${fieldLabel} has conflicting values`,
        message: `The document contains conflicting information for the ${fieldLabel.toLowerCase()}, so no value was selected.`,
      };

    case "UNREADABLE_CONTENT":
      return {
        title: `${fieldLabel} could not be read`,
        message: `The source content for the ${fieldLabel.toLowerCase()} could not be read reliably, so no value was selected.`,
      };

    case "UNSUPPORTED_CONTENT":
      return {
        title: `${fieldLabel} could not be verified`,
        message: `The source document does not provide enough supported information for the ${fieldLabel.toLowerCase()}, so no value was selected.`,
      };

    default:
      return {
        title: `${fieldLabel} needs review`,
        message: refusal.reason,
      };
  }
}

export function RefusalCard({ refusal }: { refusal: Refusal }) {
  const { title, message } = getUserMessage(refusal);

  return (
    <article className="card refusal">
      <div className="refusal-head">
        <AlertTriangle size={18} />
        <strong>{title}</strong>
      </div>

      <p>{message}</p>

      {refusal.evidence?.map((evidence, index) => (
        <div className="quote" key={index}>
          <small>
            Page {evidence.page} ·{" "}
            {evidence.source === "ocr" ? "OCR" : "PDF text"}
          </small>

          <blockquote>{evidence.sourceText}</blockquote>
        </div>
      ))}

      <b className="no-value">No unverified value was selected.</b>
    </article>
  );
}
