import { loadRiskPatterns } from "./loadPredictiveConfig.js";
import type { BehaviorAnalysis } from "./behaviorAnalyzer.js";
import type { PredictiveContextInput, PredictiveRisk } from "./types.js";

const matchesCondition = (
  condition: string,
  behavior: BehaviorAnalysis,
  input: PredictiveContextInput
): boolean => {
  switch (condition) {
    case "no-standards-in-context":
      return !behavior.hasStandardsActivity && input.lastIntent === "design";
    case "no-qa-qc-activity":
      return !behavior.hasQaQcActivity && /construction|execution/i.test(input.lastTopic ?? "");
    case "no-recent-documents":
      return !behavior.hasDocumentsActivity;
    case "no-safety-activity":
      return !/safety|hse/i.test(behavior.recentTopics.join(" "));
    default:
      return false;
  }
};

export const predictRisks = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveRisk[] => {
  const config = loadRiskPatterns();
  const combinedText = [
    input.lastTopic ?? "",
    ...behavior.recentTopics,
    ...(input.recentConversations?.map((entry) => entry.title) ?? []),
  ].join(" ");

  const risks: PredictiveRisk[] = [];

  for (const detector of config.detectors) {
    const patternMatched = detector.patterns.some((pattern) =>
      new RegExp(pattern, "i").test(combinedText)
    );
    const conditionMatched = matchesCondition(detector.condition, behavior, input);

    if (!patternMatched && !conditionMatched) {
      continue;
    }

    const category = config.riskCategories.find((entry) => entry.id === detector.riskId);
    if (!category) {
      continue;
    }

    risks.push({
      id: `risk-${category.id}`,
      categoryId: category.id,
      label: category.label,
      severity: category.severity,
      description: `Potential ${category.label.toLowerCase()} identified in current engineering context.`,
      mitigation: `Review applicable standards, QA/QC checklists, and project documentation for ${input.disciplineName ?? "this discipline"}.`,
      confidence: patternMatched && conditionMatched ? 0.85 : 0.65,
    });
  }

  return risks.slice(0, 6);
};
