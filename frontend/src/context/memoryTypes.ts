import type {
  EngineeringSubscriptionPlan,
  EngineeringUserLanguage,
} from "../ai/contextEngine/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

/** Record of an engineering calculation performed in-session. */
export interface EngineeringCalculationRecord {
  id: string;
  label: string;
  disciplineId: string | null;
  moduleId: WorkspaceCategoryId | null;
  conversationId: string;
  timestamp: number;
}

/** Snapshot of a prior AI response for continuity. */
export interface EngineeringResponseRecord {
  id: string;
  conversationId: string;
  userMessage: string;
  assistantSummary: string;
  disciplineId: string | null;
  moduleId: WorkspaceCategoryId | null;
  topic: string | null;
  timestamp: number;
}

/** Accumulated engineering project context within a session. */
export interface EngineeringProjectContext {
  projectType: string | null;
  disciplineId: string | null;
  disciplineName: string | null;
  location: string | null;
  standardsUsed: string[];
  materials: string[];
  calculations: EngineeringCalculationRecord[];
  previousResponses: EngineeringResponseRecord[];
  uploadedDocuments: string[];
  extractedTopics: string[];
}

export const createEmptyProjectContext = (): EngineeringProjectContext => ({
  projectType: null,
  disciplineId: null,
  disciplineName: null,
  location: null,
  standardsUsed: [],
  materials: [],
  calculations: [],
  previousResponses: [],
  uploadedDocuments: [],
  extractedTopics: [],
});

/** Per-module state remembered independently within a discipline. */
export interface ModuleSessionSnapshot {
  moduleId: WorkspaceCategoryId;
  searchQuery: string;
  selectedStandardCode: string | null;
  activeCalculatorId: string | null;
  activeDocumentIds: string[];
  recentQueries: string[];
  lastActiveAt: number;
}

export const createEmptyModuleSnapshot = (
  moduleId: WorkspaceCategoryId
): ModuleSessionSnapshot => ({
  moduleId,
  searchQuery: "",
  selectedStandardCode: null,
  activeCalculatorId: null,
  activeDocumentIds: [],
  recentQueries: [],
  lastActiveAt: Date.now(),
});

/** Full discipline session snapshot for restore on return. */
export interface DisciplineSessionSnapshot {
  disciplineId: string;
  disciplineName: string;
  topic: string | null;
  projectContext: EngineeringProjectContext;
  moduleSnapshots: Partial<Record<WorkspaceCategoryId, ModuleSessionSnapshot>>;
  conversationId: string | null;
  lastActiveAt: number;
}

/** Active engineering session managed by sessionManager. */
export interface EngineeringSessionState {
  sessionId: string;
  currentDisciplineId: string | null;
  currentDisciplineName: string | null;
  currentModuleId: WorkspaceCategoryId | null;
  currentTopic: string | null;
  currentConversationId: string | null;
  activeStandardCodes: string[];
  activeCalculatorId: string | null;
  activeDocumentIds: string[];
  language: EngineeringUserLanguage;
  subscriptionPlan: EngineeringSubscriptionPlan;
  projectContext: EngineeringProjectContext;
  startedAt: number;
  lastActivityAt: number;
}

/** Conversation-level memory for smart follow-ups. */
export interface ConversationMemoryState {
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  topic: string | null;
  lastUserMessage: string | null;
  lastAssistantSummary: string | null;
  followUpChainCount: number;
  turnCount: number;
  updatedAt: number;
}

/** Future-ready extension hooks (RAG, vector DB, PMIS, multi-agent). */
export interface EngineeringMemoryExtensionHooks {
  ragDocumentIds?: string[];
  vectorStoreNamespace?: string;
  drawingMemoryIds?: string[];
  pmisProjectId?: string | null;
  agentSessionId?: string | null;
}

/** Assembled context payload for the AI reasoning pipeline. */
export interface LoadedEngineeringContext {
  session: EngineeringSessionState;
  conversation: ConversationMemoryState | null;
  disciplineSnapshot: DisciplineSessionSnapshot | null;
  moduleSnapshot: ModuleSessionSnapshot | null;
  memorySummary: string;
  extensions: EngineeringMemoryExtensionHooks;
}
