import type { AICompletionRequest } from "./types.js";

export interface ContextInjectionInput {
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  moduleId?: string | null;
  moduleTitle?: string | null;
  projectContext?: string | null;
  language?: string;
  subscriptionPlan?: string;
  memorySummary?: string | null;
  knowledgeReferences?: string[];
  systemPrompt?: string;
  userMessage: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
}

export const injectContext = (input: ContextInjectionInput): AICompletionRequest => ({
  systemPrompt: input.systemPrompt ?? "",
  userMessage: input.userMessage,
  conversationHistory: input.conversationHistory,
  disciplineId: input.disciplineId,
  disciplineName: input.disciplineName,
  specializationId: input.specializationId,
  specializationName: input.specializationName,
  moduleId: input.moduleId,
  moduleTitle: input.moduleTitle,
  projectContext: input.projectContext,
  language: input.language ?? "en",
  subscriptionPlan: input.subscriptionPlan ?? "free",
  memorySummary: input.memorySummary,
  knowledgeReferences: input.knowledgeReferences,
});
