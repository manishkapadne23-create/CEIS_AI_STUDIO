import type { PredictiveInsightType } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";
import type { PredictiveIntelligencePackage } from "./types.js";

const ensurePreferences = (userId: string) =>
  prisma.predictiveUserPreferences.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

export const logPredictiveInsights = async (
  userId: string,
  pkg: PredictiveIntelligencePackage
): Promise<void> => {
  if (!pkg.enabled) {
    return;
  }

  await ensurePreferences(userId);

  const entries: Array<{
    insightType: PredictiveInsightType;
    title: string;
    summary: string;
    confidence: number;
    payload: unknown;
  }> = [];

  for (const recommendation of pkg.recommendations.slice(0, 3)) {
    entries.push({
      insightType: "RECOMMENDATION",
      title: recommendation.title,
      summary: recommendation.reason,
      confidence: recommendation.confidence,
      payload: recommendation,
    });
  }

  for (const risk of pkg.risks.slice(0, 2)) {
    entries.push({
      insightType: "RISK",
      title: risk.label,
      summary: risk.description,
      confidence: risk.confidence,
      payload: risk,
    });
  }

  for (const timelineItem of pkg.timeline.slice(0, 2)) {
    entries.push({
      insightType: "TIMELINE",
      title: timelineItem.label,
      summary: timelineItem.predictedAction,
      confidence: timelineItem.confidence,
      payload: timelineItem,
    });
  }

  if (entries.length === 0) {
    return;
  }

  await prisma.predictiveInsightLog.createMany({
    data: entries.map((entry) => ({
      userId,
      insightType: entry.insightType,
      title: entry.title,
      summary: entry.summary,
      confidence: entry.confidence,
      payload: entry.payload as object,
    })),
  });
};

export const listPredictiveInsightLogs = async (input: {
  userId: string;
  insightType?: PredictiveInsightType;
  skip?: number;
  take?: number;
}) =>
  prisma.predictiveInsightLog.findMany({
    where: {
      userId: input.userId,
      ...(input.insightType ? { insightType: input.insightType } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: input.skip ?? 0,
    take: Math.min(input.take ?? 50, 100),
  });
