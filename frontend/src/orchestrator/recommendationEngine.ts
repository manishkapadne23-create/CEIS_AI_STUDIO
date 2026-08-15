import {
  getCalculatorsCatalogByDisciplineId,
  searchCalculatorsMetadata,
} from "../config/calculators";
import {
  getStandardsCatalogByDisciplineId,
  searchStandardsMetadata,
} from "../config/standards";
import { searchEngineeringKnowledge } from "../knowledge";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { getWorkflowsForDiscipline, searchWorkflows } from "../workflows";
import type {
  EngineeringKnowledgeGraph,
  OrchestratorRecommendation,
} from "./types";

export const generateOrchestratorRecommendations = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null,
  knowledgeGraph: EngineeringKnowledgeGraph
): OrchestratorRecommendation[] => {
  const recommendations: OrchestratorRecommendation[] = [];

  if (!disciplineId) {
    return recommendations;
  }

  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
  searchStandardsMetadata(
    standardsCatalog?.standards ?? [],
    message,
    disciplineName
  )
    .slice(0, 4)
    .forEach((standard, index) => {
      recommendations.push({
        category: "standards",
        title: standard.codeNumber,
        description: standard.title,
        moduleId: "standards",
        resourceId: standard.id,
        priority: 10 - index,
      });
    });

  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);
  searchCalculatorsMetadata(
    calculatorsCatalog?.calculators ?? [],
    message,
    disciplineName
  )
    .slice(0, 4)
    .forEach((calculator, index) => {
      recommendations.push({
        category: "calculators",
        title: calculator.name,
        description: calculator.description,
        moduleId: "calculators",
        resourceId: calculator.id,
        priority: 9 - index,
      });
    });

  const workflowResults = searchWorkflows(message, disciplineId).slice(0, 3);
  const workflows =
    workflowResults.length > 0
      ? workflowResults
      : getWorkflowsForDiscipline(disciplineId, disciplineName).slice(0, 3);

  workflows.forEach((workflow, index) => {
    recommendations.push({
      category: "workflows",
      title: workflow.title,
      description: workflow.objective,
      moduleId: "professional-tools",
      resourceId: workflow.id,
      priority: 8 - index,
    });
  });

  const toolsRegistry = getProfessionalToolsRegistry(disciplineId);
  toolsRegistry?.categories
    .flatMap((category) => category.tools)
    .slice(0, 3)
    .forEach((tool, index) => {
      recommendations.push({
        category: "professional-tools",
        title: tool.title,
        description: tool.description,
        moduleId: "professional-tools",
        resourceId: tool.id,
        priority: 7 - index,
      });

      if (
        tool.category === "templates" ||
        tool.category === "report-generators"
      ) {
        recommendations.push({
          category: tool.category === "templates" ? "templates" : "reports",
          title: tool.title,
          description: tool.description,
          moduleId: "professional-tools",
          resourceId: tool.id,
          priority: 6 - index,
        });
      }
    });

  searchEngineeringKnowledge(message, { disciplineId, limit: 4 }).forEach(
    (result, index) => {
      const isLearning =
        result.type === "knowledge" &&
        "moduleId" in result &&
        result.moduleId === "learning-hub";

      recommendations.push({
        category: isLearning ? "learning-resources" : "templates",
        title: result.title,
        description: result.subtitle ?? "Engineering resource",
        moduleId: isLearning ? "learning-hub" : "documents",
        resourceId: result.resourceId,
        priority: 5 - index,
      });
    }
  );

  for (const node of knowledgeGraph.nodes) {
    if (node.type === "report") {
      recommendations.push({
        category: "reports",
        title: node.label,
        description: node.description ?? "Related report",
        moduleId: node.moduleId ?? "professional-tools",
        resourceId: node.resourceId,
        priority: 4,
      });
    }
  }

  const seen = new Set<string>();
  return recommendations
    .filter((rec) => {
      const key = `${rec.category}:${rec.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 16);
};

export const formatRecommendationsForPrompt = (
  recommendations: OrchestratorRecommendation[]
): string => {
  if (recommendations.length === 0) {
    return "No specific resource recommendations for this query.";
  }

  const grouped = recommendations.reduce<
    Record<string, OrchestratorRecommendation[]>
  >((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = [];
    acc[rec.category].push(rec);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([category, items]) => {
      const lines = items
        .slice(0, 4)
        .map((item) => `  - ${item.title}: ${item.description}`);
      return `${category}:\n${lines.join("\n")}`;
    })
    .join("\n\n");
};
