import type { EngineeringAICompletionRequest } from "../providerInterface";
import type { AICompleteRequest } from "../providerManager/types";

export const buildCompletionPayload = (
  request: EngineeringAICompletionRequest
): AICompleteRequest => ({
  message: request.userMessage,
  systemPrompt: request.systemPrompt,
  domainId: request.runtimeContext.disciplineId ?? null,
  domainName: request.runtimeContext.disciplineName ?? null,
  specializationId: request.runtimeContext.input.activeSpecializationId ?? null,
  specializationName: request.runtimeContext.input.workspaceSpecialization ?? null,
  moduleId: request.runtimeContext.input.activeModuleId ?? null,
  moduleTitle: request.runtimeContext.activeModuleTitle ?? null,
  language: request.runtimeContext.input.language,
  subscriptionPlan: request.runtimeContext.input.subscriptionPlan,
  knowledgeReferences: request.runtimeContext.applicableStandards,
  history: request.conversationHistory.map((turn) => ({
    role: turn.role,
    content: turn.content,
  })),
});
