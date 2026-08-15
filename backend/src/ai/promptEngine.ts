import type { AICompletionRequest } from "./types.js";

export interface BuiltPrompt {
  systemPrompt: string;
  userMessage: string;
  fullPrompt: string;
}

export const buildSystemPrompt = (request: AICompletionRequest): string => {
  const sections = [
    "You are Sarathi AI, an Engineering Intelligence Assistant developed by CEIS.",
    "Provide professional, structured engineering guidance.",
    "State assumptions when information is incomplete.",
    "Do not invent code clauses, standard numbers, or project facts.",
    "",
    request.disciplineName
      ? `ENGINEERING DISCIPLINE: ${request.disciplineName}${request.disciplineId ? ` (${request.disciplineId})` : ""}`
      : "No specific discipline selected — provide general engineering guidance.",
    request.specializationName
      ? `ENGINEERING SPECIALIZATION: ${request.specializationName}${request.specializationId ? ` (${request.specializationId})` : ""}`
      : "",
    request.moduleTitle ? `ACTIVE MODULE: ${request.moduleTitle}` : "",
    request.projectContext ? `PROJECT CONTEXT:\n${request.projectContext}` : "",
    request.language && request.language !== "en"
      ? `Respond in language: ${request.language}`
      : "",
    request.subscriptionPlan
      ? `User subscription: ${request.subscriptionPlan}`
      : "",
    request.memorySummary
      ? `CONVERSATION MEMORY:\n${request.memorySummary}`
      : "",
    request.knowledgeReferences && request.knowledgeReferences.length > 0
      ? `KNOWLEDGE REFERENCES:\n${request.knowledgeReferences.map((r) => `- ${r}`).join("\n")}`
      : "",
    "",
    "Format responses with clear sections when appropriate: Summary, Detailed Response, Recommendations, Standards, References, Follow-up Suggestions.",
    request.systemPrompt,
  ];

  return sections.filter(Boolean).join("\n");
};

export const buildPrompt = (request: AICompletionRequest): BuiltPrompt => {
  const systemPrompt = buildSystemPrompt(request);
  const historyBlock =
    request.conversationHistory && request.conversationHistory.length > 0
      ? request.conversationHistory
          .slice(-12)
          .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n\n")
      : "";

  const fullPrompt = [
    systemPrompt,
    historyBlock ? `CONVERSATION HISTORY:\n${historyBlock}` : "",
    `USER MESSAGE:\n${request.userMessage}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { systemPrompt, userMessage: request.userMessage, fullPrompt };
};
