import type { ExportEngineRequest, ExportEngineResult, ExportFormat } from "./types";

const MIME_TYPES: Record<ExportFormat, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

const FILE_EXTENSIONS: Record<ExportFormat, string> = {
  pdf: "pdf",
  docx: "docx",
  xlsx: "xlsx",
  csv: "csv",
  pptx: "pptx",
};

const sanitizeFilename = (title: string): string =>
  title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
    .toLowerCase() || "sarathi-export";

/**
 * Export engine facade — architecture ready for PDF/DOCX/XLSX/CSV/PPTX backends.
 * Current implementation produces structured placeholder files for each format.
 */
export const exportEngineeringContent = (
  request: ExportEngineRequest
): ExportEngineResult => {
  const filename = `${sanitizeFilename(request.title)}.${FILE_EXTENSIONS[request.format]}`;
  const blob = buildExportBlob(request);

  return {
    success: true,
    format: request.format,
    filename,
    blob,
    message: `${request.format.toUpperCase()} export prepared (stub renderer — replace with native ${request.format} engine).`,
    implementationStatus: "stub",
  };
};

const buildExportBlob = (request: ExportEngineRequest): Blob => {
  switch (request.format) {
    case "csv":
      return new Blob([buildCsvContent(request.content, request.title)], {
        type: MIME_TYPES.csv,
      });
    case "xlsx":
      return new Blob([buildCsvContent(request.content, request.title)], {
        type: MIME_TYPES.xlsx,
      });
    case "docx":
      return new Blob([buildPlainTextWrapper(request, "DOCX")], {
        type: MIME_TYPES.docx,
      });
    case "pptx":
      return new Blob([buildPlainTextWrapper(request, "PPTX")], {
        type: MIME_TYPES.pptx,
      });
    case "pdf":
    default:
      return new Blob([buildPlainTextWrapper(request, "PDF")], {
        type: "text/plain",
      });
  }
};

const buildPlainTextWrapper = (
  request: ExportEngineRequest,
  formatLabel: string
): string => {
  return [
    `SARATHI AI — ${formatLabel} EXPORT (STUB)`,
    `Title: ${request.title}`,
    `Discipline: ${request.disciplineName ?? "Engineering"}`,
    `Output Type: ${request.outputType ?? "engineering-format"}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    "Replace this stub with a native renderer (e.g. pdfmake, docx, sheetjs, pptxgenjs).",
    "",
    "─".repeat(60),
    "",
    request.content,
  ].join("\n");
};

const buildCsvContent = (content: string, title: string): string => {
  const rows = [
    ["Section", "Content"],
    ["Title", title],
    ["Generated", new Date().toISOString()],
    ["Body", content.replace(/\n/g, " ").slice(0, 2000)],
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
};

const escapeCsvCell = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportAsPdf = (
  request: Omit<ExportEngineRequest, "format">
): ExportEngineResult =>
  exportEngineeringContent({ ...request, format: "pdf" });

export const exportAsDocx = (
  request: Omit<ExportEngineRequest, "format">
): ExportEngineResult =>
  exportEngineeringContent({ ...request, format: "docx" });

export const exportAsXlsx = (
  request: Omit<ExportEngineRequest, "format">
): ExportEngineResult =>
  exportEngineeringContent({ ...request, format: "xlsx" });

export const exportAsCsv = (
  request: Omit<ExportEngineRequest, "format">
): ExportEngineResult =>
  exportEngineeringContent({ ...request, format: "csv" });

export const exportAsPptx = (
  request: Omit<ExportEngineRequest, "format">
): ExportEngineResult =>
  exportEngineeringContent({ ...request, format: "pptx" });

export const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
