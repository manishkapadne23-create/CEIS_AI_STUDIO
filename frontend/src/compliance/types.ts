export type ComplianceArtifactType =
  | "design"
  | "calculation"
  | "specification"
  | "boq"
  | "report"
  | "method-statement"
  | "inspection-format"
  | "qa-qc-document"
  | "technical-note"
  | "dpr"
  | "general";

export type ValidationType =
  | "standards-compliance"
  | "specification-compliance"
  | "engineering-completeness"
  | "missing-information"
  | "engineering-consistency"
  | "document-consistency"
  | "technical-accuracy"
  | "best-practice-review";

export type ComplianceReviewIntent =
  | "review-boq"
  | "review-specification"
  | "review-dpr"
  | "review-method-statement"
  | "review-design-note"
  | "review-technical-report"
  | "review-inspection-report"
  | "review-calculation"
  | "general-compliance-review";

export type RiskCategory =
  | "missing-clause"
  | "conflicting-requirement"
  | "incomplete-information"
  | "engineering-risk"
  | "constructability"
  | "maintainability"
  | "safety";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export interface StandardsFamily {
  id: string;
  label: string;
  patterns: RegExp[];
  disciplines: string[];
}

export interface StandardsValidationResult {
  referencedStandards: string[];
  applicableFamilies: StandardsFamily[];
  missingReferences: string[];
  complianceNotes: string[];
}

export interface ValidationCheck {
  id: string;
  type: ValidationType;
  label: string;
  description: string;
  status: "pass" | "warn" | "fail" | "pending";
  finding?: string;
}

export interface IdentifiedRisk {
  id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  title: string;
  description: string;
  mitigation: string;
}

export interface EngineeringScores {
  completenessScore: number;
  complianceScore: number;
  riskScore: number;
  documentationScore: number;
  reviewConfidence: "high" | "medium" | "low" | "preliminary";
}

export interface ComplianceOutputPlan {
  outputs: Array<
    | "compliance-report"
    | "validation-checklist"
    | "missing-items"
    | "potential-risks"
    | "review-comments"
    | "recommendations"
    | "non-compliance-summary"
  >;
  outline: string;
}

/** Future-ready hooks for tender, contract, PMIS QA/QC, audit, ISO, digital review. */
export interface ComplianceExtensionHooks {
  tenderComplianceEnabled?: boolean;
  contractComplianceEnabled?: boolean;
  pmisQaqcProjectId?: string | null;
  auditEngineEnabled?: boolean;
  isoComplianceEnabled?: boolean;
  digitalReviewWorkflowId?: string | null;
}

export interface ComplianceEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  selectedStandardCode?: string | null;
  projectName?: string | null;
}

export interface ComplianceEngineResult {
  active: boolean;
  artifactType: ComplianceArtifactType;
  reviewIntent: ComplianceReviewIntent;
  validationTypes: ValidationType[];
  standardsValidation: StandardsValidationResult;
  validationChecks: ValidationCheck[];
  identifiedRisks: IdentifiedRisk[];
  scores: EngineeringScores;
  outputPlan: ComplianceOutputPlan;
  promptAugmentation: string;
  summaryText: string;
}
