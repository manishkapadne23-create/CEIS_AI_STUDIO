import type { PredictiveBehaviorSignal, PredictiveContextInput } from "./types.js";

export interface BehaviorAnalysis {
  disciplineId: string | null;
  specializationId: string | null;
  dominantActivity: string | null;
  signalCount: number;
  recentTopics: string[];
  hasStandardsActivity: boolean;
  hasCalculationsActivity: boolean;
  hasDocumentsActivity: boolean;
  hasWorkflowActivity: boolean;
  hasLearningActivity: boolean;
  hasQaQcActivity: boolean;
}

const collectSignals = (input: PredictiveContextInput): PredictiveBehaviorSignal[] => [
  ...(input.recentConversations ?? []),
  ...(input.recentDocuments ?? []),
  ...(input.recentStandards ?? []),
  ...(input.recentCalculations ?? []),
  ...(input.recentWorkflows ?? []),
];

const countByType = (signals: PredictiveBehaviorSignal[]) => {
  const counts = new Map<string, number>();
  for (const signal of signals) {
    counts.set(signal.type, (counts.get(signal.type) ?? 0) + 1);
  }
  return counts;
};

export const analyzeBehavior = (input: PredictiveContextInput): BehaviorAnalysis => {
  const signals = collectSignals(input);
  const counts = countByType(signals);

  const dominantActivity =
    [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;

  const recentTopics = [
    input.lastTopic,
    ...signals.slice(0, 5).map((signal) => signal.title),
  ].filter((topic): topic is string => Boolean(topic));

  return {
    disciplineId: input.disciplineId ?? input.recentConversations?.[0]?.disciplineId ?? null,
    specializationId:
      input.specializationId ??
      input.recentConversations?.[0]?.specializationId ??
      null,
    dominantActivity,
    signalCount: signals.length,
    recentTopics: [...new Set(recentTopics)].slice(0, 8),
    hasStandardsActivity: (counts.get("standard") ?? 0) > 0,
    hasCalculationsActivity: (counts.get("calculation") ?? 0) > 0,
    hasDocumentsActivity: (counts.get("document") ?? 0) > 0,
    hasWorkflowActivity: (counts.get("workflow") ?? 0) > 0,
    hasLearningActivity: (counts.get("learning") ?? 0) > 0,
    hasQaQcActivity: signals.some((signal) =>
      /qa|qc|inspection|checklist/i.test(signal.title)
    ),
  };
};
