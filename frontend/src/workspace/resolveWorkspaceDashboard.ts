import {
  resolveEngineeringAIExpertProfile,
  resolveSpecializationKnowledgeForExpert,
} from "../ai/expert/resolveExpertProfile";
import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import { getCapabilityRegistry } from "../knowledge/capabilities/capabilityRegistry";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { resolveStandardsWithKnowledge } from "../knowledge/utils/resolveStandardsWithKnowledge";
import { getDisciplineIdByName } from "../knowledge/utils/resolveKnowledgeModule";
import type {
  EngineeringWorkspaceDashboardData,
  WorkspaceDashboardItem,
  WorkspaceDashboardSection,
} from "./types/EngineeringWorkspaceDashboard";

const CIVIL_ENGINEERING_DISCIPLINE_ID = "civil-engineering";

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

const toKnowledgeItems = (
  items: Array<{
    id: string;
    title: string;
    description?: string;
  }>,
  status: WorkspaceDashboardItem["status"] = "available"
): WorkspaceDashboardItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status,
  }));

export const resolveWorkspaceDashboard = (
  workspace: EngineeringWorkspace
): EngineeringWorkspaceDashboardData => {
  const disciplineId = getDisciplineIdByName(workspace.domain);
  const disciplineName = workspace.domain;
  const isPlaceholderDiscipline =
    disciplineId !== CIVIL_ENGINEERING_DISCIPLINE_ID;

  const expertProfile = resolveEngineeringAIExpertProfile(workspace);

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

  const professionalToolsRegistry = disciplineId
    ? getProfessionalToolsRegistry(disciplineId)
    : undefined;

  const aiExpertItems: WorkspaceDashboardItem[] = [
    {
      id: expertProfile.id,
      title: `${expertProfile.specialization} Expert`,
      description: expertProfile.responseStyle,
      badge: expertProfile.discipline,
      status: isPlaceholderDiscipline ? "coming-soon" : "available",
    },
    ...expertProfile.scope.slice(0, 4).map((scopeItem, index) => ({
      id: `expert-scope-${index}`,
      title: scopeItem,
      status: isPlaceholderDiscipline
        ? ("coming-soon" as const)
        : ("available" as const),
    })),
  ];

  const professionalToolItems: WorkspaceDashboardItem[] =
    professionalToolsRegistry
      ? professionalToolsRegistry.categories.flatMap((category) =>
          category.tools.map((tool) => ({
            id: tool.id,
            title: tool.title,
            description: tool.description,
            status: tool.status,
            badge: category.label,
          }))
        )
      : [];

  const standardsItems = (() => {
    const resolved = resolveStandardsWithKnowledge(workspace);

    return resolved.standards.map((standard) => ({
      id: standard.id,
      title: `${standard.code} — ${standard.title}`,
      description: standard.description,
      status: isPlaceholderDiscipline
        ? ("coming-soon" as const)
        : standard.status === "coming-soon"
          ? ("coming-soon" as const)
          : ("available" as const),
    }));
  })();

  const templateItems = specializationKnowledge
    ? toKnowledgeItems(
        specializationKnowledge.templates,
        isPlaceholderDiscipline ? "coming-soon" : "available"
      )
    : [];

  const learningItems = specializationKnowledge
    ? toKnowledgeItems(
        specializationKnowledge.learningResources,
        isPlaceholderDiscipline ? "coming-soon" : "available"
      )
    : [];

  const agentItems = specializationKnowledge
    ? toKnowledgeItems(
        specializationKnowledge.aiEngineeringAgents,
        isPlaceholderDiscipline ? "coming-soon" : "available"
      )
    : [];

  const enabledCapabilityCount =
    capabilityRegistry?.capabilities.filter(
      (capability) => capability.enabled
    ).length ?? 0;

  return {
    disciplineId,
    disciplineName,
    branch: workspace.branch,
    specialization: workspace.specialization,
    country: workspace.country,
    isPlaceholderDiscipline,
    sections: {
      aiExpert: createSection(
        "ai-expert",
        "AI Expert",
        isPlaceholderDiscipline
          ? "Discipline expert profile will be activated as knowledge modules are expanded."
          : `Active ${expertProfile.specialization} expert with ${enabledCapabilityCount} enabled capabilities.`,
        aiExpertItems,
        isPlaceholderDiscipline
      ),
      professionalTools: createSection(
        "professional-tools",
        "Professional Tools",
        isPlaceholderDiscipline
          ? "Professional tools catalog is planned for this discipline."
          : "Calculators, design assistants, estimation tools, templates, checklists, and report generators.",
        professionalToolItems,
        isPlaceholderDiscipline
      ),
      standards: createSection(
        "standards",
        "Standards",
        isPlaceholderDiscipline
          ? "Applicable codes and standards will be listed here."
          : "Design standards and governing codes for the selected specialization.",
        standardsItems,
        isPlaceholderDiscipline
      ),
      templates: createSection(
        "templates",
        "Templates",
        isPlaceholderDiscipline
          ? "Engineering document templates are coming soon."
          : "Project documentation and reporting templates.",
        templateItems,
        isPlaceholderDiscipline
      ),
      learning: createSection(
        "learning",
        "Learning",
        isPlaceholderDiscipline
          ? "Learning resources will be added for this discipline."
          : "Courses, references, and exam preparation resources.",
        learningItems,
        isPlaceholderDiscipline
      ),
      aiAgents: createSection(
        "ai-agents",
        "Available AI Agents",
        isPlaceholderDiscipline
          ? "Specialized AI engineering agents are planned for this discipline."
          : "Discipline-specific AI agents available for engineering workflows.",
        agentItems,
        isPlaceholderDiscipline
      ),
    },
  };
};
