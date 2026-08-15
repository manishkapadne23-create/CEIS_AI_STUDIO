export type EngineeringDocumentFormat =
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "image"
  | "cad-drawing"
  | "bim"
  | "gis"
  | "unknown";

export type EngineeringDocumentStatus =
  | "active"
  | "processing"
  | "indexed"
  | "archived"
  | "superseded";

export type EngineeringDocumentCategory =
  | "drawing"
  | "specification"
  | "report"
  | "contract"
  | "tender"
  | "boq"
  | "method-statement"
  | "inspection"
  | "calculation"
  | "correspondence"
  | "general";

export type DocumentChatIntent =
  | "explain-document"
  | "summarize-section"
  | "list-standards"
  | "extract-boq"
  | "find-discrepancies"
  | "missing-clauses"
  | "review-comments"
  | "meeting-notes"
  | "inspection-checklist"
  | "executive-summary"
  | "technical-summary"
  | "extract-specifications"
  | "extract-quantities"
  | "identify-risks"
  | "general-document-query";

export interface EngineeringDocumentRecord {
  id: string;
  name: string;
  disciplineId: string | null;
  disciplineName: string | null;
  category: EngineeringDocumentCategory;
  projectIds: string[];
  projectNames: string[];
  workflowIds: string[];
  version: string;
  author: string | null;
  uploadDate: number;
  keywords: string[];
  status: EngineeringDocumentStatus;
  format: EngineeringDocumentFormat;
  fileSize?: number;
  mimeType?: string;
  contentPreview?: string;
  standardsReferenced: string[];
  documentType: string;
  projectType: string | null;
  drawingNumber?: string | null;
  specificationSection?: string | null;
  tags: string[];
  latestVersionId: string;
  originalVersionId: string;
  updatedAt: number;
}

export interface DocumentVersionRecord {
  id: string;
  documentId: string;
  version: string;
  status: EngineeringDocumentStatus;
  uploadedAt: number;
  author: string | null;
  changeNote: string;
  isLatest: boolean;
  isSuperseded: boolean;
}

export interface DocumentLink {
  documentId: string;
  relatedId: string;
  relatedType:
    | "standard"
    | "calculator"
    | "professional-tool"
    | "template"
    | "report"
    | "workflow"
    | "topic";
  label: string;
}

export interface DocumentSearchOptions {
  query: string;
  disciplineId?: string | null;
  projectId?: string | null;
  category?: EngineeringDocumentCategory | null;
  standardNumber?: string | null;
  drawingNumber?: string | null;
  limit?: number;
}

export interface DocumentSearchResult {
  document: EngineeringDocumentRecord;
  score: number;
  matchedFields: string[];
}

export interface DocumentIntelligencePayload {
  activeDocuments: EngineeringDocumentRecord[];
  detectedIntent: DocumentChatIntent;
  linkedResources: DocumentLink[];
  versionSummary: string;
  analysisInstructions: string;
}

/** Future-ready extension hooks for OCR, BIM, GIS, contract/tender intelligence, PMIS. */
export interface DocumentIntelligenceExtensionHooks {
  ocrEnabled?: boolean;
  drawingIntelligenceEnabled?: boolean;
  bimIntegrationEnabled?: boolean;
  gisIntegrationEnabled?: boolean;
  contractIntelligenceEnabled?: boolean;
  tenderIntelligenceEnabled?: boolean;
  pmisDocumentId?: string | null;
}

export interface DocumentEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectId?: string | null;
  projectName?: string | null;
  activeDocumentIds?: string[];
}

export interface DocumentEngineResult {
  active: boolean;
  payload: DocumentIntelligencePayload | null;
  searchResults: DocumentSearchResult[];
  registeredDocument: EngineeringDocumentRecord | null;
  promptAugmentation: string;
  summaryText: string;
}

export interface RegisterDocumentInput {
  name: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  category?: EngineeringDocumentCategory;
  projectId?: string | null;
  projectName?: string | null;
  author?: string | null;
  contentPreview?: string;
  format?: EngineeringDocumentFormat;
  mimeType?: string;
  fileSize?: number;
  drawingNumber?: string | null;
}
