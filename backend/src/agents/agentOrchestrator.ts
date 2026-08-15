import { loadAgentRoutingRules } from "./loadAgentConfig.js";
import type { EmaceCollaborationInput, EmaceRequestAnalysis } from "./types.js";

const matchKeywordRules = (userMessage: string) => {
  const rules = loadAgentRoutingRules().keywordAgentMap;
  const normalized = userMessage.toLowerCase();

  for (const rule of rules) {
    if (rule.patterns.some((pattern) => normalized.includes(pattern.toLowerCase()))) {
      return rule;
    }
  }

  return null;
};

export const analyzeCollaborationRequest = (
  input: EmaceCollaborationInput
): EmaceRequestAnalysis => {
  const rules = loadAgentRoutingRules();
  const intent = input.primaryIntent ?? "question";
  const keywordMatch = matchKeywordRules(input.userMessage);

  const intentAgents = rules.intentAgentMap[intent] ?? rules.defaultAgents;
  const keywordAgents = keywordMatch?.agents ?? [];

  const requiredAgentIds = [
    ...new Set([...keywordAgents, ...intentAgents, ...rules.defaultAgents]),
  ];

  const disciplineId =
    input.disciplineId ?? keywordMatch?.disciplineId ?? null;
  const disciplineName =
    input.disciplineName ?? keywordMatch?.disciplineName ?? null;
  const specializationId =
    input.specializationId ?? keywordMatch?.specializationId ?? null;
  const specializationName =
    input.specializationName ?? keywordMatch?.specializationName ?? null;

  const topic =
    keywordMatch?.patterns.find((pattern) =>
      input.userMessage.toLowerCase().includes(pattern.toLowerCase())
    ) ?? input.userMessage.slice(0, 80);

  return {
    disciplineId,
    disciplineName,
    specializationId,
    specializationName,
    topic,
    primaryIntent: intent,
    requiredAgentIds,
    participatingAgentIds: [],
    analysisSummary: [
      `Discipline: ${disciplineName ?? "General Engineering"}`,
      `Specialization: ${specializationName ?? "General"}`,
      `Intent: ${intent}`,
      `Required agents: ${requiredAgentIds.join(", ")}`,
    ].join(" | "),
  };
};
