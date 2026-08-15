import { runEngineeringReasoning } from "../reasoningEngine";
import type {
  EngineeringAICompletionRequest,
  EngineeringAIProvider,
} from "../providerInterface";

export const stubEngineeringAIProvider: EngineeringAIProvider = {
  id: "stub",
  label: "Sarathi Engineering Reasoning Engine",
  isConfigured: () => true,
  complete: async (request: EngineeringAICompletionRequest) => {
    const { runtimeContext, workspace } = request;

    const reasoning = runEngineeringReasoning({
      input: runtimeContext.input,
      workspace,
      selectedStandard: runtimeContext.input.selectedStandard ?? null,
      moduleSearchQuery: runtimeContext.input.moduleSearchQuery ?? "",
      followUpIntent: request.followUpIntent ?? null,
    });

    return {
      content: reasoning.content,
      providerId: "stub",
      model: "sarathi-engineering-reasoning-engine",
      usedStub: true,
    };
  },
};
