export const WORKFLOW_STEP_RESOURCE_KEYS = {
  knowledge: "knowledge",
  standards: "standards",
  calculators: "calculators",
  professionalTools: "professional-tools",
  aiExpert: "ai-expert",
} as const;

export type WorkflowStepResourceKey =
  (typeof WORKFLOW_STEP_RESOURCE_KEYS)[keyof typeof WORKFLOW_STEP_RESOURCE_KEYS];

export const WORKFLOW_STEP_RESOURCE_LABELS: Record<
  WorkflowStepResourceKey,
  string
> = {
  knowledge: "Knowledge",
  standards: "Standards",
  calculators: "Calculators",
  "professional-tools": "Professional Tools",
  "ai-expert": "AI Expert",
};

export type EngineeringWorkflowStatus =
  | "available"
  | "beta"
  | "coming-soon";

export interface EngineeringWorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  resourceType: WorkflowStepResourceKey;
  resourceId?: string;
  resourceRef?: string;
}

export interface EngineeringWorkflow {
  id: string;
  key: string;
  title: string;
  description: string;
  status: EngineeringWorkflowStatus;
  enabled: boolean;
  disciplineId: string;
  specializationId?: string;
  steps: EngineeringWorkflowStep[];
}

export interface EngineeringWorkflowRegistry {
  disciplineId: string;
  disciplineName: string;
  workflows: EngineeringWorkflow[];
}

export interface EngineeringWorkflowRegistryMap {
  registries: Record<string, EngineeringWorkflowRegistry>;
  getRegistry: (
    disciplineId: string
  ) => EngineeringWorkflowRegistry | undefined;
  listRegistries: () => EngineeringWorkflowRegistry[];
}
