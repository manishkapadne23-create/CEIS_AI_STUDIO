import { getCalculatorsCatalogByDisciplineId } from "../../config/calculators";
import { getStandardsCatalogByDisciplineId } from "../../config/standards";
import { getDisciplinePrompt } from "../../ai/promptLibrary";
import { disciplineKnowledgeSchemaMap } from "../data/schemas/disciplineSchemaRegistry";
import { getCapabilityRegistry } from "../capabilities/capabilityRegistry";
import { getProfessionalToolsRegistry } from "../professional-tools/professionalToolsRegistry";
import { getWorkflowRegistry } from "../workflows/workflowRegistry";
import { createDisciplinePlaceholderSchema } from "../utils/createDisciplinePlaceholderSchema";
import { getDisciplineRegistryEntry, loadEngineeringKnowledgeConfig } from "./loadKnowledgeConfig";
import type {
  DisciplineKnowledgeBundle,
  EngineeringKnowledgeCategoryItem,
  KnowledgeCategoryId,
} from "./types";

const CATEGORY_MODULE_MAP: Partial<
  Record<KnowledgeCategoryId, DisciplineKnowledgeBundle["categoryItems"][0]["moduleId"]>
> = {
  standards: "standards",
  specifications: "documents",
  "best-practices": "learning-hub",
  checklists: "professional-tools",
  troubleshooting: "ai-expert",
  faqs: "learning-hub",
  fundamentals: "learning-hub",
  design: "ai-expert",
  analysis: "calculators",
  "construction-manufacturing": "professional-tools",
  testing: "standards",
  inspection: "professional-tools",
  maintenance: "professional-tools",
  safety: "ai-expert",
};

const resolveSchema = (disciplineId: string) =>
  disciplineKnowledgeSchemaMap[disciplineId] ??
  createDisciplinePlaceholderSchema(disciplineId);

const buildCategoryItemsForDiscipline = (
  disciplineId: string,
  disciplineName: string
): EngineeringKnowledgeCategoryItem[] => {
  const schema = resolveSchema(disciplineId);
  const specialization = Object.values(schema.specializations)[0];
  const items: EngineeringKnowledgeCategoryItem[] = [];

  const pushItems = (
    categoryId: KnowledgeCategoryId,
    sourceItems: Array<{ id: string; title: string; description?: string }>
  ) => {
    sourceItems.forEach((item) => {
      items.push({
        id: `${disciplineId}-${categoryId}-${item.id}`,
        categoryId,
        title: item.title,
        description: item.description,
        disciplineId,
        moduleId: CATEGORY_MODULE_MAP[categoryId],
        keywords: [disciplineName, categoryId, item.title],
      });
    });
  };

  if (specialization) {
    pushItems("fundamentals", [
      { id: "overview", title: "Overview", description: specialization.overview },
      ...specialization.scope.map((scopeItem, index) => ({
        id: `scope-${index}`,
        title: scopeItem,
      })),
    ]);
    pushItems("standards", specialization.designStandards);
    pushItems("design", specialization.designModules);
    pushItems("analysis", specialization.engineeringCalculators);
    pushItems("best-practices", specialization.aiEngineeringAgents);
    pushItems("specifications", specialization.templates);
    pushItems("faqs", specialization.learningResources);
  }

  getStandardsCatalogByDisciplineId(disciplineId)?.standards
    .slice(0, 8)
    .forEach((standard) => {
      items.push({
        id: `${disciplineId}-std-${standard.id}`,
        categoryId: "standards",
        title: standard.codeNumber,
        description: standard.title,
        disciplineId,
        moduleId: "standards",
        keywords: standard.keywords,
      });
    });

  getCalculatorsCatalogByDisciplineId(disciplineId)?.calculators
    .slice(0, 6)
    .forEach((calculator) => {
      items.push({
        id: `${disciplineId}-calc-${calculator.id}`,
        categoryId: "analysis",
        title: calculator.name,
        description: calculator.description,
        disciplineId,
        moduleId: "calculators",
        keywords: [calculator.category, calculator.name],
      });
    });

  return items;
};

export const buildDisciplineKnowledgeBundle = (
  disciplineId: string
): DisciplineKnowledgeBundle | null => {
  const registryEntry = getDisciplineRegistryEntry(disciplineId);
  const schema = resolveSchema(disciplineId);

  if (!registryEntry) {
    return null;
  }

  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);
  const toolsRegistry = getProfessionalToolsRegistry(disciplineId);
  const workflowRegistry = getWorkflowRegistry(disciplineId);

  const toolsCount =
    toolsRegistry?.categories.reduce(
      (count, category) => count + category.tools.length,
      0
    ) ?? 0;

  return {
    disciplineId,
    disciplineName: registryEntry.name,
    aiPersonalityKey: registryEntry.aiPersonalityKey,
    schema,
    categoryItems: buildCategoryItemsForDiscipline(
      disciplineId,
      registryEntry.name
    ),
    standardsCount: standardsCatalog?.standards.length ?? 0,
    calculatorsCount: calculatorsCatalog?.calculators.length ?? 0,
    toolsCount,
    workflowsCount: workflowRegistry?.workflows.length ?? 0,
    documentsCount: schema.specializations
      ? Object.values(schema.specializations)[0]?.templates.length ?? 0
      : 0,
    learningResourcesCount: schema.specializations
      ? Object.values(schema.specializations)[0]?.learningResources.length ?? 0
      : 0,
  };
};

export const getDisciplinePersonality = (disciplineId: string) => {
  const prompt = getDisciplinePrompt(disciplineId);
  return {
    role: prompt.role,
    answerStyle: prompt.answerStyle,
    terminology: prompt.terminology,
    safetyRules: prompt.safetyRules,
    knowledgeScope: prompt.knowledgeScope,
  };
};

export const getEnabledCapabilities = (disciplineId: string): string[] => {
  const registry = getCapabilityRegistry(disciplineId);
  return (
    registry?.capabilities
      .filter((capability) => capability.enabled)
      .map((capability) => capability.label) ?? []
  );
};

export const listAllDisciplineBundles = (): DisciplineKnowledgeBundle[] =>
  loadEngineeringKnowledgeConfig()
    .disciplines.map((discipline) => buildDisciplineKnowledgeBundle(discipline.id))
    .filter((bundle): bundle is DisciplineKnowledgeBundle => Boolean(bundle));
