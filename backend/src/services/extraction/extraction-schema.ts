import { z } from "zod";
import { Type } from "@google/genai";
const evidence = z.object({
  page: z.number().int().positive(),
  sourceText: z.string().min(1),
});
const textValue = z.object({ value: z.string().min(1), evidence });
const numberValue = z.object({ value: z.number(), evidence });
export const candidateLineItemSchema = z.object({
  description: textValue,
  quantity: numberValue.nullable(),
  unit: textValue.nullable(),
  unitPrice: numberValue.nullable(),
  lineTotal: numberValue.nullable(),
});
export const candidateExtractionSchema = z.object({
  items: z.array(candidateLineItemSchema),
});
export const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: valueSchema(Type.STRING),
          quantity: valueSchema(Type.NUMBER, true),
          unit: valueSchema(Type.STRING, true),
          unitPrice: valueSchema(Type.NUMBER, true),
          lineTotal: valueSchema(Type.NUMBER, true),
        },
        required: ["description", "quantity", "unit", "unitPrice", "lineTotal"],
      },
    },
  },
  required: ["items"],
};

function valueSchema(type: Type, nullable = false) {
  return {
    type: Type.OBJECT,
    nullable,
    properties: {
      value: { type },
      evidence: {
        type: Type.OBJECT,
        properties: {
          page: { type: Type.INTEGER },
          sourceText: { type: Type.STRING },
        },
        required: ["page", "sourceText"],
      },
    },
    required: ["value", "evidence"],
  };
}
