import {
  getCalculatorsCatalogByDisciplineId,
  searchCalculatorsMetadata,
} from "../config/calculators";
import {
  getStandardsCatalogByDisciplineId,
  searchStandardsMetadata,
} from "../config/standards";
import { searchEngineeringKnowledge } from "../knowledge";
import { getWorkflowsForDiscipline, searchWorkflows } from "../workflows";
import type {
  CopilotContextSnapshot,
  CopilotSuggestion,
  RelatedKnowledgeBundle,
} from "./types";

const toSuggestion = (
  category: CopilotSuggestion["category"],
  title: string,
  description: string,
  priority: number,
  moduleId?: CopilotSuggestion["moduleId"],
  resourceId?: string
): CopilotSuggestion => ({
  id: `${category}-${title.replace(/\s+/g, "-").toLowerCase()}`,
  category,
  title,
  description,
  moduleId,
  resourceId,
  priority,
});

export const connectRelatedKnowledge = (
  message: string,
  snapshot: CopilotContextSnapshot
): RelatedKnowledgeBundle => {
  const disciplineId = snapshot.disciplineId ?? "";
  const bundle: RelatedKnowledgeBundle = {
    standards: [],
    calculators: [],
    templates: [],
    workflows: [],
    documents: [],
    learningResources: [],
  };

  if (!disciplineId) return bundle;

  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
  const rankedStandards = searchStandardsMetadata(
    standardsCatalog?.standards ?? [],
    message,
    snapshot.disciplineName
  ).slice(0, 5);

  bundle.standards = rankedStandards.map((standard, index) =>
    toSuggestion(
      "standards",
      standard.codeNumber,
      standard.title,
      10 - index,
      "standards",
      standard.id
    )
  );

  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);
  const rankedCalculators = searchCalculatorsMetadata(
    calculatorsCatalog?.calculators ?? [],
    message,
    snapshot.disciplineName
  ).slice(0, 5);

  bundle.calculators = rankedCalculators.map((calculator, index) =>
    toSuggestion(
      "calculators",
      calculator.name,
      calculator.description,
      9 - index,
      "calculators",
      calculator.id
    )
  );

  const workflowResults = searchWorkflows(message, disciplineId).slice(0, 4);
  bundle.workflows = workflowResults.map((workflow, index) =>
    toSuggestion(
      "workflows",
      workflow.title,
      workflow.objective,
      8 - index,
      "professional-tools",
      workflow.id
    )
  );

  if (bundle.workflows.length === 0) {
    bundle.workflows = getWorkflowsForDiscipline(
      disciplineId,
      snapshot.disciplineName
    )
      .slice(0, 3)
      .map((workflow, index) =>
        toSuggestion(
          "workflows",
          workflow.title,
          workflow.objective,
          5 - index,
          "professional-tools",
          workflow.id
        )
      );
  }

  const knowledgeResults = searchEngineeringKnowledge(message, {
    disciplineId,
    limit: 6,
  });

  for (const result of knowledgeResults) {
    const moduleId = "moduleId" in result ? result.moduleId : undefined;

    if (result.type === "knowledge" && moduleId === "learning-hub") {
      bundle.learningResources.push(
        toSuggestion(
          "learning-resources",
          result.title,
          result.subtitle ?? "Learning resource",
          6,
          "learning-hub",
          result.resourceId
        )
      );
    }
    if (result.type === "tool" || moduleId === "professional-tools") {
      bundle.templates.push(
        toSuggestion(
          "templates",
          result.title,
          result.subtitle ?? "Professional tool",
          7,
          "professional-tools",
          result.resourceId
        )
      );
    }
    if (result.type === "standard" && bundle.standards.length < 6) {
      const exists = bundle.standards.some((s) => s.title === result.title);
      if (!exists) {
        bundle.standards.push(
          toSuggestion(
            "standards",
            result.title,
            result.subtitle ?? "Standard",
            7,
            "standards",
            result.resourceId
          )
        );
      }
    }
  }

  return bundle;
};

export const flattenRelatedKnowledge = (
  bundle: RelatedKnowledgeBundle
): CopilotSuggestion[] => [
  ...bundle.standards,
  ...bundle.calculators,
  ...bundle.templates,
  ...bundle.documents,
  ...bundle.learningResources,
  ...bundle.workflows,
];
