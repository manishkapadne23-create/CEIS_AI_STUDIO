import type { GeneratedDocument, TemplateExportFormat } from "./types";

const MIME_TYPES: Record<TemplateExportFormat, string> = {
  word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pdf: "application/pdf",
  excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  markdown: "text/markdown",
  "print-ready": "text/plain",
};

const FILE_EXTENSIONS: Record<TemplateExportFormat, string> = {
  word: "docx",
  pdf: "pdf",
  excel: "xlsx",
  markdown: "md",
  "print-ready": "txt",
};

const sanitizeFilename = (title: string): string =>
  title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
    .toLowerCase() || "sarathi-document";

export interface TemplateExportResult {
  success: boolean;
  format: TemplateExportFormat;
  filename: string;
  blob: Blob;
  message: string;
}

export const exportDocument = (
  document: GeneratedDocument,
  format: TemplateExportFormat
): TemplateExportResult => {
  const filename = `${sanitizeFilename(document.title)}.${FILE_EXTENSIONS[format]}`;
  const blob = buildExportBlob(document, format);

  return {
    success: true,
    format,
    filename,
    blob,
    message: `${format.toUpperCase()} export prepared for "${document.title}".`,
  };
};

const buildExportBlob = (
  document: GeneratedDocument,
  format: TemplateExportFormat
): Blob => {
  switch (format) {
    case "markdown":
      return new Blob([document.content], { type: MIME_TYPES.markdown });
    case "excel":
      return new Blob([buildExcelContent(document)], {
        type: MIME_TYPES.excel,
      });
    case "print-ready":
      return new Blob([buildPrintReadyContent(document)], {
        type: MIME_TYPES["print-ready"],
      });
    case "word":
      return new Blob([buildWordWrapper(document)], { type: MIME_TYPES.word });
    case "pdf":
    default:
      return new Blob([buildPdfWrapper(document)], { type: "text/plain" });
  }
};

const buildPrintReadyContent = (document: GeneratedDocument): string =>
  [
    document.content,
    "",
    "─".repeat(60),
    "PRINT READY — Sarathi AI Engineering Documentation",
    `Generated: ${new Date(document.generatedAt).toISOString()}`,
    "Page breaks and margins to be applied by print engine.",
  ].join("\n");

const buildWordWrapper = (document: GeneratedDocument): string =>
  [
    "SARATHI AI — WORD EXPORT",
    `Title: ${document.title}`,
    `Type: ${document.documentType}`,
    `Discipline: ${document.disciplineName ?? "Engineering"}`,
    "",
    "Replace with native DOCX renderer (docx library).",
    "",
    document.content,
  ].join("\n");

const buildPdfWrapper = (document: GeneratedDocument): string =>
  [
    "SARATHI AI — PDF EXPORT",
    `Title: ${document.title}`,
    `Type: ${document.documentType}`,
    "",
    "Replace with native PDF renderer (pdfmake / puppeteer).",
    "",
    document.content,
  ].join("\n");

const buildExcelContent = (document: GeneratedDocument): string => {
  const rows = [
    ["Section", "Content"],
    ["Title", document.title],
    ["Document Type", document.documentType],
    ["Discipline", document.disciplineName ?? ""],
    ["Generated", new Date(document.generatedAt).toISOString()],
    ...document.tableOfContents.map((section, i) => [
      `Section ${i + 1}`,
      section,
    ]),
  ];
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
};

const escapeCsvCell = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const resolveExportFormat = (
  text: string
): TemplateExportFormat | null => {
  if (/\bword|docx\b/i.test(text)) return "word";
  if (/\bpdf\b/i.test(text)) return "pdf";
  if (/\bexcel|xlsx\b/i.test(text)) return "excel";
  if (/\bmarkdown|md\b/i.test(text)) return "markdown";
  if (/\bprint[\s-]?ready\b/i.test(text)) return "print-ready";
  return null;
};

export const formatExportOptionsForPrompt = (): string =>
  [
    "EXPORT FORMATS:",
    "- Word (.docx) | PDF | Excel (.xlsx) | Markdown (.md) | Print Ready",
    "Command: Export as PDF | Export as Word | Export as Markdown",
  ].join("\n");

export const triggerDocumentDownload = (
  blob: Blob,
  filename: string
): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
