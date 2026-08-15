import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { EngineeringExpertRuntimeContext } from "../contextEngine";
import type { DisciplineExpertIntelligence } from "../expertIntelligence";
import type { ConversationTurn } from "../conversationManager";

export type EngineeringAIProviderId =
  | "stub"
  | "backend"
  | "openai"
  | "ollama"
  | "gemini"
  | "claude"
  | "azure-openai"
  | "lm-studio"
  | "local-llm"
  | "custom";

export interface EngineeringAICompletionRequest {
  systemPrompt: string;
  userMessage: string;
  conversationHistory: ConversationTurn[];
  runtimeContext: EngineeringExpertRuntimeContext;
  expertIntelligence: DisciplineExpertIntelligence;
  workspace: EngineeringWorkspace;
  followUpIntent?: string | null;
}
export interface EngineeringAICompletionResponse {
  content: string;
  providerId: EngineeringAIProviderId;
  model?: string;
  usedStub: boolean;
  normalized?: import("../providerManager/types").NormalizedAIResponse;
}

export interface EngineeringAIProvider {
  id: EngineeringAIProviderId;
  label: string;
  isConfigured: () => boolean;
  complete: (
    request: EngineeringAICompletionRequest
  ) => Promise<EngineeringAICompletionResponse>;
}
