export type TenderDisciplineId =
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

export type TenderRiskCategory =
  | "technical"
  | "commercial"
  | "contract"
  | "engineering"
  | "eligibility";

export type ChecklistType =
  | "bid-submission"
  | "technical-document"
  | "commercial-document"
  | "qualification";

export interface TenderAnalysis {
  client: string | null;
  projectName: string | null;
  projectValue: string | null;
  bidDueDate: string | null;
  completionPeriod: string | null;
  eligibilityCriteria: string[];
  technicalCriteria: string[];
  financialCriteria: string[];
  experienceRequirements: string[];
  importantDates: string[];
  scopeOfWork: string[];
  standardsIdentified: string[];
  drawingReferences: string[];
  boqItems: string[];
}

export interface TenderRisk {
  category: TenderRiskCategory;
  description: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
}

export interface TenderChecklist {
  type: ChecklistType;
  title: string;
  items: string[];
}

export interface ClarificationPoint {
  id: string;
  topic: string;
  question: string;
  priority: "low" | "medium" | "high";
}

export interface TenderWorkspace {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
  conversationId: string | null;
  rawInput: string;
  analysis: TenderAnalysis;
  risks: TenderRisk[];
  missingDocuments: string[];
  criticalClauses: string[];
  checklists: TenderChecklist[];
  clarifications: ClarificationPoint[];
  status: "draft" | "reviewed" | "ready";
  createdAt: number;
  updatedAt: number;
}

export interface TenderReport {
  title: string;
  executiveSummary: string;
  tenderSummary: string;
  technicalReview: string;
  eligibilityReport: string;
  riskReport: string;
  clarificationRegister: string;
  generatedAt: number;
}

export interface TenderEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
}

export interface TenderEngineResult {
  active: boolean;
  activeWorkspace: TenderWorkspace | null;
  tenderAction: string | null;
  reportAction: string | null;
  analysis: TenderAnalysis | null;
  riskCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface TenderExtensionHooks {
  documentAiEnabled?: boolean;
  tenderComparisonId?: string | null;
  corrigendumTrackingId?: string | null;
  addendumTrackingId?: string | null;
  contractIntelligenceId?: string | null;
  pmisProcurementModuleId?: string | null;
}
