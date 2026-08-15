import type {
  WorkspaceDashboardItem,
  WorkspaceDashboardSection,
} from "./EngineeringWorkspaceDashboard";
import type { EngineeringDisciplineWorkspaceConfig } from "../../config/disciplines";

export interface AIEngineeringWorkspaceDiscipline {
  id: string | null;
  name: string | null;
  branch: string | null;
  specialization: string | null;
  country: string;
  codes: string[];
  knowledgeModuleName: string | null;
  knowledgeOverview: string | null;
  enabledCapabilities: number;
  totalCapabilities: number;
}

export interface AIEngineeringWorkspaceData {
  discipline: AIEngineeringWorkspaceDiscipline;
  disciplineConfig: EngineeringDisciplineWorkspaceConfig | null;
  isPlaceholderDiscipline: boolean;
  sections: {
    aiExpert: WorkspaceDashboardSection;
    standards: WorkspaceDashboardSection;
    calculators: WorkspaceDashboardSection;
    professionalTools: WorkspaceDashboardSection;
    workflows: WorkspaceDashboardSection;
    quickTasks: WorkspaceDashboardSection;
    templates: WorkspaceDashboardSection;
    documents: WorkspaceDashboardSection;
    learningHub: WorkspaceDashboardSection;
  };
}

export type { WorkspaceDashboardItem, WorkspaceDashboardSection };
