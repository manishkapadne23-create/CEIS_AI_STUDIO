import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import type { EngineeringStandardMetadata } from "../config/standards";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { resolveEngineeringAIContext } from "./engineeringContextEngine";
import {
  buildEngineeringExpertContextPayload,
  runEngineeringAIExpert,
} from "./engineeringAIExpertEngine";
import type { EngineeringExpertContextInput } from "./contextEngine";
import { buildExpertSystemPrompt } from "./expert/buildExpertSystemPrompt";
import {
  getExpertProfileForSpecialization,
  listAllExpertProfileIds,
  resolveEngineeringAIExpertProfile,
} from "./expert/resolveExpertProfile";

export interface EngineeringAIExpertChatInput {
  workspace: EngineeringWorkspace;
  activeModuleId: WorkspaceCategoryId | null;
  activeDisciplineId: string | null;
  activeDisciplineName: string | null;
  activeSpecializationId?: string | null;
  activeSpecializationName?: string | null;
  conversationId: string;
  userMessage: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  selectedStandard?: EngineeringStandardMetadata | null;
  moduleSearchQuery?: string;
}

export const createEngineeringExpertContextInput = (
  chatInput: EngineeringAIExpertChatInput
): EngineeringExpertContextInput => ({
  workspaceDomain: chatInput.workspace.domain,
  workspaceBranch: chatInput.workspace.branch,
  workspaceSpecialization:
    chatInput.activeSpecializationName ??
    chatInput.workspace.specialization,
  workspaceCountry: chatInput.workspace.country,
  workspaceCodes: chatInput.workspace.codes,
  activeModuleId: chatInput.activeModuleId,
  activeDisciplineId: chatInput.activeDisciplineId,
  activeDisciplineName: chatInput.activeDisciplineName,
  activeSpecializationId: chatInput.activeSpecializationId ?? null,
  conversationId: chatInput.conversationId,
  userMessage: chatInput.userMessage,
  conversationHistory: chatInput.conversationHistory,
  subscriptionPlan: undefined,
  language: undefined,
  selectedStandard: chatInput.selectedStandard ?? null,
  moduleSearchQuery: chatInput.moduleSearchQuery ?? "",
});

export const processEngineeringExpertMessage = async (
  chatInput: EngineeringAIExpertChatInput
) => {
  const input = createEngineeringExpertContextInput(chatInput);
  return runEngineeringAIExpert({
    input,
    workspace: chatInput.workspace,
  });
};

export const buildEngineeringExpertSystemPromptFromChat = (
  chatInput: EngineeringAIExpertChatInput
): string => {
  const input = createEngineeringExpertContextInput(chatInput);
  return buildEngineeringExpertContextPayload(input).systemPrompt;
};

export const buildEngineeringExpertSystemPrompt = (
  workspace: EngineeringWorkspace,
  userMessage: string
): string =>
  buildEngineeringExpertSystemPromptFromChat({
    workspace,
    activeModuleId: null,
    activeDisciplineId: null,
    activeDisciplineName: workspace.domain,
    conversationId: "legacy",
    userMessage,
    conversationHistory: [],
  });

export const buildEngineeringExpertRequestMessage = (
  workspace: EngineeringWorkspace,
  userMessage: string
): string => {
  const systemPrompt = buildEngineeringExpertSystemPrompt(workspace, userMessage);
  return `${systemPrompt}\n\n${userMessage.trim()}`;
};

export const resolveEngineeringExpertContext = (
  workspace: EngineeringWorkspace,
  userPrompt: string
) => {
  const context = resolveEngineeringAIContext(workspace, userPrompt);
  return {
    context,
    expert: context.expert,
  };
};

export {
  buildExpertSystemPrompt,
  getExpertProfileForSpecialization,
  listAllExpertProfileIds,
  resolveEngineeringAIExpertProfile,
};
