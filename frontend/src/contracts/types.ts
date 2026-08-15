export type ContractDisciplineId =
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

export type ContractTypeId =
  | "epc"
  | "item-rate"
  | "lump-sum"
  | "ppp"
  | "bot"
  | "ham"
  | "pmc"
  | "design-consultancy"
  | "supply"
  | "maintenance"
  | "service";

export type ClaimTypeId =
  | "delay"
  | "variation"
  | "extra-item"
  | "cost-escalation"
  | "time-extension"
  | "compensation-event";

export type ContractRiskCategory =
  | "payment"
  | "performance"
  | "time"
  | "liability"
  | "termination"
  | "insurance"
  | "engineering";

export interface ContractClause {
  id: string;
  number: string;
  title: string;
  category: "general" | "special" | "fidic" | "government" | "technical";
  summary: string;
  riskLevel: "low" | "medium" | "high";
}

export interface ContractAnalysis {
  contractType: ContractTypeId | null;
  contractTypeName: string | null;
  employer: string | null;
  contractor: string | null;
  projectName: string | null;
  contractValue: string | null;
  commencementDate: string | null;
  completionDate: string | null;
  defectLiabilityPeriod: string | null;
  paymentTerms: string[];
  performanceObligations: string[];
  deliverables: string[];
  insuranceRequirements: string[];
  clauses: ContractClause[];
}

export interface ContractRisk {
  category: ContractRiskCategory;
  description: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
}

export interface ResponsibilityItem {
  activity: string;
  employer: boolean;
  contractor: boolean;
  engineer: boolean;
  shared: boolean;
}

export interface ClaimAssessment {
  claimType: ClaimTypeId;
  claimTypeName: string;
  merit: "weak" | "moderate" | "strong";
  supportingDocuments: string[];
  narrativeGuidance: string;
  timeImpact: string | null;
  costImpact: string | null;
}

export interface ContractWorkspace {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
  conversationId: string | null;
  rawInput: string;
  analysis: ContractAnalysis;
  risks: ContractRisk[];
  responsibilities: ResponsibilityItem[];
  missingClauses: string[];
  criticalClauses: string[];
  claims: ClaimAssessment[];
  status: "draft" | "reviewed" | "active";
  createdAt: number;
  updatedAt: number;
}

export interface ContractReport {
  title: string;
  executiveBrief: string;
  contractSummary: string;
  clauseRegister: string;
  riskRegister: string;
  responsibilityMatrix: string;
  claimsSummary: string;
  variationSummary: string;
  generatedAt: number;
}

export interface ContractEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
}

export interface ContractEngineResult {
  active: boolean;
  activeWorkspace: ContractWorkspace | null;
  contractAction: string | null;
  reportAction: string | null;
  claimAction: string | null;
  riskCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface ContractExtensionHooks {
  fidicIntegrationId?: string | null;
  governmentContractId?: string | null;
  pppAgreementId?: string | null;
  arbitrationSupportId?: string | null;
  disputeResolutionId?: string | null;
  pmisContractAdminId?: string | null;
}
