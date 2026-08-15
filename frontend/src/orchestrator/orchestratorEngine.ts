import {
  buildOrchestratorContext,
  formatOrchestratorContextForPrompt,
} from "./contextManager";
import { buildExecutionPlan, formatExecutionPlanForPrompt } from "./executionManager";
import { classifyEngineeringIntent, getIntentLabel } from "./intentClassifier";
import {
  buildEngineeringKnowledgeGraph,
  formatKnowledgeGraphForPrompt,
} from "./knowledgeGraph";
import {
  applyOrchestratorModuleRoute,
  resolveModuleRoutes,
  selectPrimaryModuleRoute,
} from "./moduleRouter";
import {
  formatRecommendationsForPrompt,
  generateOrchestratorRecommendations,
} from "./recommendationEngine";
import type {
  OrchestratorEngineInput,
  OrchestratorExtensionHooks,
  OrchestratorResult,
} from "./types";

let extensionHooks: OrchestratorExtensionHooks = {};

export const setOrchestratorExtensionHooks = (
  hooks: OrchestratorExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getOrchestratorExtensionHooks = (): OrchestratorExtensionHooks =>
  extensionHooks;

/** Run the Engineering Intelligence Orchestrator for a user turn. */
export const runOrchestratorEngine = (
  input: OrchestratorEngineInput
): OrchestratorResult => {
  const context = buildOrchestratorContext(input);

  const classification = classifyEngineeringIntent(
    input.userMessage,
    input.followUpIntent
  );

  const moduleRoutes = resolveModuleRoutes(
    classification.primaryIntent,
    classification.secondaryIntents,
    classification.confidence
  );

  const primaryModuleRoute = selectPrimaryModuleRoute(
    moduleRoutes,
    input.activeModuleId
  );

  const knowledgeGraph = buildEngineeringKnowledgeGraph(
    input.userMessage,
    input.disciplineId,
    input.disciplineName,
    classification.primaryIntent
  );

  const recommendations = generateOrchestratorRecommendations(
    input.userMessage,
    input.disciplineId,
    input.disciplineName,
    knowledgeGraph
  );

  const executionPlan = buildExecutionPlan(
    moduleRoutes,
    classification.primaryIntent
  );

  const extensionNotes: string[] = [];
  if (extensionHooks.multiAgentEnabled) {
    extensionNotes.push("Multi-Agent AI: enabled");
  }
  if (extensionHooks.pmisProjectId) {
    extensionNotes.push(`PMIS: project ${extensionHooks.pmisProjectId}`);
  }
  if (extensionHooks.digitalTwinProjectId) {
    extensionNotes.push(`Digital Twin: ${extensionHooks.digitalTwinProjectId}`);
  }
  if (extensionHooks.voiceSessionId) {
    extensionNotes.push(`Voice session: ${extensionHooks.voiceSessionId}`);
  }
  if (extensionHooks.drawingIntelligenceEnabled) {
    extensionNotes.push("Drawing Intelligence: enabled");
  }
  if (extensionHooks.bimIntegrationEnabled) {
    extensionNotes.push("BIM integration: enabled");
  }
  if (extensionHooks.gisIntegrationEnabled) {
    extensionNotes.push("GIS integration: enabled");
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Intelligence Orchestrator (EIO)",
    "========================================",
    "You are the unified Engineering Operating System. Coordinate all Sarathi modules automatically — the user should not need to switch modules manually.",
    "",
    "SESSION CONTEXT:",
    formatOrchestratorContextForPrompt(context),
    "",
    "CLASSIFIED INTENT:",
    `Primary: ${getIntentLabel(classification.primaryIntent)} (${classification.primaryIntent})`,
    classification.secondaryIntents.length > 0
      ? `Secondary: ${classification.secondaryIntents.map(getIntentLabel).join(", ")}`
      : "",
    `Confidence: ${Math.round(classification.confidence * 100)}%`,
    "",
    "MODULE ROUTING (auto-resolved):",
    moduleRoutes
      .slice(0, 6)
      .map(
        (route) =>
          `- ${route.moduleId} [${route.engineId}]: ${route.reason} (priority ${route.priority})`
      )
      .join("\n"),
  primaryModuleRoute
      ? `\nPrimary route: ${primaryModuleRoute.moduleId} — ${primaryModuleRoute.reason}`
      : "",
    "",
    formatExecutionPlanForPrompt(executionPlan),
    "",
    "ENGINEERING KNOWLEDGE GRAPH:",
    formatKnowledgeGraphForPrompt(knowledgeGraph),
    "",
    "SMART RECOMMENDATIONS (suggest proactively in response):",
    formatRecommendationsForPrompt(recommendations),
    "",
    "ORCHESTRATION INSTRUCTIONS:",
    "- Automatically reference related standards, calculators, workflows, and tools",
    "- For design queries, coordinate standards + calculations + workflow + AI expert",
    "- For comparisons, use decision support structure",
    "- For reports/checklists, guide toward Action Engine deliverables",
    "- Always mention applicable standards and best practices",
    extensionNotes.length > 0 ? `\nFuture capabilities: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `Intent: ${classification.primaryIntent}`,
    `Route: ${primaryModuleRoute?.moduleId ?? "ai-expert"}`,
    executionPlan.isMultiModule ? `Multi-module: ${executionPlan.summary}` : "",
    `Recommendations: ${recommendations.length}`,
    `Knowledge nodes: ${knowledgeGraph.nodes.length}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    context,
    classification,
    moduleRoutes,
    primaryModuleRoute,
    executionPlan,
    knowledgeGraph,
    recommendations,
    promptAugmentation,
    summaryText,
  };
};

/** Analyze and apply automatic module routing (no UI change). */
export const runOrchestratorWithModuleRouting = (
  input: OrchestratorEngineInput
): OrchestratorResult => {
  const result = runOrchestratorEngine(input);
  if (result.primaryModuleRoute) {
    applyOrchestratorModuleRoute(result.primaryModuleRoute);
  }
  return result;
};

export const formatOrchestratorForPrompt = (
  result: OrchestratorResult
): string => result.promptAugmentation;
