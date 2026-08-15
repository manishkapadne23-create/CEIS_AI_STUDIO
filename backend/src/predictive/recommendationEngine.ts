import { loadRecommendationCategories } from "./loadPredictiveConfig.js";
import type { BehaviorAnalysis } from "./behaviorAnalyzer.js";
import type { PredictiveContextInput, PredictiveRecommendation } from "./types.js";

export const generateRecommendations = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveRecommendation[] => {
  const categories = loadRecommendationCategories();
  const discipline = input.disciplineName ?? "your discipline";
  const specialization = input.specializationName ?? "current specialization";
  const topic = input.lastTopic ?? behavior.recentTopics[0] ?? "current engineering work";

  const recommendations: PredictiveRecommendation[] = [];

  for (const category of categories) {
    let confidence = 0.5;
    let reason = `Relevant for ${discipline}.`;

    if (category.id === "standards" && (behavior.hasStandardsActivity || input.lastIntent === "code-search")) {
      confidence = 0.85;
      reason = "Recent standards activity detected.";
    }
    if (category.id === "calculators" && (behavior.hasCalculationsActivity || input.lastIntent === "calculation")) {
      confidence = 0.88;
      reason = "Calculation workflow in progress.";
    }
    if (category.id === "workflows" && behavior.hasWorkflowActivity) {
      confidence = 0.8;
      reason = "Active engineering workflow detected.";
    }
    if (category.id === "learning" && behavior.hasLearningActivity) {
      confidence = 0.75;
      reason = "Learning progress suggests follow-up resources.";
    }
    if (category.id === "qa-qc" && (input.lastIntent === "design" || input.lastIntent === "construction")) {
      confidence = 0.78;
      reason = "Design/construction phase may require QA/QC.";
    }
    if (category.id === "safety" && /construction|site|excavation/i.test(topic)) {
      confidence = 0.82;
      reason = "Construction-related topic — safety review recommended.";
    }

    recommendations.push({
      id: `rec-${category.id}`,
      categoryId: category.id,
      categoryLabel: category.label,
      title: `${category.label} for ${topic}`,
      description: `Proactive ${category.label.toLowerCase()} suggestion for ${specialization}.`,
      moduleId: category.moduleId,
      priority: category.priority,
      confidence,
      reason,
    });
  }

  return recommendations
    .sort((left, right) => right.confidence - left.confidence || right.priority - left.priority)
    .slice(0, 8);
};
