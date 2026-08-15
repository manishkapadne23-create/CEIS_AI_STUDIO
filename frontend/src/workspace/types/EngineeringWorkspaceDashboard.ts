export interface WorkspaceDashboardItem {
  id: string;
  title: string;
  description?: string;
  status?: "available" | "beta" | "coming-soon";
  badge?: string;
  icon?: string;
}

export interface WorkspaceDashboardSection {
  id: string;
  title: string;
  description: string;
  items: WorkspaceDashboardItem[];
  isPlaceholder: boolean;
}

export interface EngineeringWorkspaceDashboardData {
  disciplineId: string | null;
  disciplineName: string | null;
  branch: string | null;
  specialization: string | null;
  country: string;
  isPlaceholderDiscipline: boolean;
  sections: {
    aiExpert: WorkspaceDashboardSection;
    professionalTools: WorkspaceDashboardSection;
    standards: WorkspaceDashboardSection;
    templates: WorkspaceDashboardSection;
    learning: WorkspaceDashboardSection;
    aiAgents: WorkspaceDashboardSection;
  };
}
