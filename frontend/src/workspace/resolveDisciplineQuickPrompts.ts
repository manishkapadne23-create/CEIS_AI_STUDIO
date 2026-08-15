import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import { resolveSpecializationKnowledgeForExpert } from "../ai/expert/resolveExpertProfile";
import { getProfessionalToolsRegistry } from "../knowledge/professional-tools/professionalToolsRegistry";
import { getDisciplineIdByName } from "../knowledge/utils/resolveKnowledgeModule";

export interface DisciplineQuickPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

const DEFAULT_QUICK_PROMPTS: DisciplineQuickPrompt[] = [
  {
    id: "default-help",
    label: "How can CEIS AI help?",
    prompt: "How can CEIS AI help me with my engineering project?",
    icon: "💡",
  },
  {
    id: "default-standards",
    label: "Explain Standards",
    prompt: "Explain the applicable engineering standards for my project.",
    icon: "📜",
  },
  {
    id: "default-design",
    label: "Design Guidance",
    prompt: "Provide design guidance for my selected engineering discipline.",
    icon: "📐",
  },
  {
    id: "default-estimate",
    label: "Project Estimation",
    prompt: "Help me estimate scope, cost, and deliverables for this project.",
    icon: "💰",
  },
];

const uniqueById = (
  prompts: DisciplineQuickPrompt[]
): DisciplineQuickPrompt[] => {
  const seen = new Set<string>();

  return prompts.filter((prompt) => {
    if (seen.has(prompt.id)) {
      return false;
    }

    seen.add(prompt.id);
    return true;
  });
};

export const resolveDisciplineQuickPrompts = (
  workspace: EngineeringWorkspace
): DisciplineQuickPrompt[] => {
  const disciplineId = getDisciplineIdByName(workspace.domain);
  const disciplineName = workspace.domain;

  if (!disciplineId || !disciplineName) {
    return DEFAULT_QUICK_PROMPTS;
  }

  const specializationKnowledge = resolveSpecializationKnowledgeForExpert(
    disciplineId,
    disciplineName,
    workspace
  );

  const professionalToolsRegistry =
    getProfessionalToolsRegistry(disciplineId);

  const prompts: DisciplineQuickPrompt[] = [];

  specializationKnowledge.aiEngineeringAgents.forEach((agent) => {
    prompts.push({
      id: `agent-${agent.id}`,
      label: agent.title,
      prompt: agent.description
        ? `Act as the ${agent.title}. ${agent.description}`
        : `Act as the ${agent.title} for my current engineering task.`,
      icon: "🤖",
    });
  });

  specializationKnowledge.engineeringCalculators.forEach((calculator) => {
    prompts.push({
      id: `calculator-${calculator.id}`,
      label: calculator.title,
      prompt: calculator.description
        ? `Help me use the ${calculator.title}. ${calculator.description}`
        : `Run a ${calculator.title} analysis for my project.`,
      icon: "🔢",
    });
  });

  professionalToolsRegistry?.categories.forEach((category) => {
    category.tools
      .filter((tool) => tool.enabled)
      .forEach((tool) => {
        prompts.push({
          id: `tool-${tool.id}`,
          label: tool.title,
          prompt: `Use the ${tool.title} professional tool. ${tool.description}`,
          icon: "🛠️",
        });
      });
  });

  specializationKnowledge.designModules.forEach((module) => {
    prompts.push({
      id: `module-${module.id}`,
      label: module.title,
      prompt: module.description
        ? `Guide me through ${module.title}. ${module.description}`
        : `Guide me through ${module.title} for my project.`,
      icon: "📐",
    });
  });

  specializationKnowledge.scope.forEach((scopeItem, index) => {
    prompts.push({
      id: `scope-${index}`,
      label: scopeItem,
      prompt: `Provide expert guidance on ${scopeItem.toLowerCase()}.`,
      icon: "📋",
    });
  });

  if (prompts.length === 0) {
    return DEFAULT_QUICK_PROMPTS.map((prompt) => ({
      ...prompt,
      prompt: `${prompt.prompt} Focus on ${disciplineName}.`,
    }));
  }

  return uniqueById(prompts).slice(0, 8);
};
