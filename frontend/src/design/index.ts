export type {
  DesignCategory,
  DesignDisciplineId,
  DesignExtensionHooks,
  DesignReport,
  DesignRevision,
  DesignSearchQuery,
  DesignSearchResult,
  DesignSession,
  DesignStep,
  DesignStepId,
  DesignTemplate,
  DesignValidationResult,
  DesignWizardInput,
  DesignWizardResult,
} from "./types";

export {
  DESIGN_PROCESS_STEPS,
  DESIGN_TEMPLATES,
  DISCIPLINES,
  findDesignTemplate,
  formatLibrarySummary,
  getDesignTemplate,
  listTemplatesForDiscipline,
  resolveCategoryFromText,
} from "./designTemplates";

export {
  addFavoriteDesign,
  addRevision,
  advanceDesignStep,
  getActiveDesignSession,
  getDesignSession,
  getFavoriteDesigns,
  getRecentDesigns,
  getSavedDesigns,
  pauseDesignSession,
  saveDesignSession,
  startDesignSession,
  updateStepData,
} from "./designHistory";

export {
  formatValidationForPrompt,
  getDesignLimitations,
  validateDesignSession,
} from "./designValidator";

export {
  buildDesignReport,
  buildProgressSummary,
  formatDesignReportForPrompt,
} from "./designReports";

export {
  captureStepInput,
  formatStepGuidance,
  getActiveDesignContext,
  getCurrentDesignStep,
  startDesign,
  suggestMissingInputs,
} from "./designEngine";

export {
  formatDesignWizardForPrompt,
  getDesignExtensionHooks,
  runDesignWizard,
  setDesignExtensionHooks,
} from "./designWizard";
