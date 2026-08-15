import type { EngineeringUserLanguage } from "../ai/contextEngine/types";
import type { EngineeringSubscriptionPlan } from "../ai/contextEngine/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { DisciplineSessionSnapshot, EngineeringSessionState } from "../context/memoryTypes";

export type MemoryType =
  | "conversation"
  | "engineering"
  | "project"
  | "document"
  | "standard"
  | "calculator"
  | "workflow"
  | "learning"
  | "preference";

export type MemorySearchCategory =
  | "projects"
  | "documents"
  | "standards"
  | "conversations"
  | "reports"
  | "calculations"
  | "workflows";

export interface UserMemorySnapshot {
  primaryDisciplineId: string | null;
  primaryDisciplineName: string | null;
  secondaryDisciplineId: string | null;
  secondaryDisciplineName: string | null;
  preferredStandards: string[];
  preferredUnits: string;
  favouriteTools: string[];
  frequentlyUsedCalculators: string[];
  preferredLanguage: EngineeringUserLanguage;
  subscriptionPlan: EngineeringSubscriptionPlan;
}

export interface ContextMemorySnapshot {
  lastWorkspaceRoute: string | null;
  lastConversationId: string | null;
  lastDisciplineId: string | null;
  lastModuleId: WorkspaceCategoryId | null;
  lastTopic: string | null;
  sessionState: EngineeringSessionState | null;
  disciplineSnapshots: DisciplineSessionSnapshot[];
  updatedAt: number;
}

export interface EngineeringMemorySnapshot {
  recentStandards: string[];
  recentClauses: string[];
  recentCalculations: string[];
  recentTemplates: string[];
  recentReports: string[];
  recentDecisions: string[];
  recentWorkflows: string[];
  updatedAt: number;
}

export interface MemorySearchResult {
  id: string;
  category: MemorySearchCategory;
  title: string;
  description: string;
  timestamp: number;
  route?: string;
  resourceId?: string;
}

export interface SmartRecallIntent {
  type:
    | "continue-discussion"
    | "show-calculation"
    | "open-report"
    | "restore-workflow"
    | "find-recommendation"
    | "general-recall";
  query: string;
  matchedResults: MemorySearchResult[];
}

export interface EngineeringMemoryInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId?: WorkspaceCategoryId | null;
}

export interface EngineeringMemoryResult {
  active: boolean;
  recallIntent: SmartRecallIntent | null;
  userMemory: UserMemorySnapshot | null;
  contextMemory: ContextMemorySnapshot | null;
  engineeringMemory: EngineeringMemorySnapshot | null;
  searchResults: MemorySearchResult[];
  restoredContextSummary: string;
  promptAugmentation: string;
  summaryText: string;
}

export interface MemoryExportBundle {
  exportedAt: number;
  userId: string;
  userMemory: UserMemorySnapshot;
  contextMemory: ContextMemorySnapshot;
  engineeringMemory: EngineeringMemorySnapshot;
  version: string;
}

export interface MemorySecurityConfig {
  encryptionEnabled: boolean;
  userScoped: boolean;
  gdprReady: boolean;
  deletionSupported: boolean;
}

export interface EngineeringMemoryCapabilities {
  enterpriseMemory: boolean;
  institutionMemory: boolean;
  pmisProjectMemory: boolean;
  crossDeviceSync: boolean;
  offlineMemory: boolean;
}

export const MEMORY_SECURITY_CONFIG: MemorySecurityConfig = {
  encryptionEnabled: true,
  userScoped: true,
  gdprReady: true,
  deletionSupported: true,
};

export const ENGINEERING_MEMORY_CAPABILITIES: EngineeringMemoryCapabilities = {
  enterpriseMemory: false,
  institutionMemory: false,
  pmisProjectMemory: false,
  crossDeviceSync: false,
  offlineMemory: false,
};
