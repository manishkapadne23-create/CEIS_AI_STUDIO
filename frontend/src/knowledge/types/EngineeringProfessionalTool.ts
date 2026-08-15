export const PROFESSIONAL_TOOL_CATEGORY_KEYS = {
  calculators: "calculators",
  designAssistants: "design-assistants",
  estimationTools: "estimation-tools",
  templates: "templates",
  checklists: "checklists",
  reportGenerators: "report-generators",
} as const;

export type ProfessionalToolCategoryKey =
  (typeof PROFESSIONAL_TOOL_CATEGORY_KEYS)[keyof typeof PROFESSIONAL_TOOL_CATEGORY_KEYS];

export const PROFESSIONAL_TOOL_CATEGORY_LABELS: Record<
  ProfessionalToolCategoryKey,
  string
> = {
  calculators: "Calculators",
  "design-assistants": "Design Assistants",
  "estimation-tools": "Estimation Tools",
  templates: "Templates",
  checklists: "Checklists",
  "report-generators": "Report Generators",
};

export type ProfessionalToolStatus = "available" | "beta" | "coming-soon";

export interface EngineeringProfessionalTool {
  id: string;
  key: string;
  title: string;
  description: string;
  category: ProfessionalToolCategoryKey;
  status: ProfessionalToolStatus;
  enabled: boolean;
  specializationId?: string;
}

export interface EngineeringProfessionalToolsCategory {
  key: ProfessionalToolCategoryKey;
  label: string;
  tools: EngineeringProfessionalTool[];
}

export interface EngineeringProfessionalToolsRegistry {
  disciplineId: string;
  disciplineName: string;
  categories: EngineeringProfessionalToolsCategory[];
}

export interface EngineeringProfessionalToolsRegistryMap {
  registries: Record<string, EngineeringProfessionalToolsRegistry>;
  getRegistry: (
    disciplineId: string
  ) => EngineeringProfessionalToolsRegistry | undefined;
  listRegistries: () => EngineeringProfessionalToolsRegistry[];
}
