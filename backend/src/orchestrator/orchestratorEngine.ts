import { resolveContext } from "./contextResolver.js";
import { detectIntent } from "./intentEngine.js";
import { dispatchModules } from "./moduleDispatcher.js";
import {
  buildPromptAugmentation,
  composeOrchestratedResponse,
} from "./responseComposer.js";
import { partitionRoutes, resolveRoutes } from "./routingEngine.js";
import { buildTaskPlan } from "./taskPlanner.js";
import type { EoeOrchestratorInput, EoeOrchestratorResult } from "./types.js";

export const runEngineeringOrchestrator = async (
  input: EoeOrchestratorInput
): Promise<EoeOrchestratorResult> => {
  const intent = detectIntent(input.userMessage);
  const context = resolveContext(input);

  const routes = resolveRoutes(
    intent.primaryIntent,
    intent.secondaryIntents,
    intent.confidence
  );

  const { primaryRoute, supportingRoutes, fallbackRoutes } = partitionRoutes(routes);

  const routedModuleIds = routes.map((route) => route.resolvedModuleId);
  const taskPlan = buildTaskPlan(
    input.userMessage,
    intent.primaryIntent,
    routedModuleIds
  );

  const moduleContributions = await dispatchModules({
    routes,
    taskPlan,
    context,
    intent,
    userMessage: input.userMessage,
  });

  const composedResponse = composeOrchestratedResponse({
    userMessage: input.userMessage,
    intent,
    context,
    primaryRoute,
    routes,
    taskPlan,
    contributions: moduleContributions,
  });

  const promptAugmentation = buildPromptAugmentation({
    intent,
    context,
    routes,
    primaryRoute,
    taskPlan,
    composedResponse,
  });

  const summaryText = [
    `Intent: ${intent.primaryIntent}`,
    `Discipline: ${context.disciplineName ?? "n/a"}`,
    `Specialization: ${context.specializationName ?? "n/a"}`,
    `Topic: ${context.topic ?? "n/a"}`,
    `Route: ${primaryRoute?.resolvedModuleId ?? "ai-expert"}`,
    taskPlan.isComplex ? `Plan: ${taskPlan.summary}` : "",
    `Modules: ${routes.length}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    engine: "Engineering Orchestrator Engine",
    version: "1.0.0",
    intent,
    context,
    routes,
    primaryRoute,
    supportingRoutes,
    fallbackRoutes,
    taskPlan,
    moduleContributions,
    composedResponse,
    promptAugmentation,
    summaryText,
  };
};
