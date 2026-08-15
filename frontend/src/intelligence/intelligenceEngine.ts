import {
  formatTrendingForPrompt,
  generateAdminDashboard,
  generateTrendingItems,
} from "./analyticsEngine";
import { handleFeedbackMessage } from "./feedbackManager";
import { recordInteraction } from "./learningEngine";
import { formatKnowledgeEvolutionForPrompt, syncKnowledgeFromMessage } from "./knowledgeEvolution";
import {
  formatProfileForPrompt,
  inferExperienceLevel,
  syncProfileFromSession,
  updateUserLearningProfile,
} from "./personalizationEngine";
import {
  buildPersonalizationBundle,
  formatPersonalizationForPrompt,
} from "./recommendationEngine";
import type {
  IntelligenceEngineInput,
  IntelligenceEngineResult,
  IntelligenceExtensionHooks,
  RecordInteractionInput,
} from "./types";

let extensionHooks: IntelligenceExtensionHooks = {};

export const setIntelligenceExtensionHooks = (
  hooks: IntelligenceExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getIntelligenceExtensionHooks = (): IntelligenceExtensionHooks =>
  extensionHooks;

/** Run Engineering Learning & Intelligence Evolution Engine for a user turn. */
export const runIntelligenceEngine = (
  input: IntelligenceEngineInput
): IntelligenceEngineResult => {
  const feedbackHandled = handleFeedbackMessage(
    input.userMessage,
    input.conversationId,
    input.disciplineId
  );

  syncKnowledgeFromMessage(input.userMessage);

  const inferredLevel = inferExperienceLevel(input.userMessage);
  if (inferredLevel) {
    updateUserLearningProfile({ experienceLevel: inferredLevel });
  }

  const profile = syncProfileFromSession(
    input.disciplineId,
    input.disciplineName,
    input.activeModuleId,
    input.sessionTopic ?? input.userMessage.slice(0, 60),
    input.language
  );

  const personalization = buildPersonalizationBundle(
    profile,
    input.disciplineId
  );

  const trending = [
    ...generateTrendingItems("faq", 4),
    ...generateTrendingItems("standard", 3),
    ...generateTrendingItems("calculator", 3),
    ...generateTrendingItems("workflow", 2),
  ].slice(0, 10);

  const adminSnapshot = generateAdminDashboard();

  const extensionNotes: string[] = [];
  if (extensionHooks.federatedLearningEnabled) {
    extensionNotes.push("Federated learning enabled");
  }
  if (extensionHooks.enterpriseKnowledgeId) {
    extensionNotes.push(`Enterprise: ${extensionHooks.enterpriseKnowledgeId}`);
  }
  if (extensionHooks.pmisAnalyticsId) {
    extensionNotes.push(`PMIS analytics: ${extensionHooks.pmisAnalyticsId}`);
  }
  if (extensionHooks.aiModelOptimizationEnabled) {
    extensionNotes.push("AI model optimization enabled");
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Learning & Intelligence Evolution (ELIE)",
    "========================================",
    "Continuously learn from interactions to personalize engineering assistance. Maintain privacy — learning is local to this session/device.",
    "",
    "USER LEARNING PROFILE:",
    formatProfileForPrompt(profile),
    "",
    "PERSONALIZED RECOMMENDATIONS:",
    formatPersonalizationForPrompt(personalization),
    "",
    "LEARNING ANALYTICS (trending):",
    formatTrendingForPrompt(trending),
    "",
    "KNOWLEDGE EVOLUTION:",
    formatKnowledgeEvolutionForPrompt(),
    "",
    feedbackHandled
      ? `Feedback recorded: ${feedbackHandled.type} — thank you for helping improve Sarathi AI.`
      : "",
    "",
    "ELIE INSTRUCTIONS:",
    "- Prioritize user's preferred standards, tools, and modules in suggestions",
    "- Reference frequently used resources when relevant",
    "- Adapt explanation depth to experience level",
    "- Proactively suggest learning resources for knowledge gaps",
    "- Users can: Rate response (rate 4), Report incorrect information, Suggest improvement, Request feature",
    extensionNotes.length > 0
      ? `\nFuture capabilities: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `Profile: ${profile.disciplineName ?? "general"}`,
    `Trending: ${trending.length} items`,
    `Satisfaction: ${adminSnapshot.userSatisfactionScore}/100`,
    feedbackHandled ? `Feedback: ${feedbackHandled.type}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    profile,
    personalization,
    trending,
    adminSnapshot,
    feedbackHandled,
    promptAugmentation,
    summaryText,
  };
};

/** Record interaction after AI response for learning evolution. */
export const recordIntelligenceOutcome = (
  input: RecordInteractionInput
): void => {
  recordInteraction(input);
};

export const formatIntelligenceForPrompt = (
  result: IntelligenceEngineResult
): string => result.promptAugmentation;

export const getAdminDashboard = () => generateAdminDashboard();
