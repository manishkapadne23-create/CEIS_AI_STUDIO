import {
  readSubscriptionPlan,
  readUserLanguage,
} from "../ai/contextEngine";
import { getActiveAgent } from "../agents";
import { getActiveProject } from "../projects";
import type { OrchestratorContextSnapshot, OrchestratorEngineInput } from "./types";

export const buildOrchestratorContext = (
  input: OrchestratorEngineInput
): OrchestratorContextSnapshot => {
  const activeProject = getActiveProject();
  const activeAgent = getActiveAgent();

  return {
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    activeModuleId: input.activeModuleId,
    conversationId: input.conversationId,
    sessionTopic: input.sessionTopic ?? null,
    projectId: activeProject?.id ?? null,
    projectName: activeProject?.name ?? null,
    subscriptionPlan: input.subscriptionPlan ?? readSubscriptionPlan(),
    language: input.language ?? readUserLanguage(),
    conversationTurnCount: input.conversationHistory?.length ?? 0,
    activeAgentName: activeAgent?.name ?? null,
    selectedStandardCode: input.selectedStandardCode ?? null,
  };
};

export const formatOrchestratorContextForPrompt = (
  context: OrchestratorContextSnapshot
): string => {
  return [
    `Discipline: ${context.disciplineName ?? "Not selected"} (${context.disciplineId ?? "none"})`,
    `Active module: ${context.activeModuleId ?? "ai-expert"}`,
    `Session topic: ${context.sessionTopic ?? "none"}`,
    context.projectName
      ? `Project: ${context.projectName} (${context.projectId})`
      : "Project: none active",
    `Subscription: ${context.subscriptionPlan}`,
    `Language: ${context.language}`,
    `Conversation turns: ${context.conversationTurnCount}`,
    context.activeAgentName
      ? `Active agent: ${context.activeAgentName}`
      : "Active agent: auto from discipline",
    context.selectedStandardCode
      ? `Selected standard: ${context.selectedStandardCode}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
};
