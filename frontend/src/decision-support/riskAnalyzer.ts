import type { RiskAnalysisFramework, RiskCategory } from "./types";

const RISK_TRIGGERS =
  /\b(risk\s+analysis|risk\s+assessment|risk\s+matrix|identify\s+risks|hazards?|mitigation|what\s+are\s+the\s+risks)\b/i;

export const RISK_CATEGORIES: RiskCategory[] = [
  {
    id: "technical",
    label: "Technical Risks",
    examples: ["Design inadequacy", "Specification gaps", "Interface conflicts", "Calculation errors"],
  },
  {
    id: "construction",
    label: "Construction Risks",
    examples: ["Site constraints", "Methodology challenges", "Resource availability", "Weather delays"],
  },
  {
    id: "operational",
    label: "Operational Risks",
    examples: ["Performance shortfall", "Capacity limitations", "Operational complexity"],
  },
  {
    id: "maintenance",
    label: "Maintenance Risks",
    examples: ["Access difficulty", "Spare parts availability", "Deterioration rate"],
  },
  {
    id: "environmental",
    label: "Environmental Risks",
    examples: ["Pollution", "Ecological impact", "Climate resilience", "Waste management"],
  },
  {
    id: "contractual",
    label: "Contractual Risks",
    examples: ["Scope ambiguity", "Claims exposure", "Payment delays", "Variation orders"],
  },
  {
    id: "safety",
    label: "Safety Risks",
    examples: ["Worker safety", "Public safety", "Hazardous operations", "Emergency response"],
  },
];

export const isRiskAnalysisQuery = (message: string): boolean =>
  RISK_TRIGGERS.test(message);

export const buildRiskAnalysisFramework = (): RiskAnalysisFramework => {
  const matrixSkeleton = [
    "## Risk Matrix",
    "",
    "| Risk Category | Risk Description | Severity (L/M/H/C) | Likelihood | Mitigation Measure |",
    "| --- | --- | --- | --- | --- |",
    ...RISK_CATEGORIES.map(
      (category) =>
        `| ${category.label} | [Identify specific risk] | [L/M/H/C] | [Rare–Almost Certain] | [Mitigation] |`
    ),
    "",
    "**Severity:** L=Low, M=Medium, H=High, C=Critical",
    "**Include mitigation measures for each identified risk.**",
  ].join("\n");

  return {
    categories: RISK_CATEGORIES,
    matrixSkeleton,
    mitigationPrompt:
      "For each risk, provide practical mitigation measures aligned with engineering best practices and applicable standards.",
  };
};

export const formatRiskForPrompt = (
  framework: RiskAnalysisFramework | null
): string => {
  if (!framework) return "";

  return [
    "RISK ANALYSIS (generate structured output):",
    "",
    "Cover all categories:",
    framework.categories.map((c) => `- ${c.label}`).join("\n"),
    "",
    framework.matrixSkeleton,
    "",
    framework.mitigationPrompt,
  ].join("\n");
};
