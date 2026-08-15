export type {
  CopilotContextSnapshot,
  CopilotEngineInput,
  CopilotExtensionHooks,
  CopilotIntelligenceResult,
  CopilotSuggestion,
  CopilotSuggestionCategory,
  EngineeringRecommendation,
  EngineeringRecommendationType,
  ModuleRouteDecision,
  RelatedKnowledgeBundle,
} from "./types";

export {
  analyzeCopilotContext,
  detectMissingInformation,
  inferUserEngineeringIntent,
} from "./contextAnalyzer";

export {
  applyCopilotModuleRoute,
  getModuleRouteRules,
  registerCopilotModuleRouter,
  resolveModuleRoute,
} from "./moduleRouter";

export {
  connectRelatedKnowledge,
  flattenRelatedKnowledge,
} from "./knowledgeConnector";

export {
  generateReportAndChecklistSuggestions,
  generateTopicSuggestions,
} from "./smartSuggestions";

export { generateEngineeringRecommendations } from "./engineeringAdvisor";

export {
  assembleCopilotIntelligence,
  buildCopilotSummary,
} from "./recommendationEngine";

export {
  formatCopilotForPrompt,
  getCopilotExtensionHooks,
  runCopilotIntelligence,
  runCopilotWithModuleRouting,
  setCopilotExtensionHooks,
} from "./copilotEngine";
