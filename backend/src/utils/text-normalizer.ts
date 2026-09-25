export function normalizeText(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}
export function normalizeForEvidence(value: string): string {
  return normalizeText(value).replace(/\s+/g, " ").trim();
}
