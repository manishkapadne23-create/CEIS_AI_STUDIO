import {
  analyzeCopilotContext,
  inferUserEngineeringIntent,
} from "./contextAnalyzer";
import { generateEngineeringRecommendations } from "./engineeringAdvisor";
import {
  connectRelatedKnowledge,
  flattenRelatedKnowledge,
} from "./knowledgeConnector";
import { applyCopilotModuleRoute, resolveModuleRoute } from "./moduleRouter";
import { assembleCopilotIntelligence } from "./recommendationEngine";
import {
  generateReportAndChecklistSuggestions,
  generateTopicSuggestions,
} from "./smartSuggestions";
import type {
  CopilotEngineInput,
  CopilotExtensionHooks,
  CopilotIntelligenceResult,
} from "./types";

let extensionHooks: CopilotExtensionHooks = {};

export const setCopilotExtensionHooks = (
  hooks: CopilotExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getCopilotExtensionHooks = (): CopilotExtensionHooks =>
  extensionHooks;

/** Run full copilot intelligence analysis for a user turn. */
export const runCopilotIntelligence = (
  input: CopilotEngineInput
): CopilotIntelligenceResult => {
  const snapshot = analyzeCopilotContext(input);
  const userIntent = inferUserEngineeringIntent(
    input.userMessage,
    snapshot.sessionTopic
  );

  const topicSuggestions = generateTopicSuggestions(
    input.userMessage,
    snapshot
  );
  const intentSuggestions = generateReportAndChecklistSuggestions(userIntent);
  const relatedKnowledge = connectRelatedKnowledge(
    input.userMessage,
    snapshot
  );
  const knowledgeSuggestions = flattenRelatedKnowledge(relatedKnowledge);

  const recommendations = generateEngineeringRecommendations(
    input.userMessage,
    userIntent,
    snapshot
  );

  const moduleRoute = resolveModuleRoute(
    input.userMessage,
    input.activeModuleId ?? snapshot.moduleId
  );

  const result = assembleCopilotIntelligence({
    snapshot,
    topicSuggestions,
    knowledgeSuggestions,
    intentSuggestions,
    recommendations,
    relatedKnowledge,
    moduleRoute,
    userIntent,
  });

  if (extensionHooks.pmisCopilotProjectId) {
    result.summaryText += `\nPMIS Copilot (future): Project ${extensionHooks.pmisCopilotProjectId}`;
  }

  return result;
};

/** Analyze and apply automatic module routing (no UI change). */
export const runCopilotWithModuleRouting = (
  input: CopilotEngineInput
): CopilotIntelligenceResult => {
  const result = runCopilotIntelligence(input);
  if (result.moduleRoute) {
    applyCopilotModuleRoute(result.moduleRoute);
  }
  return result;
};

export const formatCopilotForPrompt = (
  result: CopilotIntelligenceResult
): string => result.summaryText;
