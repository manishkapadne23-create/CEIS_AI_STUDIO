import {
  buildComparisonTable,
  formatComparisonForPrompt,
  isComparisonQuery,
} from "./comparisonEngine";
import {
  buildDecisionAnalysisFramework,
  formatDecisionFrameworkForPrompt,
  formatDecisionOutputsForPrompt,
  planDecisionOutputs,
} from "./reportGenerator";
import {
  buildEngineeringRecommendation,
  formatRecommendationForPrompt,
  isRecommendationQuery,
} from "./recommendationEngine";
import {
  buildRiskAnalysisFramework,
  formatRiskForPrompt,
  isRiskAnalysisQuery,
} from "./riskAnalyzer";
import type {
  DecisionSupportCategory,
  DecisionSupportEngineInput,
  DecisionSupportExtensionHooks,
  DecisionSupportResult,
} from "./types";
import {
  buildValueEngineeringFramework,
  formatValueEngineeringForPrompt,
  isValueEngineeringQuery,
} from "./valueEngineering";

let extensionHooks: DecisionSupportExtensionHooks = {};

export const setDecisionSupportExtensionHooks = (
  hooks: DecisionSupportExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getDecisionSupportExtensionHooks =
  (): DecisionSupportExtensionHooks => extensionHooks;

const DECISION_SUPPORT_TRIGGERS =
  /\b(compare|comparison|versus|vs\.?|difference between|which is better|evaluate alternatives|pros and cons|trade[\s-]off|decide|decision|recommend|risk\s+analysis|risk\s+assessment|value\s+engineering|cost\s+optimi[sz]ation|life[\s-]cycle\s+cost|choose\s+between|help\s+me\s+decide|assess\s+options)\b/i;

export const isDecisionSupportQuery = (
  message: string,
  followUpIntent?: string | null
): boolean =>
  DECISION_SUPPORT_TRIGGERS.test(message) || followUpIntent === "compare";

const resolveCategory = (
  isComparison: boolean,
  isRisk: boolean,
  isValueEng: boolean,
  isRecommendation: boolean
): DecisionSupportCategory => {
  if (isComparison) return "comparison";
  if (isRisk) return "risk-analysis";
  if (isValueEng) return "value-engineering";
  if (isRecommendation) return "engineering-recommendation";
  return "general-decision";
};

const inferUserIntent = (
  category: DecisionSupportCategory,
  message: string
): string => {
  const normalized = message.toLowerCase();

  if (/material/i.test(normalized)) return "material-comparison";
  if (/standard|specification|code/i.test(normalized)) return "standards-comparison";
  if (/equipment|plant|machinery/i.test(normalized)) return "equipment-comparison";
  if (/method|construction|execution/i.test(normalized)) return "construction-method-comparison";
  if (/technolog/i.test(normalized)) return "technology-comparison";

  const categoryMap: Record<DecisionSupportCategory, string> = {
    comparison: "design-alternative-comparison",
    "risk-analysis": "engineering-risk-analysis",
    "value-engineering": "value-engineering-analysis",
    "engineering-recommendation": "engineering-recommendation",
    "general-decision": "general-engineering-decision",
  };

  return categoryMap[category];
};

/** Run the Engineering Decision Support System for a user turn. */
export const runDecisionSupportEngine = (
  input: DecisionSupportEngineInput
): DecisionSupportResult => {
  const inactive: DecisionSupportResult = {
    active: false,
    category: null,
    userIntent: "none",
    comparison: null,
    decisionFramework: null,
    riskFramework: null,
    valueEngineering: null,
    recommendation: null,
    outputPlan: null,
    promptAugmentation: "",
    summaryText: "",
  };

  if (!isDecisionSupportQuery(input.userMessage, input.followUpIntent)) {
    return inactive;
  }

  const comparisonActive = isComparisonQuery(input.userMessage);
  const riskActive =
    isRiskAnalysisQuery(input.userMessage) || comparisonActive;
  const valueEngActive = isValueEngineeringQuery(input.userMessage);
  const recommendationActive =
    isRecommendationQuery(input.userMessage) || comparisonActive;

  const comparison = buildComparisonTable(input.userMessage);

  const alternatives =
    comparison?.alternatives.map((alt) => alt.name) ?? [];

  const category = resolveCategory(
    comparisonActive,
    isRiskAnalysisQuery(input.userMessage),
    valueEngActive,
    recommendationActive
  );

  const decisionFramework = buildDecisionAnalysisFramework(
    input.userMessage,
    alternatives
  );

  const riskFramework = riskActive ? buildRiskAnalysisFramework() : null;

  const valueEngineering = valueEngActive
    ? buildValueEngineeringFramework(input.userMessage)
    : comparisonActive
      ? buildValueEngineeringFramework(input.userMessage)
      : null;

  const recommendation = buildEngineeringRecommendation(
    input.userMessage,
    input.disciplineId,
    input.disciplineName,
    alternatives.length >= 2
  );

  const outputPlan = planDecisionOutputs(
    comparison !== null,
    riskFramework !== null
  );

  const promptSections = [
    "========================================",
    "Engineering Decision Support System (EDSS)",
    "========================================",
    "You are supporting an engineering decision. Enhance engineering judgment — do not replace it.",
    "Provide structured, standards-aware analysis. Use markdown tables where appropriate.",
    "",
    formatDecisionFrameworkForPrompt(decisionFramework),
    formatComparisonForPrompt(comparison),
    formatRiskForPrompt(riskFramework),
    formatValueEngineeringForPrompt(valueEngineering),
    formatRecommendationForPrompt(recommendation),
    formatDecisionOutputsForPrompt(outputPlan, comparison, riskFramework),
  ].filter(Boolean);

  if (extensionHooks.mcdaEnabled) {
    promptSections.push(
      "",
      "MCDA (future): Multi-criteria decision analysis weights can be applied when enabled."
    );
  }
  if (extensionHooks.aiOptimizationEnabled) {
    promptSections.push(
      "AI Optimization (future): Automated option ranking available when enabled."
    );
  }
  if (extensionHooks.scenarioAnalysisEnabled) {
    promptSections.push(
      "Scenario Analysis (future): What-if scenarios can be modelled when enabled."
    );
  }
  if (extensionHooks.pmisDecisionEngineProjectId) {
    promptSections.push(
      `PMIS Decision Engine (future): Project ${extensionHooks.pmisDecisionEngineProjectId}`
    );
  }

  const promptAugmentation = promptSections.join("\n");

  const summaryText = [
    `EDSS active: ${category}`,
    comparison ? `Comparison: ${comparison.title}` : "",
    riskFramework ? "Risk analysis framework loaded" : "",
    valueEngineering ? `Value engineering: ${valueEngineering.focusAreas.join(", ")}` : "",
    `Confidence: ${recommendation.confidenceLevel}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active: true,
    category,
    userIntent: inferUserIntent(category, input.userMessage),
    comparison,
    decisionFramework,
    riskFramework,
    valueEngineering,
    recommendation,
    outputPlan,
    promptAugmentation,
    summaryText,
  };
};

export const formatDecisionSupportForPrompt = (
  result: DecisionSupportResult
): string => result.promptAugmentation;

export const getDecisionSupportSummary = (
  result: DecisionSupportResult
): string => result.summaryText;
