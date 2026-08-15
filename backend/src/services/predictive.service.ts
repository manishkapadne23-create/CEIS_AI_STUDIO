import type { PredictiveUserPreferences } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";
import {
  getPredictiveEngineConfig,
  runPredictiveIntelligenceEngine,
  listPredictiveInsightLogs,
  logPredictiveInsights,
  type PredictiveContextInput,
  type PredictiveUserPreferencesSnapshot,
} from "../predictive/index.js";

const toSnapshot = (
  prefs: PredictiveUserPreferences
): PredictiveUserPreferencesSnapshot => ({
  predictiveEnabled: prefs.predictiveEnabled,
  recommendationsEnabled: prefs.recommendationsEnabled,
  timelineEnabled: prefs.timelineEnabled,
  remindersEnabled: prefs.remindersEnabled,
  riskPredictionEnabled: prefs.riskPredictionEnabled,
  learningPredictionEnabled: prefs.learningPredictionEnabled,
  projectAwarenessEnabled: prefs.projectAwarenessEnabled,
  aiCoachEnabled: prefs.aiCoachEnabled,
  shareBehaviorData: prefs.shareBehaviorData,
});

export const getOrCreatePredictivePreferences = async (userId: string) => {
  const prefs = await prisma.predictiveUserPreferences.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  return toSnapshot(prefs);
};

export const updatePredictivePreferences = async (
  userId: string,
  updates: Partial<PredictiveUserPreferencesSnapshot>
) => {
  const prefs = await prisma.predictiveUserPreferences.upsert({
    where: { userId },
    create: { userId, ...updates },
    update: updates,
  });
  return toSnapshot(prefs);
};

export const getPredictiveIntelligenceConfig = () => getPredictiveEngineConfig();

export const analyzePredictiveIntelligence = async (
  input: PredictiveContextInput
) => {
  const preferences = await getOrCreatePredictivePreferences(input.userId);
  const pkg = runPredictiveIntelligenceEngine(input, preferences);

  if (preferences.predictiveEnabled) {
    await logPredictiveInsights(input.userId, pkg);
  }

  return pkg;
};

export const getUserPredictiveInsightLogs = listPredictiveInsightLogs;

export const buildPredictiveContextFromChat = (input: {
  userId: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  projectContext?: string | null;
  message?: string | null;
  history?: Array<{ role: string; content: string }>;
  lastIntent?: string | null;
  lastTopic?: string | null;
}): PredictiveContextInput => {
  const recentConversations =
    input.history
      ?.filter((entry) => entry.role === "user")
      .slice(-5)
      .map((entry, index) => ({
        type: "conversation" as const,
        title: entry.content.slice(0, 120),
        disciplineId: input.disciplineId ?? null,
        specializationId: input.specializationId ?? null,
        timestamp: Date.now() - index * 60_000,
      })) ?? [];

  if (input.message) {
    recentConversations.unshift({
      type: "conversation",
      title: input.message.slice(0, 120),
      disciplineId: input.disciplineId ?? null,
      specializationId: input.specializationId ?? null,
      timestamp: Date.now(),
    });
  }

  return {
    userId: input.userId,
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    specializationId: input.specializationId ?? null,
    specializationName: input.specializationName ?? null,
    projectName: input.projectContext ?? null,
    recentConversations,
    lastIntent: input.lastIntent ?? null,
    lastTopic: input.lastTopic ?? input.message?.slice(0, 80) ?? null,
  };
};
