export type ExpertModeId =
  | "design-expert"
  | "execution-expert"
  | "planning-expert"
  | "qa-qc-expert"
  | "contract-expert"
  | "tender-expert"
  | "estimation-expert"
  | "project-management-expert"
  | "maintenance-expert"
  | "research-expert"
  | "teaching-expert"
  | "interview-expert";

export type ExpertCapabilityId =
  | "explain-concepts"
  | "engineering-calculations"
  | "code-interpretation"
  | "specification-guidance"
  | "method-statements"
  | "construction-sequence"
  | "material-selection"
  | "troubleshooting"
  | "comparison-tables"
  | "technical-reports"
  | "checklists"
  | "site-advice"
  | "best-practices";

export type ExpertOutputFormatId =
  | "normal-answer"
  | "step-by-step"
  | "executive-summary"
  | "bullet-format"
  | "detailed-report"
  | "table"
  | "checklist";

export type FutureExpertCapabilityId =
  | "drawing-interpretation"
  | "pdf-analysis"
  | "bim-integration"
  | "image-understanding"
  | "voice-assistant"
  | "pmis-integration";

export interface ExpertModeDefinition {
  id: ExpertModeId;
  label: string;
  description: string;
}

export interface ExpertCapabilityDefinition {
  id: ExpertCapabilityId;
  label: string;
  description: string;
}

export interface ExpertOutputFormatDefinition {
  id: ExpertOutputFormatId;
  label: string;
  description: string;
}

export interface FutureExpertCapabilityDefinition {
  id: FutureExpertCapabilityId;
  label: string;
  description: string;
  status: "coming-soon";
}

export interface DisciplineExpertIntelligence {
  expertTitle: string;
  disciplineName: string;
  disciplineId: string | null;
  workspaceLabel: string;
  activeModuleTitle: string;
  engineeringContextSummary: string;
  subscriptionPlan: string;
  activeExpertMode: ExpertModeDefinition;
  availableExpertModes: ExpertModeDefinition[];
  capabilities: ExpertCapabilityDefinition[];
  outputFormat: ExpertOutputFormatDefinition;
  availableOutputFormats: ExpertOutputFormatDefinition[];
  futureCapabilities: FutureExpertCapabilityDefinition[];
}
