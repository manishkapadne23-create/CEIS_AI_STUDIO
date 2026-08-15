import type { ComparisonTable } from "../decision-support/types";
import type { DecisionMatrix, StructuredDecisionOutput } from "./types";
import { buildRiskRegisterReport } from "./riskEngine";

export const generateDecisionNote = (
  output: StructuredDecisionOutput
): string =>
  [
    "# Engineering Decision Note",
    "",
    "## Problem Statement",
    output.problemStatement,
    "",
    "## Alternatives Considered",
    ...output.availableAlternatives.map((alt) => `- ${alt}`),
    "",
    "## Recommended Option",
    output.recommendedOption ?? "_To be determined by engineer with supporting analysis_",
    "",
    `**Confidence:** ${output.confidenceLevel}`,
  ].join("\n");

export const generateTechnicalJustification = (
  output: StructuredDecisionOutput
): string =>
  [
    "# Technical Justification",
    "",
    "## Applicable Standards",
    ...output.applicableStandards.map((standard) => `- ${standard}`),
    "",
    "## Engineering Assumptions",
    ...output.engineeringAssumptions.map((assumption) => `- ${assumption}`),
    "",
    "## Advantages & Limitations",
    ...output.availableAlternatives.flatMap((alternative) => [
      `### ${alternative}`,
      "**Advantages:**",
      ...(output.advantages[alternative] ?? []).map((item) => `- ${item}`),
      "**Limitations:**",
      ...(output.limitations[alternative] ?? []).map((item) => `- ${item}`),
      "",
    ]),
  ].join("\n");

export const generateComparisonReport = (
  comparison: ComparisonTable | null,
  matrix: DecisionMatrix | null
): string => {
  const sections = ["# Engineering Comparison Report", ""];

  if (comparison) {
    sections.push(comparison.markdownSkeleton, "");
  }
  if (matrix) {
    sections.push(matrix.markdownTable, "");
  }
  if (!comparison && !matrix) {
    sections.push("_Provide alternatives to generate a structured comparison._");
  }

  return sections.join("\n");
};

export const generateRecommendationSummary = (
  output: StructuredDecisionOutput
): string =>
  [
    "# Recommendation Summary",
    "",
    `**Recommended Option:** ${output.recommendedOption ?? "Pending engineering evaluation"}`,
    `**Confidence Level:** ${output.confidenceLevel}`,
    "",
    "**Key Risks:**",
    ...output.risks.map((risk) => `- ${risk}`),
    "",
    "_This is decision support — final decision rests with the qualified engineer._",
  ].join("\n");

export const generateExecutiveBrief = (
  output: StructuredDecisionOutput,
  disciplineName: string | null
): string =>
  [
    "# Executive Decision Brief",
    "",
    disciplineName ? `**Discipline:** ${disciplineName}` : "",
    "",
    "## Decision Context",
    output.problemStatement.slice(0, 300),
    "",
    "## Options",
    output.availableAlternatives.map((alt, index) => `${index + 1}. ${alt}`).join("\n"),
    "",
    "## Recommendation",
    output.recommendedOption ?? "Engineering evaluation in progress",
    "",
    `## Confidence: ${output.confidenceLevel}`,
    "",
    "## Next Steps",
    "- Validate assumptions and site-specific data",
    "- Complete risk register review",
    "- Obtain stakeholder and peer review as required",
  ]
    .filter(Boolean)
    .join("\n");

export const buildDecisionReports = (
  output: StructuredDecisionOutput,
  comparison: ComparisonTable | null,
  matrix: DecisionMatrix | null,
  disciplineName: string | null
) => ({
  decisionNote: generateDecisionNote(output),
  technicalJustification: generateTechnicalJustification(output),
  comparisonReport: generateComparisonReport(comparison, matrix),
  riskRegister: buildRiskRegisterReport(output.problemStatement, disciplineName),
  recommendationSummary: generateRecommendationSummary(output),
  executiveBrief: generateExecutiveBrief(output, disciplineName),
});
