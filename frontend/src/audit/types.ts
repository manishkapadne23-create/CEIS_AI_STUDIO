export type AuditType =
  | "design-review"
  | "drawing-review"
  | "specification-review"
  | "boq-review"
  | "dpr-review"
  | "estimate-review"
  | "method-statement-review"
  | "qa-qc-audit"
  | "safety-audit"
  | "technical-audit"
  | "maintenance-audit"
  | "general-audit";

export type ReviewMode =
  | "quick-review"
  | "detailed-review"
  | "compliance-review"
  | "risk-review"
  | "peer-review"
  | "independent-review"
  | "final-review";

export type ObservationCategory =
  | "completeness"
  | "consistency"
  | "technical-issue"
  | "missing-information"
  | "conflicting-information"
  | "standards-reference"
  | "best-practice"
  | "constructability"
  | "maintainability"
  | "safety";

export type ObservationSeverity = "low" | "medium" | "high" | "critical";

export type ObservationStatus = "open" | "pending-review" | "resolved" | "closed";

export interface AuditObservation {
  id: string;
  number: number;
  category: ObservationCategory;
  severity: ObservationSeverity;
  description: string;
  recommendation: string;
  responsibleDiscipline: string;
  status: ObservationStatus;
  auditId: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewCriterion {
  id: string;
  label: string;
  category: ObservationCategory;
  description: string;
}

export interface DisciplineChecklist {
  disciplineId: string;
  disciplineName: string;
  auditType: AuditType;
  items: ReviewCriterion[];
}

export interface AuditFollowUpSummary {
  open: number;
  resolved: number;
  pendingReview: number;
  closed: number;
  total: number;
}

export interface AuditReportPlan {
  sections: string[];
  outline: string;
}

/** Future-ready hooks for IE, PMC, third-party, government, PMIS audits. */
export interface AuditExtensionHooks {
  independentEngineerReview?: boolean;
  pmcReviewEnabled?: boolean;
  thirdPartyAuditEnabled?: boolean;
  ownerAuditEnabled?: boolean;
  governmentAuditEnabled?: boolean;
  pmisAuditModuleId?: string | null;
}

export interface AuditEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName?: string | null;
  selectedStandardCode?: string | null;
}

export interface AuditEngineResult {
  active: boolean;
  auditType: AuditType;
  reviewMode: ReviewMode;
  criteria: ReviewCriterion[];
  observations: AuditObservation[];
  checklist: DisciplineChecklist | null;
  followUp: AuditFollowUpSummary;
  reportPlan: AuditReportPlan;
  promptAugmentation: string;
  summaryText: string;
}
