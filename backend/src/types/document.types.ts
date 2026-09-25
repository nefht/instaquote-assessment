export type PageSource = "pdf-text" | "ocr";
export interface PageContent {
  page: number;
  text: string;
  source: PageSource;
}
export interface ParsedPage {
  page: number;
  text: string;
}
