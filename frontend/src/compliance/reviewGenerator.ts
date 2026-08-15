import type {
  ComplianceArtifactType,
  ComplianceOutputPlan,
  ComplianceReviewIntent,
  IdentifiedRisk,
  ValidationCheck,
} from "./types";

export const buildComplianceOutputPlan = (
  artifactType: ComplianceArtifactType,
  reviewIntent: ComplianceReviewIntent
): ComplianceOutputPlan => {
  const outputs: ComplianceOutputPlan["outputs"] = [
    "compliance-report",
    "validation-checklist",
    "missing-items",
    "potential-risks",
    "review-comments",
    "recommendations",
    "non-compliance-summary",
  ];

  const artifactLabel = artifactType.replace(/-/g, " ");

  const outline = [
    `# Engineering Compliance & Validation Report`,
    "",
    `## 1. Executive Summary`,
    `Compliance review of ${artifactLabel} (${reviewIntent.replace(/-/g, " ")}).`,
    "",
    `## 2. Validation Checklist`,
    "Structured checklist with pass/warn/fail status per validation type.",
    "",
    `## 3. Standards Compliance`,
    "IRC, IS, MoRTH, NBC, IEC, and discipline-specific code compliance assessment.",
    "",
    `## 4. Missing Items`,
    "List of missing information, clauses, references, and supporting documents.",
    "",
    `## 5. Potential Risks`,
    "Missing clauses, conflicting requirements, engineering/constructability/maintainability/safety risks.",
    "",
    `## 6. Review Comments`,
    "Professional engineering review comments with severity and recommended action.",
    "",
    `## 7. Recommendations`,
    "Prioritized recommendations for compliance improvement.",
    "",
    `## 8. Non-Compliance Summary`,
    "Summary of non-compliant items requiring resolution before approval.",
    "",
    `## 9. Engineering Scores`,
    "Completeness, Compliance, Risk, Documentation scores and review confidence.",
  ].join("\n");

  return { outputs, outline };
};

export const buildReviewCommentsFramework = (
  checks: ValidationCheck[],
  risks: IdentifiedRisk[]
): string => {
  return [
    "REVIEW COMMENTS FORMAT:",
    "For each finding provide:",
    "- Comment ID",
    "- Severity (Critical / Major / Minor / Observation)",
    "- Location / Clause reference",
    "- Finding description",
    "- Recommended action",
    "- Applicable standard (if any)",
    "",
    `Validation checks to address: ${checks.length}`,
    `Risks to address: ${risks.length}`,
  ].join("\n");
};

export const formatComplianceOutputForPrompt = (
  plan: ComplianceOutputPlan
): string => {
  return [
    "REQUIRED OUTPUTS:",
    plan.outputs.map((output) => `- ${output.replace(/-/g, " ")}`).join("\n"),
    "",
    "Report outline:",
    plan.outline,
  ].join("\n");
};
