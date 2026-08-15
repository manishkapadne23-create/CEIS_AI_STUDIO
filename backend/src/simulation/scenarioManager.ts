import { loadScenarioTypes, loadSupportedDisciplines } from "./loadSimulationConfig.js";
import type { EssaeScenarioInput, EssaeValidationResult } from "./types.js";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

export const generateWorkspaceSlug = (name: string, userId: string) =>
  `${slugify(name)}-${userId.slice(-6)}`;

export const validateScenarioInput = (
  scenario: EssaeScenarioInput
): EssaeValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!scenario.title?.trim()) {
    errors.push("Scenario title is required.");
  }

  const validTypes = loadScenarioTypes().map((entry) => entry.enumValue);
  if (!validTypes.includes(scenario.scenarioType)) {
    errors.push(`Unsupported scenario type: ${scenario.scenarioType}`);
  }

  if (!scenario.options || scenario.options.length < 2) {
    errors.push("At least two options (A and B) are required for comparison.");
  }

  if (scenario.options.length > 3) {
    warnings.push("More than three options provided — only A, B, C will be fully compared.");
  }

  const disciplineIds = loadSupportedDisciplines().map((entry) => entry.id);
  if (scenario.disciplineId && !disciplineIds.includes(scenario.disciplineId)) {
    warnings.push(`Discipline ${scenario.disciplineId} is not in the supported list.`);
  }

  for (const [index, option] of scenario.options.slice(0, 3).entries()) {
    if (!option.label?.trim()) {
      errors.push(`Option ${String.fromCharCode(65 + index)} label is required.`);
    }
    if (!option.id?.trim()) {
      errors.push(`Option ${String.fromCharCode(65 + index)} id is required.`);
    }
  }

  if (!scenario.assumptions?.length) {
    warnings.push("No assumptions documented — engineering judgment may be incomplete.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    trackedAssumptions: scenario.assumptions ?? [],
  };
};

export const normalizeScenarioOptions = (
  options: EssaeScenarioInput["options"]
): EssaeScenarioInput["options"] =>
  options.slice(0, 3).map((option, index) => ({
    id: option.id || `option-${String.fromCharCode(97 + index)}`,
    label: option.label || `Option ${String.fromCharCode(65 + index)}`,
    description: option.description ?? "",
    parameters: option.parameters ?? {},
    advantages: option.advantages ?? [],
    limitations: option.limitations ?? [],
    costImpact: option.costImpact ?? "medium",
    riskImpact: option.riskImpact ?? "medium",
    qualityImpact: option.qualityImpact ?? "medium",
    maintainability: option.maintainability ?? "medium",
    lifecycleConsiderations: option.lifecycleConsiderations ?? [],
  }));

export const buildDefaultScenario = (
  scenarioType: EssaeScenarioInput["scenarioType"],
  disciplineName?: string | null
): EssaeScenarioInput => ({
  title: `New ${scenarioType.replace(/_/g, " ").toLowerCase()} scenario`,
  scenarioType,
  disciplineName: disciplineName ?? null,
  description: "AI-assisted engineering scenario analysis.",
  assumptions: [
    "Standard engineering codes and project specifications apply.",
    "Input parameters are preliminary and subject to detailed design.",
  ],
  parameters: {},
  options: [
    {
      id: "option-a",
      label: "Option A",
      description: "Baseline alternative",
      advantages: [],
      limitations: [],
    },
    {
      id: "option-b",
      label: "Option B",
      description: "Alternative approach",
      advantages: [],
      limitations: [],
    },
    {
      id: "option-c",
      label: "Option C",
      description: "Third alternative for extended comparison",
      advantages: [],
      limitations: [],
    },
  ],
});
