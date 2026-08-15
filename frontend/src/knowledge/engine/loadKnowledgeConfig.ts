import knowledgeCategoriesConfig from "../config/knowledgeCategories.json";
import disciplineRegistryConfig from "../config/disciplineRegistry.json";
import type {
  DisciplineKnowledgeRegistryEntry,
  KnowledgeCatalogModuleDefinition,
  KnowledgeCategoryDefinition,
} from "./types";

export interface EngineeringKnowledgeConfig {
  version: string;
  categories: KnowledgeCategoryDefinition[];
  catalogModules: KnowledgeCatalogModuleDefinition[];
  disciplines: DisciplineKnowledgeRegistryEntry[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validateCategory = (
  value: unknown
): value is KnowledgeCategoryDefinition =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.label === "string" &&
  typeof value.description === "string";

const validateDiscipline = (
  value: unknown
): value is DisciplineKnowledgeRegistryEntry =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  typeof value.aiPersonalityKey === "string";

export const loadEngineeringKnowledgeConfig = (): EngineeringKnowledgeConfig => {
  const categories = (knowledgeCategoriesConfig as { categories: unknown[] })
    .categories;

  if (!categories.every(validateCategory)) {
    throw new Error("Invalid engineering knowledge category configuration.");
  }

  const disciplines = (
    disciplineRegistryConfig as { disciplines: unknown[] }
  ).disciplines;

  if (!disciplines.every(validateDiscipline)) {
    throw new Error("Invalid discipline registry configuration.");
  }

  const catalogModules = (
    knowledgeCategoriesConfig as { catalogModules: KnowledgeCatalogModuleDefinition[] }
  ).catalogModules;

  return {
    version: knowledgeCategoriesConfig.version,
    categories,
    catalogModules,
    disciplines,
  };
};

export const getKnowledgeCategoryById = (
  categoryId: string
): KnowledgeCategoryDefinition | undefined =>
  loadEngineeringKnowledgeConfig().categories.find(
    (category) => category.id === categoryId
  );

export const getDisciplineRegistryEntry = (
  disciplineId: string
): DisciplineKnowledgeRegistryEntry | undefined =>
  loadEngineeringKnowledgeConfig().disciplines.find(
    (discipline) => discipline.id === disciplineId
  );
