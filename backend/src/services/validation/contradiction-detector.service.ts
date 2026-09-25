import type {
  Refusal,
  VerifiedLineItem,
} from "../../types/extraction.types.js";
import { refusal } from "./refusal-builder.js";
export function detectContradictions(items: VerifiedLineItem[]): {
  items: VerifiedLineItem[];
  refusals: Refusal[];
} {
  const refusals: Refusal[] = [];
  for (const [i, item] of items.entries()) {
    if (item.quantity && item.quantity.value < 0)
      refusals.push(
        refusal(
          `item[${i}].quantity`,
          "CONFLICTING_VALUES",
          "A negative quantity was extracted but no explicit return/credit semantics were verified.",
          [item.quantity.evidence],
        ),
      );
  }
  return { items, refusals };
}
