import { CheckCircle2 } from "lucide-react";
import type { LineItem } from "../types/extraction";
import { EvidencePanel } from "./EvidencePanel";

const money = (value: number) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(value);

export function LineItemCard({ item }: { item: LineItem }) {
  const evidenceEntries = [
    {
      label: "Description",
      evidence: item.description.evidence,
    },
    ...(item.quantity
      ? [
          {
            label: "Quantity",
            evidence: item.quantity.evidence,
          },
        ]
      : []),
    ...(item.unit
      ? [
          {
            label: "Unit",
            evidence: item.unit.evidence,
          },
        ]
      : []),
    ...(item.unitPrice
      ? [
          {
            label: "Unit price",
            evidence: item.unitPrice.evidence,
          },
        ]
      : []),
    ...(item.lineTotal
      ? [
          {
            label: "Line total",
            evidence: item.lineTotal.evidence,
          },
        ]
      : []),
  ];

  return (
    <article className="card">
      <div className="card-title">
        <h3>{item.description.value}</h3>

        <span className="verified">
          <CheckCircle2 size={15} /> Verified evidence
        </span>
      </div>

      <div className="metrics">
        <div>
          <small>Quantity</small>
          <b>{item.quantity?.value ?? "—"}</b>
        </div>

        <div>
          <small>Unit</small>
          <b>{item.unit?.value ?? "—"}</b>
        </div>

        <div>
          <small>Unit price</small>
          <b>{item.unitPrice ? money(item.unitPrice.value) : "—"}</b>
        </div>

        <div>
          <small>Line total</small>
          <b>{item.lineTotal ? money(item.lineTotal.value) : "—"}</b>
        </div>
      </div>

      <EvidencePanel entries={evidenceEntries} />
    </article>
  );
}
