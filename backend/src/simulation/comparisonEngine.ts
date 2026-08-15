import { loadComparisonCriteria } from "./loadSimulationConfig.js";
import type {
  EssaeComparisonMatrix,
  EssaeImpactLevel,
  EssaeOptionComparison,
  EssaeScenarioInput,
} from "./types.js";

const impactScore: Record<EssaeImpactLevel, number> = {
  low: 3,
  medium: 2,
  high: 1,
};

const scoreOption = (option: EssaeScenarioInput["options"][number]): number => {
  const cost = impactScore[option.costImpact ?? "medium"];
  const risk = impactScore[option.riskImpact ?? "medium"];
  const quality = impactScore[option.qualityImpact ?? "medium"] * 1.5;
  const maintain = impactScore[option.maintainability ?? "medium"];
  const advantageBoost = (option.advantages?.length ?? 0) * 0.5;
  const limitationPenalty = (option.limitations?.length ?? 0) * 0.3;
  return cost + risk + quality + maintain + advantageBoost - limitationPenalty;
};

export const compareScenarioOptions = (
  scenario: EssaeScenarioInput
): EssaeOptionComparison[] =>
  scenario.options.map((option) => {
    const advantages =
      option.advantages && option.advantages.length > 0
        ? option.advantages
        : [`Engineering merits of ${option.label} to be validated.`];
    const limitations =
      option.limitations && option.limitations.length > 0
        ? option.limitations
        : [`Limitations of ${option.label} require detailed review.`];
    const lifecycleConsiderations =
      option.lifecycleConsiderations && option.lifecycleConsiderations.length > 0
        ? option.lifecycleConsiderations
        : ["Lifecycle cost and maintenance to be evaluated."];

    return {
      optionId: option.id,
      label: option.label,
      advantages,
      limitations,
      costImpact: option.costImpact ?? "medium",
      riskImpact: option.riskImpact ?? "medium",
      qualityImpact: option.qualityImpact ?? "medium",
      maintainability: option.maintainability ?? "medium",
      lifecycleConsiderations,
      score: scoreOption(option),
    };
  });

export const buildComparisonMatrix = (
  scenario: EssaeScenarioInput,
  comparisons: EssaeOptionComparison[]
): EssaeComparisonMatrix => {
  const criteria = loadComparisonCriteria().criteria.map((entry) => entry.id);

  return {
    criteria,
    options: comparisons.map((comparison) => ({
      optionId: comparison.optionId,
      label: comparison.label,
      values: {
        advantages: comparison.advantages.join("; "),
        limitations: comparison.limitations.join("; "),
        costImpact: comparison.costImpact,
        riskImpact: comparison.riskImpact,
        qualityImpact: comparison.qualityImpact,
        maintainability: comparison.maintainability,
        lifecycleConsiderations: comparison.lifecycleConsiderations.join("; "),
        score: Math.round(comparison.score * 10) / 10,
      },
    })),
  };
};

export const selectRecommendedOption = (
  comparisons: EssaeOptionComparison[]
): EssaeOptionComparison | null => {
  if (comparisons.length === 0) {
    return null;
  }
  return [...comparisons].sort((left, right) => right.score - left.score)[0];
};
