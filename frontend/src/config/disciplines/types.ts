export interface DisciplineModuleConfig {
  title: string;
  description: string;
}

export type DisciplineModuleKey =
  | "aiExpert"
  | "standards"
  | "calculators"
  | "professionalTools"
  | "templates"
  | "workflows"
  | "documents"
  | "learningHub";

export interface EngineeringDisciplineWorkspaceConfig {
  id: string;
  name: string;
  modules: Record<DisciplineModuleKey, DisciplineModuleConfig>;
  chatPlaceholder: string;
  workspaceLabel: string;
  assistantLabel: string;
}
