import type {
  DecisionConfidenceLevel,
  DecisionCriterion,
  DecisionMatrix,
  DecisionMatrixAlternative,
} from "./types";
import { getDecisionCriteriaForDiscipline } from "./disciplineRegistry";

const DEFAULT_WEIGHTS: Record<string, number> = {
  technical: 0.2,
  economic: 0.15,
  constructability: 0.12,
  maintainability: 0.1,
  safety: 0.18,
  environmental: 0.1,
  risk: 0.1,
  lifecycle: 0.05,
};

const buildCriteria = (disciplineId: string | null): DecisionCriterion[] => {
  const labels = getDecisionCriteriaForDiscipline(disciplineId);
  const categories: DecisionCriterion["category"][] = [
    "technical",
    "economic",
    "constructability",
    "maintainability",
    "safety",
    "environmental",
    "risk",
    "lifecycle",
  ];

  return labels.slice(0, 8).map((label, index) => {
    const category = categories[index] ?? "technical";
    return {
      id: `criterion-${index}`,
      label,
      description: `Evaluate alternatives on ${label.toLowerCase()}`,
      weight: DEFAULT_WEIGHTS[category] ?? 0.1,
      category,
    };
  });
};

const buildMarkdownMatrix = (
  title: string,
  criteria: DecisionCriterion[],
  alternatives: DecisionMatrixAlternative[]
): string => {
  const headers = [
    "Criterion",
    "Weight (%)",
    ...alternatives.map((alternative) => alternative.name),
  ];
  const rows = criteria.map((criterion) => {
    const weightPct = Math.round(criterion.weight * 100);
    const scores = alternatives.map(
      (alternative) => alternative.scores[criterion.id]?.toString() ?? "[1-5]"
    );
    return `| ${criterion.label} | ${weightPct}% | ${scores.join(" | ")} |`;
  });

  const totalRow = `| **Weighted Total** | 100% | ${alternatives
    .map((alternative) => `**${alternative.weightedScore.toFixed(2)}**`)
    .join(" | ")} |`;

  return [
    `## Decision Matrix: ${title}`,
    "",
    "| " + headers.join(" | ") + " |",
    "| " + headers.map(() => "---").join(" | ") + " |",
    ...rows,
    totalRow,
    "",
    "_Score each cell 1–5. Weighted scoring enabled (MCDA-ready)._",
  ].join("\n");
};

export const buildDecisionMatrix = (
  problemStatement: string,
  alternatives: string[],
  disciplineId: string | null,
  confidenceLevel: DecisionConfidenceLevel = "medium"
): DecisionMatrix => {
  const criteria = buildCriteria(disciplineId);
  const normalizedAlternatives = alternatives.length >= 2
    ? alternatives
    : ["Alternative A", "Alternative B"];

  const matrixAlternatives: DecisionMatrixAlternative[] = normalizedAlternatives.map(
    (name, index) => {
      const scores: Record<string, number> = {};
      let weightedScore = 0;
      for (const criterion of criteria) {
        const score = 3;
        scores[criterion.id] = score;
        weightedScore += score * criterion.weight;
      }
      return {
        id: `alt-${index}`,
        name,
        scores,
        weightedScore,
      };
    }
  );

  const recommended = [...matrixAlternatives].sort(
    (a, b) => b.weightedScore - a.weightedScore
  )[0];

  const title =
    normalizedAlternatives.length === 2
      ? `${normalizedAlternatives[0]} vs ${normalizedAlternatives[1]}`
      : "Engineering Decision Matrix";

  return {
    title,
    problemStatement,
    criteria,
    alternatives: matrixAlternatives,
    weightTotal: criteria.reduce((sum, criterion) => sum + criterion.weight, 0),
    recommendedAlternativeId: recommended?.id ?? null,
    confidenceLevel,
    markdownTable: buildMarkdownMatrix(title, criteria, matrixAlternatives),
  };
};

export const formatDecisionMatrixForPrompt = (
  matrix: DecisionMatrix | null
): string => {
  if (!matrix) {
    return "";
  }

  return [
    "DECISION MATRIX (weighted scoring — support engineer judgment, do not auto-decide):",
    matrix.markdownTable,
    "",
    "Evaluation factors:",
    matrix.criteria
      .map(
        (criterion) =>
          `- ${criterion.label} (${Math.round(criterion.weight * 100)}%): ${criterion.description}`
      )
      .join("\n"),
    "",
    `Preliminary highest score: ${matrix.alternatives.find((alt) => alt.id === matrix.recommendedAlternativeId)?.name ?? "TBD"}`,
    `Confidence: ${matrix.confidenceLevel}`,
    "",
    "Provide final recommendation with engineering justification — matrix is advisory only.",
  ].join("\n");
};
