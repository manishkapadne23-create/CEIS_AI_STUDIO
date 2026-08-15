import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { EngineeringStandardMetadata } from "../../config/standards";
import { searchStandardsMetadata } from "../../config/standards";
import { searchCalculatorsMetadata } from "../../config/calculators";
import { getDisciplineIdByName } from "../utils/resolveKnowledgeModule";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import {
  buildDisciplineKnowledgeBundle,
  getDisciplinePersonality,
  getEnabledCapabilities,
} from "./buildDisciplineBundle";
import { getDisciplineRegistryEntry } from "./loadKnowledgeConfig";
import type { AIKnowledgeContextPayload } from "./types";
import { getStandardsCatalogByDisciplineId } from "../../config/standards";
import { getCalculatorsCatalogByDisciplineId } from "../../config/calculators";

export interface ResolveAIKnowledgeContextOptions {
  workspace: EngineeringWorkspace;
  activeDisciplineId?: string | null;
  activeDisciplineName?: string | null;
  activeModuleId?: WorkspaceCategoryId | null;
  userQuery?: string;
  selectedStandard?: EngineeringStandardMetadata | null;
}

const rankCategoryItems = (
  items: AIKnowledgeContextPayload["categoryHighlights"],
  query: string
) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items.slice(0, 8);

  return items
    .map((item) => {
      const haystack = [item.title, item.description, ...(item.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const score = haystack.includes(normalized) ? 2 : 0;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, 8);
};

export const resolveAIKnowledgeContext = (
  options: ResolveAIKnowledgeContextOptions
): AIKnowledgeContextPayload => {
  const disciplineId =
    options.activeDisciplineId ??
    getDisciplineIdByName(options.workspace.domain) ??
    null;
  const disciplineName =
    options.activeDisciplineName ?? options.workspace.domain ?? null;
  const registryEntry = disciplineId
    ? getDisciplineRegistryEntry(disciplineId)
    : undefined;
  const bundle = disciplineId
    ? buildDisciplineKnowledgeBundle(disciplineId)
    : null;
  const personality = disciplineId
    ? getDisciplinePersonality(disciplineId)
    : getDisciplinePersonality("general-engineering");

  const query = options.userQuery ?? "";
  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);

  const searchedStandards = searchStandardsMetadata(
    standardsCatalog?.standards ?? [],
    query,
    disciplineName
  ).slice(0, 6);

  const selectedStandards = options.selectedStandard
    ? [
        options.selectedStandard,
        ...searchedStandards.filter(
          (standard) => standard.id !== options.selectedStandard?.id
        ),
      ]
    : searchedStandards;

  const searchedCalculators = searchCalculatorsMetadata(
    calculatorsCatalog?.calculators ?? [],
    query,
    disciplineName
  ).slice(0, 4);

  const specialization = bundle?.schema.specializations
    ? Object.values(bundle.schema.specializations)[0]
    : undefined;

  return {
    disciplineId,
    disciplineName: registryEntry?.name ?? disciplineName,
    activeModuleId: options.activeModuleId ?? null,
    personality,
    knowledgeOverview: specialization?.overview ?? null,
    categoryHighlights: rankCategoryItems(bundle?.categoryItems ?? [], query),
    applicableStandards: selectedStandards.map(
      (standard) =>
        `${standard.codeNumber} — ${standard.title} (${standard.publisher})`
    ),
    applicableCalculators: searchedCalculators.map(
      (calculator) => `${calculator.name} [${calculator.category}]`
    ),
    enabledCapabilities: disciplineId ? getEnabledCapabilities(disciplineId) : [],
    semanticSearchReady: true,
    ragReady: true,
    providerHooks: {
      openai: false,
      ollama: false,
      localLlm: false,
      vectorDatabase: false,
      documentIntelligence: false,
      drawingIntelligence: false,
      pmisIntegration: false,
    },
  };
};

export const formatAIKnowledgeContext = (
  context: AIKnowledgeContextPayload
): string => {
  const lines = [
    `Discipline: ${context.disciplineName ?? "General Engineering"}`,
    `Active Module: ${context.activeModuleId ?? "ai-expert"}`,
    `Expert Role: ${context.personality.role}`,
    `Answer Style: ${context.personality.answerStyle}`,
    `Knowledge Overview: ${context.knowledgeOverview ?? "Not available"}`,
    `Terminology: ${context.personality.terminology.slice(0, 10).join(", ")}`,
    `Safety Rules: ${context.personality.safetyRules.join(" ")}`,
    `Applicable Standards: ${context.applicableStandards.join("; ") || "None matched"}`,
    `Applicable Calculators: ${context.applicableCalculators.join("; ") || "None matched"}`,
    `Enabled Capabilities: ${context.enabledCapabilities.join(", ") || "None"}`,
  ];

  if (context.categoryHighlights.length > 0) {
    lines.push(
      "Category Highlights:",
      ...context.categoryHighlights.map(
        (item) => `- [${item.categoryId}] ${item.title}: ${item.description ?? ""}`
      )
    );
  }

  return lines.join("\n");
};
