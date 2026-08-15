import type { WorkspaceCategoryStatus } from "../components/WorkspaceCategoryCard";
import type { AIEngineeringWorkspaceData } from "../types/AIEngineeringWorkspace";

export type WorkspaceCategoryId =
  | "standards"
  | "ai-expert"
  | "calculators"
  | "professional-tools"
  | "documents"
  | "learning-hub";

export interface WorkspaceCategoryDefinition {
  id: WorkspaceCategoryId;
  title: string;
  description: string;
  icon: string;
  sectionKey?:
    | "standards"
    | "aiExpert"
    | "calculators"
    | "professionalTools"
    | "documents"
    | "learningHub";
}

export const WORKSPACE_CATEGORY_DEFINITIONS: WorkspaceCategoryDefinition[] = [
  {
    id: "standards",
    title: "Standards & Codes",
    description:
      "Browse IRC, IS, MoRTH, ASTM, AASHTO, and discipline-specific standards.",
    icon: "📜",
    sectionKey: "standards",
  },
  {
    id: "ai-expert",
    title: "AI Expert",
    description:
      "Discipline expert profile, scope, and AI-assisted engineering guidance.",
    icon: "🧠",
    sectionKey: "aiExpert",
  },
  {
    id: "calculators",
    title: "Calculators",
    description: "Engineering calculators from the discipline registry.",
    icon: "🔢",
    sectionKey: "calculators",
  },
  {
    id: "professional-tools",
    title: "Professional Tools",
    description: "Professional tools and utilities for engineering workflows.",
    icon: "🛠️",
    sectionKey: "professionalTools",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Engineering documents, templates, and reference files.",
    icon: "📁",
    sectionKey: "documents",
  },
  {
    id: "learning-hub",
    title: "Learning Hub",
    description: "Courses, references, and learning resources for the discipline.",
    icon: "📚",
    sectionKey: "learningHub",
  },
];

export const resolveCategoryStatus = (
  _definition: WorkspaceCategoryDefinition,
  workspaceData: AIEngineeringWorkspaceData,
  _itemCount: number
): WorkspaceCategoryStatus => {
  if (!workspaceData.disciplineConfig || workspaceData.isPlaceholderDiscipline) {
    return "coming-soon";
  }

  return "active";
};

export const getCategoryItemCount = (
  definition: WorkspaceCategoryDefinition,
  workspaceData: AIEngineeringWorkspaceData,
  standardsCount = 0
): number => {
  if (definition.id === "standards") {
    return standardsCount;
  }

  if (!definition.sectionKey) {
    return 0;
  }

  return workspaceData.sections[definition.sectionKey].items.length;
};
