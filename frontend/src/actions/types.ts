import type { ChatMessageMetadata } from "../types/chatMessage";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type EngineeringOutputType =
  | "professional-report"
  | "executive-summary"
  | "technical-note"
  | "bullet-points"
  | "tabular-report"
  | "checklist"
  | "step-by-step-procedure"
  | "engineering-format";

export type EngineeringDeliverableType =
  | "report"
  | "checklist"
  | "boq"
  | "estimate"
  | "method-statement"
  | "inspection-format"
  | "technical-note"
  | "dpr-section"
  | "comparison-table"
  | "meeting-minutes"
  | "site-instructions"
  | "risk-assessment"
  | "material-specification"
  | "test-format"
  | "sop"
  | "tender-queries"
  | "contract-letter"
  | "technical-presentation"
  | "calculation-sheet";

export type ActionBarActionId =
  | "generate-pdf"
  | "copy"
  | "export-word"
  | "export-excel"
  | "share"
  | "save-workspace"
  | "continue-conversation"
  | "regenerate"
  | "translate"
  | "print"
  | "generate-deliverable";

export type ExportFormat = "pdf" | "docx" | "xlsx" | "csv" | "pptx";

export type WorkspaceSaveCategory =
  | "reports"
  | "calculations"
  | "documents"
  | "templates";

export interface EngineeringActionContext {
  messageId: string;
  content: string;
  conversationId: string;
  metadata?: ChatMessageMetadata;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  sessionTopic: string | null;
}

export interface EngineeringActionResult {
  success: boolean;
  message: string;
  followUpPrompt?: string;
  download?: {
    blob: Blob;
    filename: string;
  };
}

export interface GeneratedEngineeringOutput {
  title: string;
  deliverableType: EngineeringDeliverableType;
  outputType: EngineeringOutputType;
  content: string;
  disciplineName: string | null;
  generatedAt: number;
}

export interface SavedWorkspaceItem {
  id: string;
  category: WorkspaceSaveCategory;
  title: string;
  content: string;
  disciplineId: string | null;
  disciplineName: string | null;
  deliverableType?: EngineeringDeliverableType;
  outputType?: EngineeringOutputType;
  conversationId?: string;
  messageId?: string;
  createdAt: number;
  projectId?: string;
}

export interface ExportEngineRequest {
  content: string;
  title: string;
  format: ExportFormat;
  disciplineName?: string | null;
  outputType?: EngineeringOutputType;
}

export interface ExportEngineResult {
  success: boolean;
  format: ExportFormat;
  filename: string;
  blob: Blob;
  message: string;
  implementationStatus: "stub" | "ready";
}
