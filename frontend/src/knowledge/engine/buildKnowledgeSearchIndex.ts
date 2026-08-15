import { getCalculatorsCatalogByDisciplineId } from "../../config/calculators";
import { getStandardsCatalogByDisciplineId } from "../../config/standards";
import { getProfessionalToolsRegistry } from "../professional-tools/professionalToolsRegistry";
import { getWorkflowRegistry } from "../workflows/workflowRegistry";
import { loadEngineeringKnowledgeConfig } from "./loadKnowledgeConfig";
import { listAllDisciplineBundles } from "./buildDisciplineBundle";
import type {
  KnowledgeSearchIndexEntry,
  KnowledgeSearchOptions,
} from "./types";
import type { EngineeringSearchResult } from "../../sarathi/types";

const buildCatalogSearchEntries = (): KnowledgeSearchIndexEntry[] => {
  const entries: KnowledgeSearchIndexEntry[] = [];
  const config = loadEngineeringKnowledgeConfig();

  config.disciplines.forEach((discipline) => {
    entries.push({
      id: `discipline-${discipline.id}`,
      type: "discipline",
      title: discipline.name,
      subtitle: "Engineering discipline",
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      keywords: [discipline.name, discipline.id],
    });

    const bundle = listAllDisciplineBundles().find(
      (entry) => entry.disciplineId === discipline.id
    );

    bundle?.categoryItems.forEach((item) => {
      entries.push({
        id: item.id,
        type: "knowledge",
        title: item.title,
        subtitle: item.description,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        resourceId: item.id,
        categoryId: item.categoryId,
        moduleId: item.moduleId,
        keywords: item.keywords,
      });
    });

    getStandardsCatalogByDisciplineId(discipline.id)?.standards.forEach(
      (standard) => {
        entries.push({
          id: `standard-${discipline.id}-${standard.id}`,
          type: "standard",
          title: standard.codeNumber,
          subtitle: standard.title,
          disciplineId: discipline.id,
          disciplineName: discipline.name,
          resourceId: standard.id,
          categoryId: "standards",
          moduleId: "standards",
          keywords: standard.keywords,
        });
      }
    );

    getCalculatorsCatalogByDisciplineId(discipline.id)?.calculators.forEach(
      (calculator) => {
        entries.push({
          id: `calculator-${discipline.id}-${calculator.id}`,
          type: "calculator",
          title: calculator.name,
          subtitle: calculator.description,
          disciplineId: discipline.id,
          disciplineName: discipline.name,
          resourceId: calculator.id,
          categoryId: "analysis",
          moduleId: "calculators",
          keywords: [calculator.category, calculator.name],
        });
      }
    );

    getProfessionalToolsRegistry(discipline.id)?.categories.forEach(
      (category) => {
        category.tools.forEach((tool) => {
          entries.push({
            id: `tool-${discipline.id}-${tool.id}`,
            type: "tool",
            title: tool.title,
            subtitle: category.label,
            disciplineId: discipline.id,
            disciplineName: discipline.name,
            resourceId: tool.id,
            categoryId: "checklists",
            moduleId: "professional-tools",
            keywords: [tool.title, category.label],
          });
        });
      }
    );

    getWorkflowRegistry(discipline.id)?.workflows.forEach((workflow) => {
      entries.push({
        id: `workflow-${discipline.id}-${workflow.id}`,
        type: "workflow",
        title: workflow.title,
        subtitle: workflow.description,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        resourceId: workflow.id,
        categoryId: "best-practices",
        moduleId: "learning-hub",
        keywords: [workflow.title],
      });
    });
  });

  return entries;
};

let cachedIndex: KnowledgeSearchIndexEntry[] | null = null;

export const getKnowledgeSearchIndex = (): KnowledgeSearchIndexEntry[] => {
  if (!cachedIndex) {
    cachedIndex = buildCatalogSearchEntries();
  }

  return cachedIndex;
};

export const searchEngineeringKnowledge = (
  query: string,
  options?: KnowledgeSearchOptions
): EngineeringSearchResult[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const scope = options?.scope ?? "all";
  const disciplineId = options?.disciplineId ?? null;
  const categoryId = options?.categoryId ?? null;
  const moduleId = options?.moduleId ?? null;
  const limit = options?.limit ?? 12;

  return getKnowledgeSearchIndex()
    .filter((result) => {
      if (scope === "workspace" && disciplineId && result.disciplineId !== disciplineId) {
        return false;
      }

      if (categoryId && result.categoryId !== categoryId) {
        return false;
      }

      if (moduleId && result.moduleId !== moduleId) {
        return false;
      }

      const haystack = [
        result.title,
        result.subtitle,
        result.disciplineName,
        result.type,
        ...(result.keywords ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .slice(0, limit);
};

export const invalidateKnowledgeSearchIndex = (): void => {
  cachedIndex = null;
};
