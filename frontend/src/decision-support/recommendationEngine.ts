import { getStandardsCatalogByDisciplineId } from "../config/standards";
import type {
  DecisionConfidenceLevel,
  EngineeringDecisionRecommendation,
} from "./types";

const RECOMMENDATION_TRIGGERS =
  /\b(recommend|recommendation|which\s+should\s+(i|we)\s+choose|best\s+option|preferred\s+option|suggest\s+the\s+best|advise\s+on)\b/i;

const DECISION_TRIGGERS =
  /\b(decide|decision|evaluate|assess\s+options|choose\s+between|select\s+between|help\s+me\s+decide)\b/i;

export const isRecommendationQuery = (message: string): boolean =>
  RECOMMENDATION_TRIGGERS.test(message) || DECISION_TRIGGERS.test(message);

const inferConfidence = (
  message: string,
  hasAlternatives: boolean
): DecisionConfidenceLevel => {
  const normalized = message.toLowerCase();

  if (
    /preliminary|concept|rough|ballpark|initial\s+assessment/i.test(normalized)
  ) {
    return "preliminary";
  }
  if (
    hasAlternatives &&
    /detailed|complete\s+data|full\s+design|final/i.test(normalized)
  ) {
    return "high";
  }
  if (hasAlternatives) {
    return "medium";
  }
  return "preliminary";
};

const inferAssumptions = (message: string): string[] => {
  const assumptions: string[] = [];
  const normalized = message.toLowerCase();

  if (!/cost|budget|estimate/i.test(normalized)) {
    assumptions.push("Cost data not explicitly provided — use indicative ranges");
  }
  if (!/site|location|terrain|soil/i.test(normalized)) {
    assumptions.push("Site-specific conditions assumed typical unless stated");
  }
  if (!/traffic|load|capacity|demand/i.test(normalized)) {
    assumptions.push("Design loads/capacity based on standard practice for the context");
  }
  if (!/standard|code|irc|is\s+\d|astm|iec/i.test(normalized)) {
    assumptions.push("Applicable national/international standards per discipline defaults");
  }

  return assumptions;
};

const getDisciplineStandards = (
  disciplineId: string | null
): string[] => {
  if (!disciplineId) return [];

  const catalog = getStandardsCatalogByDisciplineId(disciplineId);
  return catalog?.standards.slice(0, 6).map((s) => s.codeNumber ?? s.title) ?? [];
};

export const buildEngineeringRecommendation = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null,
  hasAlternatives: boolean
): EngineeringDecisionRecommendation => {
  const applicableStandards = getDisciplineStandards(disciplineId);

  return {
    recommendedOption: null,
    confidenceLevel: inferConfidence(message, hasAlternatives),
    assumptions: inferAssumptions(message),
    engineeringLimitations: [
      "Decision support enhances engineering judgment — verify all calculations and site-specific conditions independently",
      "Recommendations are based on available information in the query; additional data may change the outcome",
      disciplineName
        ? `Discipline context: ${disciplineName}`
        : "Discipline context not fully specified",
    ],
    applicableStandards:
      applicableStandards.length > 0
        ? applicableStandards
        : ["Refer to applicable national codes and project specifications"],
    bestPractices: [
      "Document assumptions and basis of recommendation",
      "Perform sensitivity analysis on key variables (cost, time, risk)",
      "Consult relevant standards and obtain peer review for critical decisions",
      "Consider whole-life cost, not just initial cost",
    ],
    engineeringRemarks:
      "Provide a clear Recommended Option with engineering justification. State confidence level, assumptions, and limitations explicitly.",
  };
};

export const formatRecommendationForPrompt = (
  recommendation: EngineeringDecisionRecommendation | null
): string => {
  if (!recommendation) return "";

  return [
    "ENGINEERING RECOMMENDATION FRAMEWORK:",
    "",
    "Every recommendation MUST include:",
    `- Confidence Level: ${recommendation.confidenceLevel} (state as High/Medium/Low/Preliminary)`,
    `- Assumptions: ${recommendation.assumptions.join("; ")}`,
    `- Engineering Limitations: ${recommendation.engineeringLimitations.join("; ")}`,
    `- Applicable Standards: ${recommendation.applicableStandards.join(", ")}`,
    `- Best Practices: ${recommendation.bestPractices.join("; ")}`,
    "",
    "Sections required:",
    "1. Recommended Option",
    "2. Engineering Remarks (technical justification)",
    "3. Confidence Level with rationale",
    "4. Assumptions",
    "5. Engineering Limitations",
    "6. Applicable Standards",
    "7. Best Practices",
  ].join("\n");
};
