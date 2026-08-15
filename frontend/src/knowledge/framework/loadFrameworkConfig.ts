import disciplineRegistryConfig from "../config/disciplineRegistry.json";
import taxonomyConfig from "./config/knowledgeFrameworkTaxonomy.json";
import { getNavigatorSpecializations } from "../../sarathi/utils/navigatorTree";
import type {
  KnowledgeFrameworkCategory,
  KnowledgeFrameworkConfig,
  KnowledgeFrameworkDiscipline,
  KnowledgeFrameworkSpecialization,
} from "./types";
import { buildDisciplineKnowledgePath, buildSpecializationKnowledgePath } from "./buildKnowledgePaths";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validateCategory = (value: unknown): value is KnowledgeFrameworkCategory =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.label === "string" &&
  typeof value.description === "string" &&
  typeof value.icon === "string" &&
  typeof value.sortOrder === "number";

const buildDisciplineEntry = (input: {
  id: string;
  name: string;
}): KnowledgeFrameworkDiscipline => {
  const specializations: KnowledgeFrameworkSpecialization[] =
    getNavigatorSpecializations(input.id, input.name).map(({ node }) => ({
      id: node.id,
      label: node.name,
      disciplineId: input.id,
      path: buildSpecializationKnowledgePath(input.id, node.id),
    }));

  return {
    id: input.id,
    name: input.name,
    path: buildDisciplineKnowledgePath(input.id),
    specializations,
  };
};

let cachedConfig: KnowledgeFrameworkConfig | null = null;

export const loadKnowledgeFrameworkConfig = (): KnowledgeFrameworkConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const categories = (taxonomyConfig as { categories: unknown[] }).categories;

  if (!categories.every(validateCategory)) {
    throw new Error("Invalid knowledge framework taxonomy configuration.");
  }

  const registryDisciplines = (
    disciplineRegistryConfig as { disciplines: Array<{ id: string; name: string }> }
  ).disciplines;

  const disciplines = registryDisciplines.map(buildDisciplineEntry);

  cachedConfig = {
    version: taxonomyConfig.version,
    schema: taxonomyConfig.schema,
    categories: [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    disciplines,
  };

  return cachedConfig;
};

export const getFrameworkCategoryById = (
  categoryId: string
): KnowledgeFrameworkCategory | undefined =>
  loadKnowledgeFrameworkConfig().categories.find(
    (category) => category.id === categoryId
  );

export const getFrameworkDisciplineById = (
  disciplineId: string
): KnowledgeFrameworkDiscipline | undefined =>
  loadKnowledgeFrameworkConfig().disciplines.find(
    (discipline) => discipline.id === disciplineId
  );

export const getFrameworkSpecialization = (
  disciplineId: string,
  specializationId: string
): KnowledgeFrameworkSpecialization | undefined =>
  getFrameworkDisciplineById(disciplineId)?.specializations.find(
    (specialization) => specialization.id === specializationId
  );
