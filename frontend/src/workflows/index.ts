export type {
  ActiveWorkflowContext,
  WorkflowAIAssistanceType,
  WorkflowAssistantRequest,
  WorkflowAssistantResult,
  WorkflowAutomationEngineInput,
  WorkflowAutomationEngineResult,
  WorkflowCategoryId,
  WorkflowEngineSummary,
  WorkflowExtensionHooks,
  WorkflowProgressRecord,
  WorkflowProgressStatus,
  WorkflowStepActivity,
  WorkflowTemplate,
} from "./types";

export {
  getWorkflowTemplate,
  getWorkflowsForDiscipline,
  listAllWorkflowTemplates,
  listDisciplineIdsWithWorkflows,
  resolveWorkflowFromMessage,
  searchWorkflows,
} from "./workflowRegistry";

export {
  ALL_WORKFLOW_TEMPLATES,
  buildWorkflowTemplate,
  civilWorkflowTemplates,
  computerWorkflowTemplates,
  disciplineCatalogWorkflowTemplates,
  electricalWorkflowTemplates,
  formatWorkflowTemplateSummary,
  mechanicalWorkflowTemplates,
} from "./workflowTemplates";

export {
  completeWorkflowStep,
  getActiveWorkflowProgress,
  getProgressForWorkflow,
  getWorkflowProgress,
  listWorkflowProgress,
  saveWorkflowProgressToWorkspace,
  setActiveWorkflowProgress,
  startWorkflowProgress,
  updateWorkflowProgressStatus,
} from "./workflowProgress";

export {
  buildWorkflowAssistantPrompt,
  detectWorkflowAssistanceIntent,
  detectWorkflowControlIntent,
  formatWorkflowGuidanceSummary,
} from "./workflowAssistant";

export {
  advanceWorkflowStep,
  buildWorkflowEngineSummary,
  completeActiveWorkflow,
  getActiveWorkflowContext,
  handleWorkflowMessage,
  markContinueLater,
  pauseActiveWorkflow,
  restartActiveWorkflow,
  resumeActiveWorkflow,
  setWorkflowExtensionHooks,
  getWorkflowExtensionHooks,
  startWorkflow,
  startWorkflowFromMessage,
} from "./workflowEngine";

export {
  formatLibrarySummaryForPrompt,
  formatWorkflowStructureForPrompt,
  getLibraryStats,
  getWorkflowLibrary,
  getWorkflowsByCategory,
  listDisciplinesWithWorkflows,
  WORKFLOW_CATEGORIES,
} from "./workflowLibrary";

export {
  appendProgressNotes,
  formatStepGuidance,
  getNextActionRecommendation,
  restartWorkflowById,
  suggestCalculatorsForStep,
  suggestReportsForStep,
  suggestStandardsForStep,
  suggestTemplatesForStep,
} from "./workflowRunner";

export {
  bookmarkWorkflow,
  bookmarkWorkflowByTitle,
  getBookmarkedWorkflows,
  shareWorkflow,
  shareWorkflowByTitle,
} from "./workflowTracker";

export {
  formatSearchResultsForPrompt,
  isWorkflowAutomationQuery,
  searchFromMessage,
  searchWorkflowCatalog,
  type WorkflowSearchQuery,
  type WorkflowSearchResult,
} from "./workflowSearch";

export {
  buildCompletedChecklist,
  buildPendingActions,
  buildProgressSummary,
  buildWorkflowReport,
  formatWorkflowReportForPrompt,
  type WorkflowReport,
} from "./workflowReports";

export {
  formatWorkflowAutomationForPrompt,
  runWorkflowAutomationEngine,
} from "./workflowAutomationEngine";
