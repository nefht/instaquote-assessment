# InstaQuote Document Extractor

A small full-stack take-home implementation for extracting construction-supply line items from PDFs while preserving evidence and refusing unsupported values.

## Live Demo

- Frontend: https://instaquote-extractor.vercel.app
- API: https://instaquote-api.onrender.com

## Architecture

`PDF -> PDF.js text extraction -> OCR fallback -> Gemini candidate extraction -> deterministic evidence validation -> conservative contradiction checks -> items + refusals -> React UI`

Gemini is used to identify line items across different document layouts, but its output is not accepted directly. Each extracted field is checked against the cited source text before it is included in the result. If a numeric value cannot be verified from the source, it is refused rather than inferred.

## Stack

- Frontend: React 19, TypeScript, Vite, Lucide, custom CSS
- Backend: Node.js, Express, TypeScript
- PDF: `pdfjs-dist`
- PDF page rendering: `@napi-rs/canvas`
- OCR fallback: `tesseract.js`
- Structured extraction: Gemini via `@google/genai`
- Runtime schemas: Zod
- Tests: Vitest
- Persistence: intentionally none; PDFs are processed in memory and discarded

## Run locally

Requires Node.js 20+ and a Gemini API key.

```bash
npm install

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Put GEMINI_API_KEY in backend/.env
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:3001

Run tests and build:

```bash
npm test
npm run build
```

## API

`POST /api/extract` with `multipart/form-data`, field name `file`.

A refusal is a successful domain outcome, not an HTTP error. The API can return both verified items and refusals in the same `200` response. Upload/protocol failures use HTTP errors.

## OCR and evidence limitation

For text PDFs, evidence is verified against text extracted directly by PDF.js. For scanned pages, evidence is verified against OCR text.

This prevents Gemini hallucinations relative to OCR output, but it cannot prove that OCR itself read every glyph correctly. The response therefore preserves whether evidence came from `pdf-text` or `ocr`.

## Questions

### Hardest decision

The hardest decision was deciding how much to trust the LLM output. Gemini is useful for extracting line items from documents with different layouts, but it may also infer values that are not explicitly present in the source.

I therefore treat Gemini output as candidate data only. Each extracted field is validated against its cited page and source text before it is included in the verified result. If a numeric value cannot be found in its evidence, it is refused rather than inferred.

### Where I am not confident

I am still unsure how far contradiction detection should go without domain-specific rules. Two values can both have valid evidence but still require business context to determine whether they actually conflict.

For this implementation, I kept contradiction detection conservative rather than introducing assumptions that are not defined by the task.

### With three more days

I would improve OCR evidence provenance so evidence from scanned pages could be traced back to a specific region of the original PDF.

I would also improve handling of external API failures and timeouts while keeping the rule that unsupported values are refused rather than inferred.
