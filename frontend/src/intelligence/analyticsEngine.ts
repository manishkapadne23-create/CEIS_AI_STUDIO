import { getAllUsageRecords, getTotalInteractions } from "./learningEngine";
import { getAverageRating, getFeatureRequests, listFeedback } from "./feedbackManager";
import type {
  AdminDashboardSnapshot,
  LearningResourceType,
  TrendingItem,
} from "./types";

const computeTrend = (
  count: number,
  avgCount: number
): TrendingItem["trend"] => {
  if (count > avgCount * 1.5) return "rising";
  if (count < avgCount * 0.5) return "declining";
  return "stable";
};

export const generateTrendingItems = (
  type?: LearningResourceType,
  limit = 8
): TrendingItem[] => {
  const records = getAllUsageRecords().filter(
    (r) => !type || r.type === type
  );

  const avgCount =
    records.length > 0
      ? records.reduce((sum, r) => sum + r.count, 0) / records.length
      : 1;

  return records
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((record) => ({
      id: record.id,
      label: record.label,
      type: record.type,
      count: record.count,
      trend: computeTrend(record.count, avgCount),
    }));
};

export const generateAdminDashboard = (): AdminDashboardSnapshot => {
  const records = getAllUsageRecords();
  const feedback = listFeedback();

  const moduleCounts = new Map<string, number>();
  const disciplineCounts = new Map<string, number>();

  for (const record of records) {
    if (record.moduleId) {
      moduleCounts.set(
        record.moduleId,
        (moduleCounts.get(record.moduleId) ?? 0) + record.count
      );
    }
    if (record.disciplineId) {
      disciplineCounts.set(
        record.disciplineId,
        (disciplineCounts.get(record.disciplineId) ?? 0) + record.count
      );
    }
  }

  const mostUsedModules = Array.from(moduleCounts.entries())
    .map(([moduleId, count]) => ({ moduleId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const mostActiveDisciplines = Array.from(disciplineCounts.entries())
    .map(([disciplineId, count]) => ({ disciplineId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const knowledgeGaps = feedback
    .filter((f) => f.type === "incorrect-information" || f.type === "suggestion")
    .slice(0, 5)
    .map((f) => f.message);

  const mostRequestedFeatures = getFeatureRequests()
    .slice(0, 5)
    .map((f) => f.message);

  const avgRating = getAverageRating();
  const totalInteractions = getTotalInteractions();

  return {
    mostUsedModules,
    mostActiveDisciplines,
    knowledgeGaps:
      knowledgeGaps.length > 0
        ? knowledgeGaps
        : ["No knowledge gaps reported yet"],
    mostRequestedFeatures:
      mostRequestedFeatures.length > 0
        ? mostRequestedFeatures
        : ["No feature requests yet"],
    aiPerformanceScore: Math.min(100, Math.round(70 + avgRating * 6)),
    userSatisfactionScore: avgRating > 0 ? Math.round((avgRating / 5) * 100) : 75,
    totalInteractions,
  };
};

export const formatTrendingForPrompt = (items: TrendingItem[]): string => {
  if (items.length === 0) return "No trending data yet.";

  return items
    .map((item) => `- [${item.type}] ${item.label} (${item.count}x, ${item.trend})`)
    .join("\n");
};

export const formatAdminSnapshotForPrompt = (
  snapshot: AdminDashboardSnapshot
): string =>
  [
    `Total interactions: ${snapshot.totalInteractions}`,
    `AI performance: ${snapshot.aiPerformanceScore}/100`,
    `User satisfaction: ${snapshot.userSatisfactionScore}/100`,
    `Top modules: ${snapshot.mostUsedModules.map((m) => m.moduleId).join(", ") || "none"}`,
    `Active disciplines: ${snapshot.mostActiveDisciplines.map((d) => d.disciplineId).join(", ") || "none"}`,
    `Knowledge gaps: ${snapshot.knowledgeGaps.slice(0, 3).join("; ")}`,
  ].join("\n");
