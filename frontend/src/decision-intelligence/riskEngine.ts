import {
  buildRiskAnalysisFramework,
  formatRiskForPrompt,
  isRiskAnalysisQuery,
  RISK_CATEGORIES,
} from "../decision-support/riskAnalyzer";
import type { RiskCategory } from "../decision-support/types";

export { buildRiskAnalysisFramework, formatRiskForPrompt, isRiskAnalysisQuery, RISK_CATEGORIES };

export const EDIE_RISK_CATEGORIES: RiskCategory[] = [
  ...RISK_CATEGORIES,
  {
    id: "commercial",
    label: "Commercial Risk",
    examples: ["Cost overrun", "Market volatility", "Funding gaps", "Contract exposure"],
  },
  {
    id: "execution",
    label: "Execution Risk",
    examples: ["Resource constraints", "Coordination failure", "Supply chain disruption"],
  },
  {
    id: "quality",
    label: "Quality Risk",
    examples: ["Non-conformance", "Rework", "Testing failure", "Specification deviation"],
  },
  {
    id: "schedule",
    label: "Schedule Risk",
    examples: ["Delays", "Critical path slippage", "Permitting delays", "Interface delays"],
  },
];

export const buildEdieRiskFramework = () => {
  const base = buildRiskAnalysisFramework();
  const matrixSkeleton = [
    "## Engineering Risk Register",
    "",
    "| Risk Type | Risk Description | Severity | Likelihood | Mitigation |",
    "| --- | --- | --- | --- | --- |",
    ...EDIE_RISK_CATEGORIES.map(
      (category) =>
        `| ${category.label} | [Identify risk] | [L/M/H/C] | [Rare–Almost Certain] | [Mitigation] |`
    ),
    "",
    "**Cover:** Technical, Commercial, Execution, Quality, Safety, Environmental, and Schedule risks.",
  ].join("\n");

  return {
    ...base,
    categories: EDIE_RISK_CATEGORIES,
    matrixSkeleton,
  };
};

export const formatEdieRiskForPrompt = (
  framework: ReturnType<typeof buildEdieRiskFramework> | null
): string => {
  if (!framework) {
    return "";
  }

  return [
    "RISK EVALUATION (EDIE — decision support, not automatic decision):",
    framework.categories.map((category) => `- ${category.label}`).join("\n"),
    "",
    framework.matrixSkeleton,
    "",
    framework.mitigationPrompt,
  ].join("\n");
};

export const buildRiskRegisterReport = (
  problemStatement: string,
  disciplineName: string | null
): string =>
  [
    "# Risk Register",
    "",
    `**Context:** ${problemStatement.slice(0, 200)}`,
    disciplineName ? `**Discipline:** ${disciplineName}` : "",
    "",
    buildEdieRiskFramework().matrixSkeleton,
  ]
    .filter(Boolean)
    .join("\n");
