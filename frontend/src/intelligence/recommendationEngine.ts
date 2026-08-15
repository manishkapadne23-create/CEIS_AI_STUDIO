import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { getFrequentByType } from "./learningEngine";
import type { PersonalizationBundle, UserLearningProfile } from "./types";

export const buildPersonalizationBundle = (
  profile: UserLearningProfile,
  disciplineId: string | null
): PersonalizationBundle => {
  const disciplineFilter = (records: ReturnType<typeof getFrequentByType>) =>
    disciplineId
      ? records.filter((r) => !r.disciplineId || r.disciplineId === disciplineId)
      : records;

  const standards = disciplineFilter(getFrequentByType("standard", 6));
  const calculators = disciplineFilter(getFrequentByType("calculator", 6));
  const tools = disciplineFilter(getFrequentByType("professional-tool", 6));
  const workflows = disciplineFilter(getFrequentByType("workflow", 6));
  const learning = disciplineFilter(getFrequentByType("learning-resource", 4));
  const modules = disciplineFilter(getFrequentByType("module", 6));

  const mergeUnique = (
    profileItems: string[],
    usageItems: string[]
  ): string[] => [...new Set([...profileItems, ...usageItems])].slice(0, 6);

  const moduleIds = [
    ...new Set([
      ...profile.favouriteModules,
      ...modules.map((m) => m.resourceId as WorkspaceCategoryId),
    ]),
  ].slice(0, 6);

  return {
    recommendedStandards: mergeUnique(
      profile.preferredStandards,
      standards.map((s) => s.label)
    ),
    recommendedCalculators: calculators.map((c) => c.label),
    recommendedTools: mergeUnique(
      profile.frequentlyUsedTools,
      tools.map((t) => t.label)
    ),
    recommendedWorkflows: workflows.map((w) => w.label),
    recommendedLearning: learning.map((l) => l.label),
    recommendedModules: moduleIds,
  };
};

export const formatPersonalizationForPrompt = (
  bundle: PersonalizationBundle
): string => {
  const sections: string[] = [];

  if (bundle.recommendedStandards.length > 0) {
    sections.push(`Standards: ${bundle.recommendedStandards.join(", ")}`);
  }
  if (bundle.recommendedCalculators.length > 0) {
    sections.push(`Calculators: ${bundle.recommendedCalculators.join(", ")}`);
  }
  if (bundle.recommendedTools.length > 0) {
    sections.push(`Tools: ${bundle.recommendedTools.join(", ")}`);
  }
  if (bundle.recommendedWorkflows.length > 0) {
    sections.push(`Workflows: ${bundle.recommendedWorkflows.join(", ")}`);
  }
  if (bundle.recommendedLearning.length > 0) {
    sections.push(`Learning: ${bundle.recommendedLearning.join(", ")}`);
  }
  if (bundle.recommendedModules.length > 0) {
    sections.push(`Modules: ${bundle.recommendedModules.join(", ")}`);
  }

  return sections.length > 0
    ? sections.join("\n")
    : "Personalization warming up — interact more to improve recommendations.";
};
