import type {
  EssaeComparisonMatrix,
  EssaeScenarioInput,
  EssaeSimulationResults,
} from "./types.js";

export const buildSimulationReport = (input: {
  scenario: EssaeScenarioInput;
  results: EssaeSimulationResults;
  workspaceName?: string | null;
  exportedAt?: string;
}) => ({
  exportedAt: input.exportedAt ?? new Date().toISOString(),
  engine: "Engineering Simulation & Scenario Analysis Engine",
  version: "1.0.0",
  workspace: input.workspaceName ?? null,
  scenario: {
    title: input.scenario.title,
    type: input.scenario.scenarioType,
    discipline: input.scenario.disciplineName,
    assumptions: input.scenario.assumptions,
    parameters: input.scenario.parameters,
    options: input.scenario.options,
  },
  results: {
    executiveSummary: input.results.executiveSummary,
    simulationSummary: input.results.simulationSummary,
    comparisonMatrix: input.results.comparisonMatrix,
    optionComparisons: input.results.optionComparisons,
    engineeringRecommendations: input.results.engineeringRecommendations,
    decisionSupportNotes: input.results.decisionSupportNotes,
    riskAssessment: input.results.riskAssessment,
    recommendedOptionId: input.results.recommendedOptionId,
  },
});

export const formatComparisonMatrixMarkdown = (
  matrix: EssaeComparisonMatrix
): string => {
  const header = `| Option | ${matrix.criteria.join(" | ")} |`;
  const separator = `| --- | ${matrix.criteria.map(() => "---").join(" | ")} |`;
  const rows = matrix.options.map((option) => {
    const values = matrix.criteria
      .map((criterion) => String(option.values[criterion] ?? "—"))
      .join(" | ");
    return `| ${option.label} | ${values} |`;
  });
  return [header, separator, ...rows].join("\n");
};

export const formatSimulationReportMarkdown = (report: ReturnType<typeof buildSimulationReport>) => {
  const lines = [
    `# Simulation Report: ${report.scenario.title}`,
    "",
    report.results.executiveSummary,
    "",
    "## Simulation Summary",
    report.results.simulationSummary,
    "",
    "## Comparison Matrix",
    formatComparisonMatrixMarkdown(report.results.comparisonMatrix),
    "",
    "## Decision Support Notes",
    ...report.results.decisionSupportNotes.map((entry) => `- ${entry}`),
    "",
    "## Engineering Recommendations",
    ...report.results.engineeringRecommendations.map((entry) => `- ${entry}`),
    "",
    "## Risk Assessment",
    ...report.results.riskAssessment.map((entry) => `- ${entry}`),
  ];
  return lines.join("\n");
};
