import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import { getCalculatorsCatalogByDisciplineId } from "../config/calculators";
import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { listAllDisciplineBundles } from "../knowledge/engine/buildDisciplineBundle";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { getWorkflowRegistry } from "../knowledge/workflows/workflowRegistry";
import type {
  EngineeringKnowledgeCategory,
  KnowledgeEntry,
} from "./types";

const CATEGORY_KEYWORD_MAP: Array<{
  category: EngineeringKnowledgeCategory;
  patterns: RegExp[];
}> = [
  { category: "engineering-standards", patterns: [/\b(is|irc|iec|astm|iso|nbc|morth)\b/i, /\bstandard\b/i, /\bcode\b/i] },
  { category: "engineering-formulae", patterns: [/\bcalculate\b/i, /\bformula\b/i, /\bequation\b/i] },
  { category: "engineering-workflows", patterns: [/\bworkflow\b/i, /\bprocedure\b/i, /\bprocess\b/i] },
  { category: "engineering-checklists", patterns: [/\bchecklist\b/i, /\binspection\b/i] },
  { category: "engineering-templates", patterns: [/\btemplate\b/i, /\bformat\b/i] },
  { category: "engineering-safety", patterns: [/\bsafety\b/i, /\bhazard\b/i, /\brisk\b/i] },
  { category: "engineering-quality", patterns: [/\bqa\b/i, /\bqc\b/i, /\bquality\b/i] },
  { category: "engineering-design", patterns: [/\bdesign\b/i, /\bsizing\b/i] },
  { category: "engineering-construction", patterns: [/\bconstruction\b/i, /\bsite\b/i, /\bexecution\b/i] },
  { category: "engineering-maintenance", patterns: [/\bmaintenance\b/i, /\brepair\b/i] },
  { category: "engineering-planning", patterns: [/\bplanning\b/i, /\bschedule\b/i] },
  { category: "engineering-contracts", patterns: [/\bcontract\b/i, /\bagreement\b/i] },
  { category: "engineering-claims", patterns: [/\bclaim\b/i, /\bdispute\b/i] },
  { category: "engineering-research", patterns: [/\bresearch\b/i, /\breference\b/i] },
  { category: "engineering-materials", patterns: [/\bmaterial\b/i, /\bconcrete\b/i, /\bsteel\b/i] },
  { category: "engineering-equipment", patterns: [/\bequipment\b/i, /\bmachinery\b/i, /\bplant\b/i] },
];

const inferCategory = (
  title: string,
  description: string,
  fallback: EngineeringKnowledgeCategory
): EngineeringKnowledgeCategory => {
  const text = `${title} ${description}`;
  for (const mapping of CATEGORY_KEYWORD_MAP) {
    if (mapping.patterns.some((pattern) => pattern.test(text))) {
      return mapping.category;
    }
  }
  return fallback;
};

const makeEntry = (
  partial: Omit<KnowledgeEntry, "status" | "version" | "updatedAt"> & {
    status?: KnowledgeEntry["status"];
    version?: string;
    updatedAt?: number;
  }
): KnowledgeEntry => ({
  status: partial.status ?? "active",
  version: partial.version ?? "1.0.0",
  updatedAt: partial.updatedAt ?? Date.now(),
  ...partial,
});

let cachedRepository: KnowledgeEntry[] | null = null;

export const buildKnowledgeRepository = (): KnowledgeEntry[] => {
  const entries: KnowledgeEntry[] = [];

  for (const discipline of DISCIPLINE_DEFINITIONS) {
    entries.push(
      makeEntry({
        id: `discipline-${discipline.id}`,
        title: discipline.name,
        description: `${discipline.name} discipline knowledge repository`,
        category: "engineering-concepts",
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        moduleId: "ai-expert",
        keywords: [discipline.name, discipline.id, "discipline"],
      })
    );

    const bundle = listAllDisciplineBundles().find(
      (b) => b.disciplineId === discipline.id
    );

    bundle?.categoryItems.forEach((item) => {
      entries.push(
        makeEntry({
          id: `concept-${discipline.id}-${item.id}`,
          title: item.title,
          description: item.description ?? "",
          category: inferCategory(
            item.title,
            item.description ?? "",
            "engineering-concepts"
          ),
          disciplineId: discipline.id,
          disciplineName: discipline.name,
          moduleId: item.moduleId,
          resourceId: item.id,
          keywords: item.keywords ?? [item.title],
        })
      );
    });

    getStandardsCatalogByDisciplineId(discipline.id)?.standards.forEach(
      (standard) => {
        entries.push(
          makeEntry({
            id: `std-${discipline.id}-${standard.id}`,
            title: standard.codeNumber,
            description: standard.title,
            category: "engineering-standards",
            disciplineId: discipline.id,
            disciplineName: discipline.name,
            moduleId: "standards",
            resourceId: standard.id,
            keywords: [
              standard.codeNumber,
              standard.title,
              ...(standard.keywords ?? []),
            ],
          })
        );
      }
    );

    getCalculatorsCatalogByDisciplineId(discipline.id)?.calculators.forEach(
      (calculator) => {
        entries.push(
          makeEntry({
            id: `calc-${discipline.id}-${calculator.id}`,
            title: calculator.name,
            description: calculator.description,
            category: "engineering-formulae",
            disciplineId: discipline.id,
            disciplineName: discipline.name,
            moduleId: "calculators",
            resourceId: calculator.id,
            keywords: [calculator.name, calculator.category, calculator.description],
          })
        );
      }
    );

    getProfessionalToolsRegistry(discipline.id)?.categories.forEach(
      (category) => {
        category.tools.forEach((tool) => {
          const categoryMap: Record<string, EngineeringKnowledgeCategory> = {
            calculators: "engineering-formulae",
            "design-assistants": "engineering-design",
            "estimation-tools": "engineering-planning",
            templates: "engineering-templates",
            checklists: "engineering-checklists",
            "report-generators": "engineering-templates",
          };

          entries.push(
            makeEntry({
              id: `tool-${discipline.id}-${tool.id}`,
              title: tool.title,
              description: tool.description,
              category:
                categoryMap[category.key] ?? "engineering-best-practices",
              disciplineId: discipline.id,
              disciplineName: discipline.name,
              moduleId: "professional-tools",
              resourceId: tool.id,
              keywords: [tool.title, category.label, tool.description],
            })
          );
        });
      }
    );

    getWorkflowRegistry(discipline.id)?.workflows.forEach((workflow) => {
      entries.push(
        makeEntry({
          id: `wf-${discipline.id}-${workflow.id}`,
          title: workflow.title,
          description: workflow.description,
          category: "engineering-workflows",
          disciplineId: discipline.id,
          disciplineName: discipline.name,
          moduleId: "professional-tools",
          resourceId: workflow.id,
          keywords: [workflow.title, workflow.description],
        })
      );
    });
  }

  return entries;
};

export const getKnowledgeRepository = (): KnowledgeEntry[] => {
  if (!cachedRepository) {
    cachedRepository = buildKnowledgeRepository();
  }
  return cachedRepository;
};

export const invalidateKnowledgeRepository = (): void => {
  cachedRepository = null;
};

export const getRepositoryEntriesByDiscipline = (
  disciplineId: string
): KnowledgeEntry[] =>
  getKnowledgeRepository().filter(
    (entry) => entry.disciplineId === disciplineId
  );

export const getRepositoryEntriesByCategory = (
  category: EngineeringKnowledgeCategory
): KnowledgeEntry[] =>
  getKnowledgeRepository().filter((entry) => entry.category === category);
