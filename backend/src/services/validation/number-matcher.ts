const numericToken = /[-+]?\$?\s*\d[\d,]*(?:\.\d+)?/g;
export function extractNumbers(text: string): number[] {
  return [...text.matchAll(numericToken)]
    .map((m) => Number(m[0].replace(/[$,\s]/g, "")))
    .filter(Number.isFinite);
}
export function numberExistsInSource(value: number, source: string): boolean {
  return extractNumbers(source).some((n) => Math.abs(n - value) < 1e-9);
}
