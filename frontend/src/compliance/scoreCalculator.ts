import type {
  ComplianceArtifactType,
  EngineeringScores,
  IdentifiedRisk,
  StandardsValidationResult,
  ValidationCheck,
} from "./types";

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

export const calculateEngineeringScores = (
  message: string,
  artifactType: ComplianceArtifactType,
  standardsValidation: StandardsValidationResult,
  validationChecks: ValidationCheck[],
  risks: IdentifiedRisk[]
): EngineeringScores => {
  let completenessScore = 70;
  let complianceScore = 75;
  let documentationScore = 70;

  if (standardsValidation.referencedStandards.length > 0) {
    complianceScore += 10;
    documentationScore += 5;
  }

  if (standardsValidation.missingReferences.length > 0) {
    complianceScore -= standardsValidation.missingReferences.length * 8;
    completenessScore -= standardsValidation.missingReferences.length * 5;
  }

  if (/\bcomplete|final|approved|submitted\b/i.test(message)) {
    completenessScore += 10;
    documentationScore += 10;
  }

  if (/\bdraft|preliminary|concept\b/i.test(message)) {
    completenessScore -= 15;
    documentationScore -= 10;
  }

  const artifactBonus: Partial<Record<ComplianceArtifactType, number>> = {
    boq: 5,
    specification: 5,
    dpr: 8,
    "method-statement": 5,
    "qa-qc-document": 10,
  };
  completenessScore += Math.min(validationChecks.length * 2, 10);
  completenessScore += artifactBonus[artifactType] ?? 0;

  const highRisks = risks.filter(
    (r) => r.severity === "high" || r.severity === "critical"
  ).length;
  const mediumRisks = risks.filter((r) => r.severity === "medium").length;

  const riskScore = clamp(
    20 + highRisks * 25 + mediumRisks * 10 + standardsValidation.missingReferences.length * 5
  );

  completenessScore = clamp(completenessScore);
  complianceScore = clamp(complianceScore);
  documentationScore = clamp(documentationScore);

  let reviewConfidence: EngineeringScores["reviewConfidence"] = "medium";
  if (message.length > 200 && standardsValidation.referencedStandards.length >= 2) {
    reviewConfidence = "high";
  } else if (message.length < 50 || standardsValidation.referencedStandards.length === 0) {
    reviewConfidence = "preliminary";
  } else if (highRisks > 0) {
    reviewConfidence = "low";
  }

  return {
    completenessScore,
    complianceScore,
    riskScore,
    documentationScore,
    reviewConfidence,
  };
};

export const formatScoresForPrompt = (scores: EngineeringScores): string => {
  return [
    "ENGINEERING SCORES (assess and report):",
    `- Completeness Score: ${scores.completenessScore}/100`,
    `- Compliance Score: ${scores.complianceScore}/100`,
    `- Risk Score: ${scores.riskScore}/100 (higher = more risk)`,
    `- Documentation Score: ${scores.documentationScore}/100`,
    `- Review Confidence: ${scores.reviewConfidence}`,
    "",
    "Provide scored assessment with justification for each score.",
  ].join("\n");
};
