export type {
  DocumentChatIntent,
  DocumentEngineInput,
  DocumentEngineResult,
  DocumentIntelligenceExtensionHooks,
  DocumentIntelligencePayload,
  DocumentLink,
  DocumentSearchOptions,
  DocumentSearchResult,
  DocumentVersionRecord,
  EngineeringDocumentCategory,
  EngineeringDocumentFormat,
  EngineeringDocumentRecord,
  EngineeringDocumentStatus,
  RegisterDocumentInput,
} from "./types";

export {
  buildDocumentRecord,
  extractKeywords,
  extractStandardsFromText,
  inferDocumentCategory,
  inferDocumentFormat,
  parseUploadCommand,
} from "./documentParser";

export {
  deleteDocument,
  getActiveDocuments,
  getDocument,
  getDocumentMemorySummary,
  getDocumentsByDiscipline,
  getDocumentsByProject,
  linkDocumentToProject,
  linkDocumentToWorkflow,
  listDocuments,
  saveDocument,
} from "./documentMemory";

export {
  searchByDocumentName,
  searchByDrawingNumber,
  searchByKeyword,
  searchByProject,
  searchByStandardNumber,
  searchDocuments,
} from "./documentSearch";

export {
  formatDocumentLinksForPrompt,
  linkDocumentToResources,
} from "./documentLinker";

export {
  buildDocumentAnalysisPrompt,
  detectDocumentChatIntent,
  getAnalysisInstructions,
  isDocumentIntelligenceQuery,
} from "./documentSummarizer";

export {
  createDocumentRevision,
  formatVersionSummary,
  getDocumentVersionHistory,
  getLatestDocumentVersion,
  markDocumentSuperseded,
  recordDocumentVersion,
} from "./documentVersioning";

export {
  formatDocumentIntelligenceForPrompt,
  getDocumentIntelligenceExtensionHooks,
  runDocumentIntelligenceEngine,
  setDocumentIntelligenceExtensionHooks,
} from "./documentEngine";
