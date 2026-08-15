import type {
  ComparisonTable,
  DecisionAnalysisFramework,
  DecisionOutputPlan,
  DecisionOutputType,
  RiskAnalysisFramework,
} from "./types";

const DECISION_SECTIONS = [
  "Problem Statement",
  "Available Alternatives",
  "Advantages (per alternative)",
  "Disadvantages (per alternative)",
  "Cost Considerations",
  "Time Considerations",
  "Safety Considerations",
  "Environmental Impact",
  "Maintainability",
  "Future Scalability",
  "Applicable Standards",
  "Recommended Option",
  "Engineering Remarks",
];

export const buildDecisionAnalysisFramework = (
  message: string,
  alternatives: string[]
): DecisionAnalysisFramework => ({
  problemStatement: message.trim().slice(0, 500),
  availableAlternatives:
    alternatives.length > 0 ? alternatives : ["Alternative A", "Alternative B"],
  evaluationCriteria: DECISION_SECTIONS,
  requiredSections: DECISION_SECTIONS,
});

export const planDecisionOutputs = (
  hasComparison: boolean,
  hasRisk: boolean
): DecisionOutputPlan => {
  const outputs: DecisionOutputType[] = ["decision-report", "executive-summary"];

  if (hasComparison) {
    outputs.push("comparison-table");
  }
  if (hasRisk) {
    outputs.push("risk-matrix");
  }

  outputs.push("recommendation-note", "presentation-summary");

  const outline = [
    "# Engineering Decision Support Report",
    "",
    "## 1. Executive Summary",
    "Brief decision context, recommended option, and key rationale.",
    "",
    "## 2. Problem Statement",
    "Clear definition of the engineering decision to be made.",
    "",
    "## 3. Available Alternatives",
    "List and describe each option under consideration.",
    "",
    "## 4. Comparative Analysis",
    hasComparison
      ? "Structured comparison table with criteria (cost, time, safety, environment, maintainability, scalability, standards)."
      : "Qualitative comparison of alternatives.",
    "",
    "## 5. Risk Analysis",
    hasRisk
      ? "Risk matrix covering technical, construction, operational, maintenance, environmental, contractual, and safety risks with mitigation."
      : "Key risks and mitigation measures.",
    "",
    "## 6. Value Engineering Considerations",
    "Cost optimization, material/construction alternatives, life-cycle implications.",
    "",
    "## 7. Recommended Option",
    "Clear recommendation with confidence level, assumptions, and limitations.",
    "",
    "## 8. Engineering Remarks",
    "Professional judgment, caveats, and next steps.",
    "",
    "## 9. Presentation Summary",
    "5–8 bullet points suitable for stakeholder briefing.",
  ].join("\n");

  return { outputs, outline };
};

export const formatDecisionFrameworkForPrompt = (
  framework: DecisionAnalysisFramework | null
): string => {
  if (!framework) return "";

  return [
    "DECISION ANALYSIS (provide all sections):",
    framework.requiredSections.map((section, index) => `${index + 1}. ${section}`).join("\n"),
    "",
    `Problem context: ${framework.problemStatement}`,
    `Alternatives: ${framework.availableAlternatives.join(" | ")}`,
  ].join("\n");
};

export const formatDecisionOutputsForPrompt = (
  plan: DecisionOutputPlan | null,
  comparison: ComparisonTable | null,
  risk: RiskAnalysisFramework | null
): string => {
  if (!plan) return "";

  const parts = [
    "DECISION OUTPUTS TO GENERATE:",
    plan.outputs.map((output) => `- ${output.replace(/-/g, " ")}`).join("\n"),
    "",
    "Report outline:",
    plan.outline,
  ];

  if (comparison) {
    parts.push("", "Include comparison table as specified.");
  }
  if (risk) {
    parts.push("", "Include risk matrix as specified.");
  }

  return parts.join("\n");
};
