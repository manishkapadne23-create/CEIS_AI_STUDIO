import { loadTimelineRules } from "./loadPredictiveConfig.js";
import type { BehaviorAnalysis } from "./behaviorAnalyzer.js";
import type { PredictiveContextInput, PredictiveTimelineItem } from "./types.js";

export const buildSmartTimeline = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveTimelineItem[] => {
  const rules = loadTimelineRules();
  const intent = input.lastIntent ?? "design";
  const activityIds =
    rules.intentTimelineMap[intent] ??
    rules.intentTimelineMap.design ??
  ["next-engineering-activity"];

  const topic = input.lastTopic ?? behavior.recentTopics[0] ?? "current task";

  return activityIds.map((activityId, index) => {
    const activityType = rules.activityTypes.find((entry) => entry.id === activityId);
    return {
      id: `timeline-${activityId}`,
      activityType: activityId,
      label: activityType?.label ?? activityId,
      predictedAction: `Continue ${topic} — ${activityType?.label ?? "next step"}`,
      estimatedOrder: index + 1,
      confidence: Math.max(0.55, 0.9 - index * 0.08),
    };
  });
};
