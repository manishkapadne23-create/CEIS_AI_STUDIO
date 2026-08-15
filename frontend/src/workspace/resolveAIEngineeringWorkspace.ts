import {
  resolveEngineeringAIExpertProfile,
  resolveSpecializationKnowledgeForExpert,
} from "../ai/expert/resolveExpertProfile";
import { getDisciplineWorkspaceConfigById } from "../config/disciplines";
import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import { getCalculatorsCatalogByDisciplineId } from "../config/calculators";
import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { getCapabilityRegistry } from "../knowledge/capabilities/capabilityRegistry";
import { getKnowledgeModule } from "../knowledge/data/registry";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { getWorkflowRegistry } from "../knowledge/workflows/workflowRegistry";
import { getDisciplineIdByName } from "../knowledge/utils/resolveKnowledgeModule";
import { ENGINEERING_TEMPLATES } from "../sarathi/modules/templatesData";
import { resolveDisciplineQuickPrompts } from "./resolveDisciplineQuickPrompts";
import type {
  AIEngineeringWorkspaceData,
  WorkspaceDashboardItem,
  WorkspaceDashboardSection,
} from "./types/AIEngineeringWorkspace";

const createSection = (
  id: string,
  title: string,
  description: string,
  items: WorkspaceDashboardItem[],
  isPlaceholder: boolean
): WorkspaceDashboardSection => ({
  id,
  title,
  description,
  items,
  isPlaceholder,
});

const mapStatus = (
  isPlaceholderDiscipline: boolean,
  status: "available" | "beta" | "coming-soon" = "available"
): WorkspaceDashboardItem["status"] => {
  if (isPlaceholderDiscipline) {
    return "coming-soon";
  }

  return status;
};

export const resolveAIEngineeringWorkspace = (
  workspace: EngineeringWorkspace
): AIEngineeringWorkspaceData => {
  const disciplineId = getDisciplineIdByName(workspace.domain);
  const disciplineName = workspace.domain;
  const disciplineConfig = getDisciplineWorkspaceConfigById(disciplineId);
  const isPlaceholderDiscipline = !disciplineConfig;

  const expertProfile = resolveEngineeringAIExpertProfile(workspace);
  const knowledgeModule = disciplineId
    ? getKnowledgeModule(disciplineId) ?? null
    : null;

  const specializationKnowledge =
    disciplineId && disciplineName
      ? resolveSpecializationKnowledgeForExpert(
          disciplineId,
          disciplineName,
          workspace
        )
      : null;

  const capabilityRegistry = disciplineId
    ? getCapabilityRegistry(disciplineId)
    : undefined;

  const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);

  const professionalToolsRegistry = disciplineId
    ? getProfessionalToolsRegistry(disciplineId)
    : undefined;

  const workflowRegistry = disciplineId
    ? getWorkflowRegistry(disciplineId)
    : undefined;

  const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);

  const quickPrompts = resolveDisciplineQuickPrompts(workspace);

  const enabledCapabilities =
    capabilityRegistry?.capabilities.filter(
      (capability) => capability.enabled
    ) ?? [];

  const aiExpertItems: WorkspaceDashboardItem[] = [
    {
      id: expertProfile.id,
      title:
        disciplineConfig?.modules.aiExpert.title ??
        `${expertProfile.specialization} Expert`,
      description: expertProfile.responseStyle,
      badge: expertProfile.discipline,
      status: mapStatus(isPlaceholderDiscipline),
      icon: "🧠",
    },
    ...expertProfile.scope.slice(0, 3).map((scopeItem, index) => ({
      id: `expert-scope-${index}`,
      title: scopeItem,
      status: mapStatus(isPlaceholderDiscipline),
    })),
  ];

  const standardsItems: WorkspaceDashboardItem[] =
    standardsCatalog?.standards.map((standard) => ({
      id: standard.id,
      title: standard.codeNumber,
      description: standard.title,
      badge: standard.publisher,
      status: mapStatus(
        isPlaceholderDiscipline,
        standard.status === "withdrawn" || standard.status === "superseded"
          ? "coming-soon"
          : "available"
      ),
    })) ?? [];

  const calculatorItems: WorkspaceDashboardItem[] =
    calculatorsCatalog?.calculators.map((calculator) => ({
      id: calculator.id,
      title: calculator.name,
      description: calculator.description,
      badge: calculator.category,
      status: mapStatus(isPlaceholderDiscipline, calculator.status),
    })) ?? [];

  const professionalToolItems: WorkspaceDashboardItem[] =
    professionalToolsRegistry
      ? professionalToolsRegistry.categories.flatMap((category) =>
          category.tools.map((tool) => ({
            id: tool.id,
            title: tool.title,
            description: tool.description,
            badge: category.label,
            status: mapStatus(isPlaceholderDiscipline, tool.status),
          }))
        )
      : [];

  const workflowItems: WorkspaceDashboardItem[] =
    workflowRegistry?.workflows.map((workflow) => ({
      id: workflow.id,
      title: workflow.title,
      description: workflow.description,
      badge: `${workflow.steps.length} steps`,
      status: mapStatus(isPlaceholderDiscipline, workflow.status),
    })) ?? [];

  const templateItems: WorkspaceDashboardItem[] = ENGINEERING_TEMPLATES.map(
    (template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      badge: template.category,
      status: mapStatus(isPlaceholderDiscipline),
    })
  );

  const documentItems: WorkspaceDashboardItem[] = [
    {
      id: "documents-overview",
      title: disciplineConfig?.modules.documents.title ?? "Documents",
      description:
        disciplineConfig?.modules.documents.description ??
        "Engineering documents for the active discipline.",
      status: mapStatus(isPlaceholderDiscipline),
      icon: "📁",
    },
  ];

  const learningHubItems: WorkspaceDashboardItem[] = [
    {
      id: "learning-hub-overview",
      title: disciplineConfig?.modules.learningHub.title ?? "Learning Hub",
      description:
        disciplineConfig?.modules.learningHub.description ??
        "Learning resources for the active discipline.",
      status: mapStatus(isPlaceholderDiscipline),
      icon: "📚",
    },
  ];

  const quickTaskItems: WorkspaceDashboardItem[] = quickPrompts.map(
    (prompt) => ({
      id: prompt.id,
      title: prompt.label,
      description: prompt.prompt,
      icon: prompt.icon,
      status: mapStatus(isPlaceholderDiscipline, "available"),
    })
  );

  return {
    discipline: {
      id: disciplineId,
      name: disciplineName,
      branch: workspace.branch,
      specialization: workspace.specialization,
      country: workspace.country,
      codes: workspace.codes,
      knowledgeModuleName: knowledgeModule?.disciplineName ?? null,
      knowledgeOverview:
        specializationKnowledge?.overview ??
        knowledgeModule?.metadata?.description ??
        disciplineConfig?.modules.aiExpert.description ??
        null,
      enabledCapabilities: enabledCapabilities.length,
      totalCapabilities: capabilityRegistry?.capabilities.length ?? 0,
    },
    disciplineConfig,
    isPlaceholderDiscipline,
    sections: {
      aiExpert: createSection(
        "ai-expert",
        disciplineConfig?.modules.aiExpert.title ?? "AI Expert",
        disciplineConfig?.modules.aiExpert.description ??
          "Discipline expert profile and AI-assisted engineering guidance.",
        aiExpertItems,
        isPlaceholderDiscipline
      ),
      standards: createSection(
        "standards",
        disciplineConfig?.modules.standards.title ?? "Standards & Codes",
        disciplineConfig?.modules.standards.description ??
          "Applicable codes and standards for the active discipline.",
        standardsItems,
        isPlaceholderDiscipline
      ),
      calculators: createSection(
        "calculators",
        disciplineConfig?.modules.calculators.title ?? "Calculators",
        disciplineConfig?.modules.calculators.description ??
          "Engineering calculators for the active discipline.",
        calculatorItems,
        isPlaceholderDiscipline
      ),
      professionalTools: createSection(
        "professional-tools",
        disciplineConfig?.modules.professionalTools.title ??
          "Professional Tools",
        disciplineConfig?.modules.professionalTools.description ??
          "Professional tools for the active discipline.",
        professionalToolItems,
        isPlaceholderDiscipline
      ),
      workflows: createSection(
        "workflows",
        disciplineConfig?.modules.workflows.title ?? "Workflows",
        disciplineConfig?.modules.workflows.description ??
          "Guided workflows for the active discipline.",
        workflowItems,
        isPlaceholderDiscipline
      ),
      quickTasks: createSection(
        "quick-tasks",
        "Quick Engineering Tasks",
        "Common engineering tasks derived from discipline knowledge, tools, and registries.",
        quickTaskItems,
        isPlaceholderDiscipline
      ),
      templates: createSection(
        "templates",
        disciplineConfig?.modules.templates.title ?? "Templates",
        disciplineConfig?.modules.templates.description ??
          "Templates for the active discipline.",
        templateItems,
        isPlaceholderDiscipline
      ),
      documents: createSection(
        "documents",
        disciplineConfig?.modules.documents.title ?? "Documents",
        disciplineConfig?.modules.documents.description ??
          "Documents for the active discipline.",
        documentItems,
        isPlaceholderDiscipline
      ),
      learningHub: createSection(
        "learning-hub",
        disciplineConfig?.modules.learningHub.title ?? "Learning Hub",
        disciplineConfig?.modules.learningHub.description ??
          "Learning resources for the active discipline.",
        learningHubItems,
        isPlaceholderDiscipline
      ),
    },
  };
};
