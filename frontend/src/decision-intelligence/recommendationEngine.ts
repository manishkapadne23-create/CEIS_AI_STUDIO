export {
  buildEngineeringRecommendation,
  formatRecommendationForPrompt,
  isRecommendationQuery,
} from "../decision-support/recommendationEngine";

import type { DecisionConfidenceLevel, StructuredDecisionOutput } from "./types";
import { getDecisionCriteriaForDiscipline } from "./disciplineRegistry";
import { getStandardsCatalogByDisciplineId } from "../config/standards";

export const buildStructuredDecisionOutput = (
  problemStatement: string,
  alternatives: string[],
  disciplineId: string | null,
  confidenceLevel: DecisionConfidenceLevel
): StructuredDecisionOutput => {
  const standards =
    getStandardsCatalogByDisciplineId(disciplineId ?? "")?.standards
      .slice(0, 6)
      .map((standard) => standard.codeNumber ?? standard.title) ?? [];

  const advantages: Record<string, string[]> = {};
  const limitations: Record<string, string[]> = {};

  for (const alternative of alternatives) {
    advantages[alternative] = [
      "To be evaluated against discipline-specific criteria",
      ...getDecisionCriteriaForDiscipline(disciplineId).slice(0, 2).map(
        (criterion) => `Assess ${criterion.toLowerCase()} advantage`
      ),
    ];
    limitations[alternative] = [
      "Identify technical, commercial, and execution constraints",
      "Document assumptions and data gaps",
    ];
  }

  return {
    problemStatement,
    availableAlternatives: alternatives,
    advantages,
    limitations,
    applicableStandards:
      standards.length > 0 ? standards : ["Applicable national/international codes per project"],
    engineeringAssumptions: [
      "Analysis supports engineering judgment — not an automatic decision",
      "Site-specific conditions assumed typical unless stated",
      "Economic data indicative unless detailed estimates are provided",
    ],
    risks: [
      "Technical risk — design/specification adequacy",
      "Commercial risk — cost and market exposure",
      "Execution risk — constructability and resources",
      "Safety and environmental risk — per applicable standards",
    ],
    recommendedOption: null,
    confidenceLevel,
  };
};

export const formatStructuredOutputForPrompt = (
  output: StructuredDecisionOutput
): string =>
  [
    "MANDATORY DECISION OUTPUT FORMAT (EDIE):",
    "1. Problem Statement",
    "2. Available Alternatives",
    "3. Advantages (per alternative)",
    "4. Limitations (per alternative)",
    "5. Applicable Standards",
    "6. Engineering Assumptions",
    "7. Risks",
    "8. Recommended Option (with justification — engineer retains final decision)",
    `9. Confidence Level: ${output.confidenceLevel}`,
    "",
    `Problem: ${output.problemStatement}`,
    `Alternatives: ${output.availableAlternatives.join(" | ")}`,
    `Standards: ${output.applicableStandards.join(", ")}`,
    `Assumptions: ${output.engineeringAssumptions.join("; ")}`,
  ].join("\n");
