export type DesignDisciplineId =
  | "civil-engineering"
  | "mechanical-engineering"
  | "electrical-engineering"
  | "computer-engineering"
  | "electronics-telecommunication-engineering"
  | "chemical-engineering"
  | "environmental-engineering"
  | "mining-engineering"
  | "marine-engineering"
  | "railway-engineering"
  | "aerospace-engineering"
  | "industrial-engineering"
  | "automation-robotics"
  | "renewable-energy"
  | "architecture-planning"
  | "agricultural-engineering"
  | "oil-gas-engineering"
  | "biomedical-engineering";

export type DesignStepId =
  | "problem-definition"
  | "design-criteria"
  | "input-parameters"
  | "applicable-standards"
  | "engineering-assumptions"
  | "design-methodology"
  | "engineering-calculations"
  | "alternative-solutions"
  | "risk-considerations"
  | "design-validation"
  | "engineering-recommendations"
  | "final-design-summary";

export type DesignCategory =
  | "structural"
  | "geotechnical"
  | "transportation"
  | "hydraulic"
  | "mechanical-systems"
  | "thermal"
  | "electrical-systems"
  | "power"
  | "software"
  | "network"
  | "process"
  | "environmental"
  | "mining"
  | "marine"
  | "railway"
  | "aerospace"
  | "industrial"
  | "automation"
  | "renewable"
  | "architectural"
  | "agricultural"
  | "oil-gas"
  | "biomedical"
  | "general";

export interface DesignStep {
  id: DesignStepId;
  order: number;
  title: string;
  description: string;
  requiredInputs: string[];
  guidance: string;
}

export interface DesignTemplate {
  id: string;
  title: string;
  category: DesignCategory;
  disciplineId: DesignDisciplineId;
  disciplineName: string;
  description: string;
  steps: DesignStep[];
  suggestedStandards: string[];
  suggestedCalculators: string[];
  suggestedTools: string[];
  suggestedTemplates: string[];
}

export interface DesignRevision {
  revision: string;
  date: string;
  description: string;
}

export interface DesignSession {
  id: string;
  templateId: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  category: DesignCategory;
  conversationId: string | null;
  currentStepIndex: number;
  completedStepIds: DesignStepId[];
  stepData: Partial<Record<DesignStepId, string>>;
  revisions: DesignRevision[];
  status: "in-progress" | "completed" | "paused";
  createdAt: number;
  updatedAt: number;
}

export interface DesignValidationResult {
  isValid: boolean;
  completenessScore: number;
  missingInputs: string[];
  warnings: string[];
  recommendations: string[];
}

export interface DesignReport {
  title: string;
  designSummary: string;
  designBasis: string;
  calculationSummary: string;
  checklist: string[];
  inputDataSheet: string;
  designNotes: string;
  recommendations: string;
  generatedAt: number;
}

export interface DesignSearchQuery {
  keyword?: string;
  disciplineId?: string | null;
  category?: DesignCategory;
  standard?: string;
  favoritesOnly?: boolean;
  limit?: number;
}

export interface DesignSearchResult {
  query: DesignSearchQuery;
  templates: DesignTemplate[];
  totalCount: number;
}

export interface DesignWizardInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
  selectedStandardCode: string | null;
}

export interface DesignWizardResult {
  active: boolean;
  activeSession: DesignSession | null;
  currentStep: DesignStep | null;
  designAction: string | null;
  reportAction: string | null;
  validation: DesignValidationResult | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface DesignExtensionHooks {
  cadIntegrationId?: string | null;
  bimIntegrationId?: string | null;
  femSoftwareId?: string | null;
  simulationSoftwareId?: string | null;
  pmisDesignModuleId?: string | null;
}
