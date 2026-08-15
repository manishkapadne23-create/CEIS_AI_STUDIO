import type {
  EngineeringProfessionalTool,
  EngineeringProfessionalToolsCategory,
  EngineeringProfessionalToolsRegistry,
  ProfessionalToolCategoryKey,
} from "../types/EngineeringProfessionalTool";
import {
  PROFESSIONAL_TOOL_CATEGORY_KEYS,
  PROFESSIONAL_TOOL_CATEGORY_LABELS,
} from "../types/EngineeringProfessionalTool";

const categoryOrder: ProfessionalToolCategoryKey[] = [
  PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
  PROFESSIONAL_TOOL_CATEGORY_KEYS.designAssistants,
  PROFESSIONAL_TOOL_CATEGORY_KEYS.estimationTools,
  PROFESSIONAL_TOOL_CATEGORY_KEYS.templates,
  PROFESSIONAL_TOOL_CATEGORY_KEYS.checklists,
  PROFESSIONAL_TOOL_CATEGORY_KEYS.reportGenerators,
];

export const buildProfessionalToolsRegistry = (
  disciplineId: string,
  disciplineName: string,
  tools: EngineeringProfessionalTool[]
): EngineeringProfessionalToolsRegistry => {
  const categories: EngineeringProfessionalToolsCategory[] =
    categoryOrder.map((categoryKey) => ({
      key: categoryKey,
      label: PROFESSIONAL_TOOL_CATEGORY_LABELS[categoryKey],
      tools: tools.filter((tool) => tool.category === categoryKey),
    }));

  return {
    disciplineId,
    disciplineName,
    categories,
  };
};
