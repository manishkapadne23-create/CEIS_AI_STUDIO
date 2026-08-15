import type { EngineeringUserLanguage } from "../ai/contextEngine/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type ExperienceLevel =
  | "student"
  | "graduate"
  | "junior"
  | "mid"
  | "senior"
  | "expert";

export type LearningResourceType =
  | "faq"
  | "standard"
  | "calculator"
  | "professional-tool"
  | "document"
  | "workflow"
  | "learning-resource"
  | "module";

export type FeedbackType =
  | "rating"
  | "incorrect-information"
  | "suggestion"
  | "engineering-feedback"
  | "feature-request";

export type KnowledgeEvolutionStatus =
  | "new"
  | "updated"
  | "retired"
  | "active";

export interface UsageRecord {
  id: string;
  type: LearningResourceType;
  resourceId: string;
  label: string;
  disciplineId: string | null;
  moduleId: WorkspaceCategoryId | null;
  count: number;
  lastUsedAt: number;
}

export interface UserLearningProfile {
  disciplineId: string | null;
  disciplineName: string | null;
  specialization: string | null;
  experienceLevel: ExperienceLevel;
  favouriteModules: WorkspaceCategoryId[];
  preferredStandards: string[];
  frequentlyUsedTools: string[];
  preferredLanguage: EngineeringUserLanguage;
  recentActivities: string[];
  updatedAt: number;
}

export interface FeedbackRecord {
  id: string;
  type: FeedbackType;
  message: string;
  rating?: number;
  conversationId: string | null;
  disciplineId: string | null;
  timestamp: number;
}

export interface TrendingItem {
  id: string;
  label: string;
  type: LearningResourceType;
  count: number;
  trend: "rising" | "stable" | "declining";
}

export interface KnowledgeEvolutionEntry {
  id: string;
  title: string;
  type: LearningResourceType;
  status: KnowledgeEvolutionStatus;
  version: string;
  updatedAt: number;
  note: string;
}

export interface AdminDashboardSnapshot {
  mostUsedModules: Array<{ moduleId: string; count: number }>;
  mostActiveDisciplines: Array<{ disciplineId: string; count: number }>;
  knowledgeGaps: string[];
  mostRequestedFeatures: string[];
  aiPerformanceScore: number;
  userSatisfactionScore: number;
  totalInteractions: number;
}

export interface PersonalizationBundle {
  recommendedStandards: string[];
  recommendedCalculators: string[];
  recommendedTools: string[];
  recommendedWorkflows: string[];
  recommendedLearning: string[];
  recommendedModules: WorkspaceCategoryId[];
}

/** Future-ready hooks for federated learning, enterprise/PMIS analytics, model optimization. */
export interface IntelligenceExtensionHooks {
  federatedLearningEnabled?: boolean;
  enterpriseKnowledgeId?: string | null;
  pmisAnalyticsId?: string | null;
  institutionAnalyticsId?: string | null;
  corporateAnalyticsId?: string | null;
  aiModelOptimizationEnabled?: boolean;
}

export interface IntelligenceEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId: WorkspaceCategoryId | null;
  sessionTopic?: string | null;
  orchestratorIntent?: string | null;
  language?: EngineeringUserLanguage;
}

export interface IntelligenceEngineResult {
  profile: UserLearningProfile;
  personalization: PersonalizationBundle;
  trending: TrendingItem[];
  adminSnapshot: AdminDashboardSnapshot;
  feedbackHandled: FeedbackRecord | null;
  promptAugmentation: string;
  summaryText: string;
}

export interface RecordInteractionInput {
  userMessage: string;
  assistantPreview: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  sessionTopic?: string | null;
  standardsUsed?: string[];
  calculatorsUsed?: string[];
  workflowsUsed?: string[];
}
