import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import type {
  EngineeringProfessionalTool,
  EngineeringProfessionalToolsRegistry,
  ProfessionalToolCategoryKey,
  ProfessionalToolStatus,
} from "../types/EngineeringProfessionalTool";
import {
  PROFESSIONAL_TOOL_CATEGORY_KEYS,
  PROFESSIONAL_TOOL_CATEGORY_LABELS,
} from "../types/EngineeringProfessionalTool";
import { buildProfessionalToolsRegistry } from "./buildProfessionalToolsRegistry";

interface CreatePlaceholderToolInput {
  category: ProfessionalToolCategoryKey;
  status?: ProfessionalToolStatus;
  enabled?: boolean;
}

const createPlaceholderTool = (
  disciplineId: string,
  input: CreatePlaceholderToolInput
): EngineeringProfessionalTool => ({
  id: `${disciplineId}-${input.category}-coming-soon`,
  key: `${input.category}-coming-soon`,
  title: `${PROFESSIONAL_TOOL_CATEGORY_LABELS[input.category]} Catalog`,
  description: `${PROFESSIONAL_TOOL_CATEGORY_LABELS[input.category]} for this discipline are planned and will be added to the professional tools registry.`,
  category: input.category,
  status: input.status ?? "coming-soon",
  enabled: input.enabled ?? false,
});

export const createPlaceholderProfessionalToolsRegistry = (
  disciplineId: string
): EngineeringProfessionalToolsRegistry => {
  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  if (!discipline) {
    throw new Error(`Unknown engineering discipline: ${disciplineId}`);
  }

  const tools: EngineeringProfessionalTool[] = [
    createPlaceholderTool(disciplineId, {
      category: PROFESSIONAL_TOOL_CATEGORY_KEYS.calculators,
    }),
    createPlaceholderTool(disciplineId, {
      category: PROFESSIONAL_TOOL_CATEGORY_KEYS.designAssistants,
    }),
    createPlaceholderTool(disciplineId, {
      category: PROFESSIONAL_TOOL_CATEGORY_KEYS.estimationTools,
    }),
    createPlaceholderTool(disciplineId, {
      category: PROFESSIONAL_TOOL_CATEGORY_KEYS.templates,
    }),
    createPlaceholderTool(disciplineId, {
      category: PROFESSIONAL_TOOL_CATEGORY_KEYS.checklists,
    }),
    createPlaceholderTool(disciplineId, {
      category: PROFESSIONAL_TOOL_CATEGORY_KEYS.reportGenerators,
    }),
  ];

  return buildProfessionalToolsRegistry(
    discipline.id,
    discipline.name,
    tools
  );
};
