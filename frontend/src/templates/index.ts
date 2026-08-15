export type {
  DocumentGenerationInput,
  DocumentTypeId,
  EngineeringTemplate,
  GeneratedDocument,
  RevisionEntry,
  TemplateCategory,
  TemplateDisciplineId,
  TemplateEngineInput,
  TemplateEngineResult,
  TemplateExportFormat,
  TemplateExtensionHooks,
  TemplateSearchQuery,
  TemplateSearchResult,
} from "./types";

export {
  DISCIPLINES,
  DOCUMENT_TYPES,
  TEMPLATE_LIBRARY,
  findTemplateByTitle,
  formatLibrarySummaryForPrompt,
  getTemplateById,
  listTemplatesForDiscipline,
  resolveDocumentTypeFromText,
} from "./templateLibrary";

export {
  addFavoriteTemplate,
  favoriteTemplateByTitle,
  formatSearchResultsForPrompt,
  getFavoriteTemplates,
  getRecentlyUsedTemplates,
  isTemplateQuery,
  listTemplatesForCurrentDiscipline,
  recordTemplateUsage,
  searchFromMessage,
  searchTemplates,
} from "./templateSearch";

export {
  assembleDocument,
  buildDocumentFooter,
  buildDocumentHeader,
  buildRevisionHistory,
  buildTableOfContents,
  formatDocumentPreview,
} from "./reportBuilder";

export {
  formatGenerationSummary,
  generateDocument,
  getGeneratedDocument,
  getLatestGeneratedDocument,
  listGeneratedDocuments,
} from "./documentGenerator";

export {
  exportDocument,
  formatExportOptionsForPrompt,
  resolveExportFormat,
  triggerDocumentDownload,
  type TemplateExportResult,
} from "./exportEngine";

export {
  formatTemplateForPrompt,
  getTemplateExtensionHooks,
  runTemplateEngine,
  setTemplateExtensionHooks,
} from "./templateEngine";
