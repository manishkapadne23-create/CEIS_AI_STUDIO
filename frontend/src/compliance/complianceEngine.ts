import {
  formatStandardsValidationForPrompt,
  validateStandardsCompliance,
} from "./standardsValidator";
import {
  buildValidationChecks,
  detectArtifactType,
  detectReviewIntent,
  formatValidationChecksForPrompt,
  isComplianceQuery,
  resolveValidationTypes,
} from "./validationEngine";
import {
  formatRisksForPrompt,
  identifyComplianceRisks,
} from "./riskIdentifier";
import {
  buildComplianceOutputPlan,
  buildReviewCommentsFramework,
  formatComplianceOutputForPrompt,
} from "./reviewGenerator";
import {
  calculateEngineeringScores,
  formatScoresForPrompt,
} from "./scoreCalculator";
import type {
  ComplianceEngineInput,
  ComplianceEngineResult,
  ComplianceExtensionHooks,
} from "./types";

let extensionHooks: ComplianceExtensionHooks = {};

export const setComplianceExtensionHooks = (
  hooks: ComplianceExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getComplianceExtensionHooks = (): ComplianceExtensionHooks =>
  extensionHooks;

/** Run Engineering Compliance & Validation Engine for a user turn. */
export const runComplianceEngine = (
  input: ComplianceEngineInput
): ComplianceEngineResult => {
  const inactive: ComplianceEngineResult = {
    active: false,
    artifactType: "general",
    reviewIntent: "general-compliance-review",
    validationTypes: [],
    standardsValidation: {
      referencedStandards: [],
      applicableFamilies: [],
      missingReferences: [],
      complianceNotes: [],
    },
    validationChecks: [],
    identifiedRisks: [],
    scores: {
      completenessScore: 0,
      complianceScore: 0,
      riskScore: 0,
      documentationScore: 0,
      reviewConfidence: "preliminary",
    },
    outputPlan: { outputs: [], outline: "" },
    promptAugmentation: "",
    summaryText: "",
  };

  if (!isComplianceQuery(input.userMessage)) {
    return inactive;
  }

  const reviewIntent = detectReviewIntent(input.userMessage);
  const artifactType = detectArtifactType(input.userMessage, reviewIntent);
  const validationTypes = resolveValidationTypes(artifactType, input.userMessage);

  const standardsValidation = validateStandardsCompliance(
    input.userMessage,
    input.disciplineId,
    input.selectedStandardCode
  );

  const validationChecks = buildValidationChecks(validationTypes, artifactType);
  const identifiedRisks = identifyComplianceRisks(
    input.userMessage,
    artifactType,
    standardsValidation
  );

  const scores = calculateEngineeringScores(
    input.userMessage,
    artifactType,
    standardsValidation,
    validationChecks,
    identifiedRisks
  );

  const outputPlan = buildComplianceOutputPlan(artifactType, reviewIntent);

  const extensionNotes: string[] = [];
  if (extensionHooks.tenderComplianceEnabled) {
    extensionNotes.push("Tender compliance enabled");
  }
  if (extensionHooks.contractComplianceEnabled) {
    extensionNotes.push("Contract compliance enabled");
  }
  if (extensionHooks.pmisQaqcProjectId) {
    extensionNotes.push(`PMIS QA/QC: ${extensionHooks.pmisQaqcProjectId}`);
  }
  if (extensionHooks.auditEngineEnabled) {
    extensionNotes.push("Audit engine enabled");
  }
  if (extensionHooks.isoComplianceEnabled) {
    extensionNotes.push("ISO compliance enabled");
  }
  if (extensionHooks.digitalReviewWorkflowId) {
    extensionNotes.push(`Digital review: ${extensionHooks.digitalReviewWorkflowId}`);
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Compliance & Validation Engine (ECVE)",
    "========================================",
    "AI-assisted validation tool — verify engineering work against standards, specifications, best practices, and project requirements.",
    "",
    `Review intent: ${reviewIntent.replace(/-/g, " ")}`,
    `Artifact type: ${artifactType.replace(/-/g, " ")}`,
    input.disciplineName ? `Discipline: ${input.disciplineName}` : "",
    input.projectName ? `Project: ${input.projectName}` : "",
    "",
    "STANDARDS COMPLIANCE CHECK:",
    formatStandardsValidationForPrompt(standardsValidation),
    "",
    "VALIDATION CHECKS:",
    formatValidationChecksForPrompt(validationChecks),
    "",
    "IDENTIFIED RISKS:",
    formatRisksForPrompt(identifiedRisks),
    "",
    formatScoresForPrompt(scores),
    "",
    formatComplianceOutputForPrompt(outputPlan),
    "",
    buildReviewCommentsFramework(validationChecks, identifiedRisks),
    "",
    "ECVE INSTRUCTIONS:",
    "- Validate design, calculations, specifications, BOQ, reports, method statements, inspection formats, QA/QC documents",
    "- Check compliance with IRC, IS, MoRTH, NBC, ASME, API, IEC, IEEE, ISO, ASTM, AASHTO",
    "- Identify missing clauses, conflicting requirements, incomplete information",
    "- Flag engineering, constructability, maintainability, and safety concerns",
    "- Generate compliance report, validation checklist, review comments, and non-compliance summary",
  extensionNotes.length > 0
      ? `\nFuture capabilities: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `ECVE: ${reviewIntent}`,
    `Artifact: ${artifactType}`,
    `Checks: ${validationChecks.length}`,
    `Risks: ${identifiedRisks.length}`,
    `Compliance: ${scores.complianceScore}/100`,
    `Confidence: ${scores.reviewConfidence}`,
  ].join(" | ");

  return {
    active: true,
    artifactType,
    reviewIntent,
    validationTypes,
    standardsValidation,
    validationChecks,
    identifiedRisks,
    scores,
    outputPlan,
    promptAugmentation,
    summaryText,
  };
};

export const formatComplianceForPrompt = (
  result: ComplianceEngineResult
): string => result.promptAugmentation;
