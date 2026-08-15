export type {
  AdminDashboardSnapshot,
  ExperienceLevel,
  FeedbackRecord,
  FeedbackType,
  IntelligenceEngineInput,
  IntelligenceEngineResult,
  IntelligenceExtensionHooks,
  KnowledgeEvolutionEntry,
  KnowledgeEvolutionStatus,
  LearningResourceType,
  PersonalizationBundle,
  RecordInteractionInput,
  TrendingItem,
  UsageRecord,
  UserLearningProfile,
} from "./types";

export {
  getAllUsageRecords,
  getFrequentByType,
  getTotalInteractions,
  recordInteraction,
} from "./learningEngine";

export {
  formatProfileForPrompt,
  getUserLearningProfile,
  inferExperienceLevel,
  syncProfileFromSession,
  updateUserLearningProfile,
} from "./personalizationEngine";

export {
  getAverageRating,
  getFeatureRequests,
  handleFeedbackMessage,
  listFeedback,
  submitFeedback,
} from "./feedbackManager";

export {
  formatAdminSnapshotForPrompt,
  formatTrendingForPrompt,
  generateAdminDashboard,
  generateTrendingItems,
} from "./analyticsEngine";

export {
  formatKnowledgeEvolutionForPrompt,
  listKnowledgeEvolution,
  registerKnowledgeEvolution,
  syncKnowledgeFromMessage,
} from "./knowledgeEvolution";

export {
  buildPersonalizationBundle,
  formatPersonalizationForPrompt,
} from "./recommendationEngine";

export {
  formatIntelligenceForPrompt,
  getAdminDashboard,
  getIntelligenceExtensionHooks,
  recordIntelligenceOutcome,
  runIntelligenceEngine,
  setIntelligenceExtensionHooks,
} from "./intelligenceEngine";
