import type {
  EngineeringDocumentCategory,
  EngineeringDocumentFormat,
  EngineeringDocumentRecord,
  RegisterDocumentInput,
} from "./types";

const FORMAT_FROM_EXTENSION: Record<string, EngineeringDocumentFormat> = {
  pdf: "pdf",
  doc: "word",
  docx: "word",
  xls: "excel",
  xlsx: "excel",
  csv: "excel",
  ppt: "powerpoint",
  pptx: "powerpoint",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  dwg: "cad-drawing",
  dxf: "cad-drawing",
  ifc: "bim",
  rvt: "bim",
  shp: "gis",
  kml: "gis",
};

const STANDARD_PATTERNS = [
  /\b(IS|IRC|IEC|ASTM|ISO|BS|NBC|MoRTH)\s*[\d:./-]+/gi,
  /\b(IS|IRC)\s+\d{3,4}(?:\s*\(\d{4}\))?/gi,
];

const CATEGORY_PATTERNS: Array<{
  category: EngineeringDocumentCategory;
  patterns: RegExp[];
}> = [
  { category: "drawing", patterns: [/drawing/i, /\bdwg\b/i, /layout/i, /plan\b/i] },
  { category: "specification", patterns: [/specification/i, /\bspec\b/i, /technical\s+spec/i] },
  { category: "report", patterns: [/report/i, /\bdpr\b/i, /feasibility/i] },
  { category: "contract", patterns: [/contract/i, /agreement/i] },
  { category: "tender", patterns: [/tender/i, /\brfp\b/i, /bid\b/i] },
  { category: "boq", patterns: [/\bboq\b/i, /bill\s+of\s+quantities/i, /schedule\s+of\s+rates/i] },
  { category: "method-statement", patterns: [/method\s+statement/i, /work\s+method/i] },
  { category: "inspection", patterns: [/inspection/i, /checklist/i, /test\s+report/i] },
  { category: "calculation", patterns: [/calculation/i, /design\s+sheet/i] },
  { category: "correspondence", patterns: [/letter/i, /correspondence/i, /minutes/i] },
];

export const inferDocumentFormat = (
  fileName: string,
  mimeType?: string
): EngineeringDocumentFormat => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (FORMAT_FROM_EXTENSION[extension]) {
    return FORMAT_FROM_EXTENSION[extension];
  }

  if (mimeType?.includes("pdf")) return "pdf";
  if (mimeType?.includes("word")) return "word";
  if (mimeType?.includes("sheet") || mimeType?.includes("excel")) return "excel";
  if (mimeType?.includes("presentation") || mimeType?.includes("powerpoint")) {
    return "powerpoint";
  }
  if (mimeType?.startsWith("image/")) return "image";

  return "unknown";
};

export const inferDocumentCategory = (
  fileName: string,
  contentPreview?: string
): EngineeringDocumentCategory => {
  const text = `${fileName} ${contentPreview ?? ""}`;

  for (const mapping of CATEGORY_PATTERNS) {
    if (mapping.patterns.some((pattern) => pattern.test(text))) {
      return mapping.category;
    }
  }

  return "general";
};

export const extractStandardsFromText = (text: string): string[] => {
  const found = new Set<string>();

  for (const pattern of STANDARD_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => found.add(match.trim().toUpperCase()));
    }
  }

  return Array.from(found).slice(0, 12);
};

export const extractKeywords = (
  fileName: string,
  contentPreview?: string
): string[] => {
  const text = `${fileName} ${contentPreview ?? ""}`.toLowerCase();
  const tokens = text
    .split(/[\s_./\-–—(),;:]+/)
    .filter((token) => token.length > 2 && !/^\d+$/.test(token));

  const engineeringTerms = tokens.filter((token) =>
    /^(concrete|steel|pavement|bridge|foundation|transformer|cable|boq|inspection|design|drawing|specification|tender|contract|highway|railway|solar|structural|geotechnical)$/.test(
      token
    )
  );

  return [...new Set([...engineeringTerms, ...tokens.slice(0, 8)])].slice(0, 12);
};

export const inferDrawingNumber = (text: string): string | null => {
  const match = text.match(
    /\b(?:dwg|drawing)\s*(?:no\.?|number|#)?\s*[:.]?\s*([A-Z0-9][\w./-]{2,20})/i
  );
  return match?.[1] ?? null;
};

export const inferProjectType = (text: string): string | null => {
  const normalized = text.toLowerCase();
  if (/expressway|highway|road/i.test(normalized)) return "highway";
  if (/building|g\+\d+/i.test(normalized)) return "building";
  if (/bridge/i.test(normalized)) return "bridge";
  if (/solar|pv/i.test(normalized)) return "solar";
  if (/metro|rail/i.test(normalized)) return "railway";
  if (/airport/i.test(normalized)) return "airport";
  if (/tender/i.test(normalized)) return "tender";
  return null;
};

export const buildDocumentRecord = (
  input: RegisterDocumentInput
): EngineeringDocumentRecord => {
  const now = Date.now();
  const id = crypto.randomUUID();
  const preview = input.contentPreview ?? "";
  const standardsReferenced = extractStandardsFromText(
    `${input.name} ${preview}`
  );
  const keywords = extractKeywords(input.name, preview);
  const category =
    input.category ?? inferDocumentCategory(input.name, preview);
  const format = input.format ?? inferDocumentFormat(input.name, input.mimeType);

  return {
    id,
    name: input.name.trim(),
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    category,
    projectIds: input.projectId ? [input.projectId] : [],
    projectNames: input.projectName ? [input.projectName] : [],
    workflowIds: [],
    version: "1.0",
    author: input.author ?? null,
    uploadDate: now,
    keywords,
    status: "indexed",
    format,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    contentPreview: preview.slice(0, 2000) || undefined,
    standardsReferenced,
    documentType: category.replace(/-/g, " "),
    projectType: inferProjectType(`${input.name} ${preview}`),
    drawingNumber: input.drawingNumber ?? inferDrawingNumber(`${input.name} ${preview}`),
    specificationSection: null,
    tags: [category, format, ...(input.disciplineName ? [input.disciplineName] : [])],
    latestVersionId: id,
    originalVersionId: id,
    updatedAt: now,
  };
};

export const parseUploadCommand = (
  message: string
): { fileName: string } | null => {
  const match = message.match(
    /^(?:upload|register|add)\s+document\s+(.+)$/i
  );
  if (!match) return null;
  return { fileName: match[1].trim() };
};
