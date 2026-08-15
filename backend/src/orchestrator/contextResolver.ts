import { loadTopicPatterns } from "./loadOrchestratorConfig.js";
import type { EoeContextDetection, EoeOrchestratorInput } from "./types.js";

const countTurns = (
  history: EoeOrchestratorInput["conversationHistory"]
): number => (history ? history.length : 0);

export const resolveContext = (
  input: EoeOrchestratorInput
): EoeContextDetection => {
  const message = input.userMessage.toLowerCase();
  const patterns = loadTopicPatterns();

  let disciplineId = input.disciplineId ?? null;
  let disciplineName = input.disciplineName ?? null;
  let specializationId = input.specializationId ?? null;
  let specializationName = input.specializationName ?? null;
  let topic: string | null = null;

  for (const pattern of patterns) {
    if (!message.includes(pattern.pattern.toLowerCase())) {
      continue;
    }

    disciplineId = disciplineId ?? pattern.disciplineId;
    disciplineName = disciplineName ?? pattern.disciplineName;
    specializationId = specializationId ?? pattern.specializationId;
    specializationName = specializationName ?? pattern.specializationName;
    topic = pattern.topic;
    break;
  }

  if (!topic) {
    const topicMatch = message.match(
      /\b(design|prepare|analyze|calculate|estimate)\s+(?:a|an|the)?\s*([a-z0-9\s-]{3,40})/i
    );
    if (topicMatch?.[2]) {
      topic = topicMatch[2]
        .trim()
        .split(/\s+/)
        .slice(0, 4)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }

  return {
    disciplineId,
    disciplineName,
    specializationId,
    specializationName,
    topic,
    workspaceModuleId: input.moduleId ?? null,
    projectId: input.projectId ?? null,
    projectName: input.projectName ?? null,
    conversationId: input.conversationId ?? null,
    conversationTurnCount: countTurns(input.conversationHistory),
    memorySummary: input.memorySummary ?? null,
    subscriptionPlan: input.subscriptionPlan ?? "free",
    language: input.language ?? "en",
  };
};
