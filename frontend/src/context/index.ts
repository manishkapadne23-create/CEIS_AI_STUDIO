export type {
  ConversationMemoryState,
  DisciplineSessionSnapshot,
  EngineeringCalculationRecord,
  EngineeringMemoryExtensionHooks,
  EngineeringProjectContext,
  EngineeringResponseRecord,
  EngineeringSessionState,
  LoadedEngineeringContext,
  ModuleSessionSnapshot,
} from "./memoryTypes";

export {
  bindConversationToDiscipline,
  clearConversationMemory,
  ensureConversationMemory,
  extractAssistantSummary,
  getConversationMemory,
  inferTopicFromMessage,
  listConversationMemories,
  recordConversationTurn,
  resetConversationMemoryStore,
} from "./conversationMemory";

export {
  ensureDisciplineSnapshot,
  getDisciplineModuleSnapshot,
  getDisciplineSnapshot,
  listDisciplineSnapshots,
  resetDisciplineMemoryStore,
  restoreDisciplineContext,
  saveDisciplineContext,
  updateDisciplineProjectContext,
  updateDisciplineTopic,
} from "./disciplineMemory";

export {
  clearModuleMemory,
  getModuleSnapshot,
  updateModuleMemory,
} from "./moduleMemory";

export {
  formatHistorySummary,
  getRecentResponses,
  recordEngineeringHistoryTurn,
  registerUploadedDocument,
} from "./historyManager";

export {
  bindEngineeringConversation,
  clearEngineeringSession,
  getEngineeringSession,
  recordEngineeringMessageTurn,
  resetEngineeringSessionManager,
  switchEngineeringDiscipline,
  switchEngineeringModule,
} from "./sessionManager";

export {
  formatLoadedContextForPrompt,
  loadEngineeringContext,
} from "./contextLoader";
export type { LoadEngineeringContextInput } from "./contextLoader";

export { createEmptyProjectContext, createEmptyModuleSnapshot } from "./memoryTypes";
