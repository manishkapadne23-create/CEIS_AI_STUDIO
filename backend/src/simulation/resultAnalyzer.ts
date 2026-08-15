import {
  buildComparisonMatrix,
  compareScenarioOptions,
  selectRecommendedOption,
} from "./comparisonEngine.js";
import { loadFutureIntegrations } from "./loadSimulationConfig.js";
import type {
  EssaeScenarioInput,
  EssaeSimulationResults,
  EssaeValidationResult,
} from "./types.js";

const buildRiskAssessment = (
  scenario: EssaeScenarioInput,
  comparisons: ReturnType<typeof compareScenarioOptions>
): string[] => {
  const risks: string[] = [];

  for (const comparison of comparisons) {
    if (comparison.riskImpact === "high") {
      risks.push(`${comparison.label}: elevated risk impact — mitigation plan required.`);
    }
    if (comparison.costImpact === "high") {
      risks.push(`${comparison.label}: high cost impact — budget review recommended.`);
    }
  }

  if (scenario.scenarioType === "ENVIRONMENTAL_SCENARIOS") {
    risks.push("Environmental compliance and clearance requirements must be verified.");
  }
  if (scenario.scenarioType === "RISK_SCENARIOS") {
    risks.push("Risk register update and stakeholder review recommended.");
  }

  if (risks.length === 0) {
    risks.push("Standard engineering risks apply — validate with project-specific data.");
  }

  return risks;
};

export const analyzeSimulationResults = (
  scenario: EssaeScenarioInput,
  validation: EssaeValidationResult
): EssaeSimulationResults => {
  const comparisons = compareScenarioOptions(scenario);
  const matrix = buildComparisonMatrix(scenario, comparisons);
  const recommended = selectRecommendedOption(comparisons);
  const discipline = scenario.disciplineName ?? "Engineering";
  const scenarioLabel = scenario.scenarioType.replace(/_/g, " ").toLowerCase();

  const engineeringRecommendations = [
    `Conduct detailed engineering analysis for ${recommended?.label ?? "preferred option"}.`,
    "Document all assumptions and validate input parameters.",
    "Perform interdisciplinary review before final decision.",
    ...(validation.warnings.length > 0
      ? validation.warnings.map((warning) => `Address: ${warning}`)
      : []),
  ];

  const decisionSupportNotes = comparisons.map(
    (comparison) =>
      `${comparison.label} (score ${comparison.score.toFixed(1)}): cost=${comparison.costImpact}, risk=${comparison.riskImpact}, quality=${comparison.qualityImpact}`
  );

  const executiveSummary = [
    `${discipline} ${scenarioLabel} analysis: ${scenario.title}.`,
    `${comparisons.length} alternatives evaluated.`,
    recommended
      ? `Recommended: ${recommended.label} based on balanced cost, risk, quality, and maintainability.`
      : "No recommendation — insufficient data.",
    loadFutureIntegrations().disclaimer,
  ].join(" ");

  const results: EssaeSimulationResults = {
    simulationSummary: `AI-assisted scenario analysis for "${scenario.title}" across ${comparisons.length} engineering alternatives.`,
    comparisonMatrix: matrix,
    optionComparisons: comparisons,
    engineeringRecommendations,
    decisionSupportNotes,
    riskAssessment: buildRiskAssessment(scenario, comparisons),
    executiveSummary,
    recommendedOptionId: recommended?.optionId ?? null,
    promptAugmentation: "",
  };

  results.promptAugmentation = buildSimulationPromptAugmentation(scenario, results);
  return results;
};

export const buildSimulationPromptAugmentation = (
  scenario: EssaeScenarioInput,
  results: EssaeSimulationResults
): string => {
  const sections = [
    "## Engineering Scenario Analysis Context",
    loadFutureIntegrations().disclaimer,
    `Scenario: ${scenario.title} (${scenario.scenarioType})`,
    results.simulationSummary,
    "",
    "### Options Compared",
    ...results.optionComparisons.map(
      (option) =>
        `- **${option.label}** (score ${option.score.toFixed(1)}): advantages=${option.advantages.slice(0, 2).join("; ") || "TBD"}; limitations=${option.limitations.slice(0, 2).join("; ") || "TBD"}; cost=${option.costImpact}, risk=${option.riskImpact}, quality=${option.qualityImpact}, maintainability=${option.maintainability}`
    ),
  ];

  if (results.engineeringRecommendations.length > 0) {
    sections.push(
      "",
      "### Engineering Recommendations",
      ...results.engineeringRecommendations.slice(0, 4).map((entry) => `- ${entry}`)
    );
  }

  if (results.riskAssessment.length > 0) {
    sections.push(
      "",
      "### Risk Notes",
      ...results.riskAssessment.slice(0, 3).map((entry) => `- ${entry}`)
    );
  }

  if (results.recommendedOptionId) {
    const recommended = results.optionComparisons.find(
      (option) => option.optionId === results.recommendedOptionId
    );
    if (recommended) {
      sections.push("", `### Recommended Option: ${recommended.label}`);
    }
  }

  if (scenario.assumptions?.length) {
    sections.push(
      "",
      "### Assumptions",
      ...scenario.assumptions.map((assumption) => `- ${assumption}`)
    );
  }

  return sections.join("\n");
};
