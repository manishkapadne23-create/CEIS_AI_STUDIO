import type { EngineeringDisciplineWorkspaceConfig } from "../config/disciplines";

export interface ModuleWorkspaceProps {
  disciplineConfig: EngineeringDisciplineWorkspaceConfig;
}

export interface ModuleWorkspaceItem {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  icon?: string;
}
