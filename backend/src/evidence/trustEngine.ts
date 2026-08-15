import { loadTrustLevels } from "./loadEvidenceConfig.js";
import type {
  EvidenceCitation,
  EvidenceItem,
  EvidenceTrustLevelId,
  TrustAssessment,
} from "./types.js";

export const assessTrust = (
  citations: EvidenceCitation[],
  evidenceItems: EvidenceItem[]
): TrustAssessment => {
  const verifiedCount = citations.filter(
    (citation) => citation.classification === "verified-knowledge"
  ).length;

  const avgConfidence =
    citations.length > 0
      ? citations.reduce((sum, citation) => sum + citation.confidence, 0) /
        citations.length
      : 0.3;

  const evidenceBoost = Math.min(evidenceItems.length * 0.05, 0.2);
  const score = Math.min(avgConfidence + evidenceBoost, 1);

  const levels = loadTrustLevels().sort((left, right) => right.minScore - left.minScore);
  const matched =
    levels.find((level) => score >= level.minScore) ??
    levels[levels.length - 1];

  const level = matched.id as EvidenceTrustLevelId;

  const rationale =
    verifiedCount >= 3
      ? `${verifiedCount} verified references with strong standard coverage.`
      : verifiedCount >= 1
        ? `${verifiedCount} verified reference(s); supplement with project-specific validation.`
        : "Limited verified references — treat as AI-assisted analysis.";

  return {
    level,
    label: matched.label,
    score: Number(score.toFixed(2)),
    rationale,
  };
};
