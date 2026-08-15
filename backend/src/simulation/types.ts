export type EssaeScenarioTypeId =
  | "DESIGN_ALTERNATIVES"
  | "MATERIAL_ALTERNATIVES"
  | "CONSTRUCTION_METHODS"
  | "EQUIPMENT_SELECTION"
  | "TECHNOLOGY_COMPARISON"
  | "COST_SCENARIOS"
  | "SCHEDULE_SCENARIOS"
  | "RISK_SCENARIOS"
  | "ENVIRONMENTAL_SCENARIOS"
  | "MAINTENANCE_SCENARIOS";

export type EssaeImpactLevel = "low" | "medium" | "high";

export interface EssaeScenarioOption {
  id: string;
  label: string;
  description?: string;
  parameters?: Record<string, string | number | boolean | null>;
  advantages?: string[];
  limitations?: string[];
  costImpact?: EssaeImpactLevel;
  riskImpact?: EssaeImpactLevel;
  qualityImpact?: EssaeImpactLevel;
  maintainability?: EssaeImpactLevel;
  lifecycleConsiderations?: string[];
}

export interface EssaeScenarioInput {
  title: string;
  scenarioType: EssaeScenarioTypeId;
  disciplineId?: string | null;
  disciplineName?: string | null;
  description?: string | null;
  assumptions?: string[];
  parameters?: Record<string, string | number | boolean | null>;
  options: EssaeScenarioOption[];
}

export interface EssaeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  trackedAssumptions: string[];
}

export interface EssaeOptionComparison {
  optionId: string;
  label: string;
  advantages: string[];
  limitations: string[];
  costImpact: EssaeImpactLevel;
  riskImpact: EssaeImpactLevel;
  qualityImpact: EssaeImpactLevel;
  maintainability: EssaeImpactLevel;
  lifecycleConsiderations: string[];
  score: number;
}

export interface EssaeComparisonMatrix {
  criteria: string[];
  options: Array<{
    optionId: string;
    label: string;
    values: Record<string, string | number>;
  }>;
}

export interface EssaeSimulationResults {
  simulationSummary: string;
  comparisonMatrix: EssaeComparisonMatrix;
  optionComparisons: EssaeOptionComparison[];
  engineeringRecommendations: string[];
  decisionSupportNotes: string[];
  riskAssessment: string[];
  executiveSummary: string;
  recommendedOptionId: string | null;
  promptAugmentation: string;
}

export interface EssaeSimulationPackage {
  engine: "Engineering Simulation & Scenario Analysis Engine";
  version: string;
  disclaimer: string;
  scenario: EssaeScenarioInput;
  validation: EssaeValidationResult;
  results: EssaeSimulationResults;
  generatedAt: string;
}

export interface EssaeRunSimulationInput {
  userId?: string | null;
  workspaceId?: string | null;
  scenarioId?: string | null;
  scenario?: EssaeScenarioInput;
  saveResults?: boolean;
}

export interface EssaeWorkspaceInput {
  name: string;
  description?: string | null;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
}

export interface EssaeAssistantInput {
  message: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  projectContext?: string | null;
  primaryIntent?: string | null;
  moduleId?: string | null;
}

export interface EssaeAssistantPackage extends EssaeSimulationPackage {
  enabled: boolean;
  assistantCapabilities: string[];
  futureIntegrations: string[];
}
