export type TemplateDisciplineId =
  | "civil-engineering"
  | "mechanical-engineering"
  | "electrical-engineering"
  | "computer-engineering"
  | "electronics-telecommunication-engineering"
  | "chemical-engineering"
  | "environmental-engineering"
  | "mining-engineering"
  | "marine-engineering"
  | "railway-engineering"
  | "aerospace-engineering"
  | "industrial-engineering"
  | "automation-robotics"
  | "renewable-energy"
  | "architecture-planning"
  | "agricultural-engineering"
  | "oil-gas-engineering"
  | "biomedical-engineering";

export type DocumentTypeId =
  | "technical-report"
  | "inspection-report"
  | "site-visit-report"
  | "survey-report"
  | "investigation-report"
  | "design-report"
  | "calculation-sheet"
  | "method-statement"
  | "work-procedure"
  | "quality-plan"
  | "inspection-checklist"
  | "safety-checklist"
  | "risk-assessment"
  | "boq"
  | "estimate"
  | "material-approval"
  | "vendor-evaluation"
  | "meeting-minutes"
  | "technical-note"
  | "project-proposal"
  | "consultancy-proposal"
  | "presentation-summary"
  | "training-material"
  | "technical-sop";

export type TemplateCategory =
  | "report"
  | "checklist"
  | "planning"
  | "commercial"
  | "communication"
  | "proposal"
  | "calculation"
  | "procedure";

export type TemplateExportFormat =
  | "word"
  | "pdf"
  | "excel"
  | "markdown"
  | "print-ready";

export interface EngineeringTemplate {
  id: string;
  title: string;
  documentTypeId: DocumentTypeId;
  documentTypeName: string;
  disciplineId: TemplateDisciplineId;
  disciplineName: string;
  category: TemplateCategory;
  description: string;
  sections: string[];
  standardsHints: string[];
  usageCount: number;
}

export interface TemplateSearchQuery {
  keyword?: string;
  disciplineId?: string | null;
  category?: TemplateCategory;
  documentTypeId?: DocumentTypeId;
  favoritesOnly?: boolean;
  recentlyUsedOnly?: boolean;
  limit?: number;
}

export interface TemplateSearchResult {
  query: TemplateSearchQuery;
  templates: EngineeringTemplate[];
  totalCount: number;
}

export interface RevisionEntry {
  revision: string;
  date: string;
  author: string;
  description: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  documentType: string;
  content: string;
  tableOfContents: string[];
  revisionHistory: RevisionEntry[];
  references: string[];
  annexures: string[];
  generatedAt: number;
  projectName: string | null;
  standardsUsed: string[];
}

export interface DocumentGenerationInput {
  template: EngineeringTemplate;
  userInputs: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
  standards: string[];
  calculations: string[];
}

export interface TemplateEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
  selectedStandardCode: string | null;
}

export interface TemplateEngineResult {
  active: boolean;
  searchResult: TemplateSearchResult | null;
  generatedDocument: GeneratedDocument | null;
  templateAction: string | null;
  exportAction: string | null;
  promptAugmentation: string;
  summaryText: string;
}

export interface TemplateExtensionHooks {
  pmisReportTemplateId?: string | null;
  tenderDocumentTemplateId?: string | null;
  contractDocumentTemplateId?: string | null;
  governmentFormatId?: string | null;
  clientTemplateId?: string | null;
}
