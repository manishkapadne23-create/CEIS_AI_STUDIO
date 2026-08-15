import type { EngineeringWorkflowStatus } from "../knowledge/types/EngineeringWorkflow";

export type WorkflowProgressStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "paused"
  | "continue-later";

export type WorkflowCategoryId =
  | "planning"
  | "design"
  | "review"
  | "approval"
  | "construction"
  | "inspection"
  | "testing"
  | "commissioning"
  | "maintenance"
  | "procurement"
  | "qa-qc"
  | "safety"
  | "audit"
  | "documentation"
  | "tender"
  | "contract"
  | "claim";

export type WorkflowAIAssistanceType =
  | "next-step"
  | "generate-document"
  | "suggest-standard"
  | "generate-checklist"
  | "prepare-boq"
  | "generate-inspection"
  | "create-report"
  | "review-step";

export interface WorkflowStepActivity {
  id: string;
  order: number;
  title: string;
  description: string;
  requiredDocuments: string[];
  requiredStandards: string[];
  requiredCalculations: string[];
  professionalTools: string[];
  outputs: string[];
  qualityChecks: string[];
  aiAssistance: WorkflowAIAssistanceType[];
}

/** Full workflow view with all engineering deliverable sections. */
export interface WorkflowTemplate {
  id: string;
  disciplineId: string;
  disciplineName: string;
  title: string;
  overview: string;
  objective: string;
  category?: WorkflowCategoryId;
  scope?: string;
  inputs?: string[];
  prerequisites: string[];
  activities: WorkflowStepActivity[];
  requiredDocuments: string[];
  requiredStandards: string[];
  requiredCalculations: string[];
  professionalTools: string[];
  outputs: string[];
  qualityChecks: string[];
  safetyCheckpoints?: string[];
  completionChecklist: string[];
  status: EngineeringWorkflowStatus;
  enabled: boolean;
}

export interface WorkflowProgressRecord {
  id: string;
  workflowId: string;
  workflowTitle: string;
  disciplineId: string;
  disciplineName: string;
  conversationId: string | null;
  status: WorkflowProgressStatus;
  currentStepIndex: number;
  completedStepIds: string[];
  startedAt: number | null;
  updatedAt: number;
  pausedAt: number | null;
  completedAt: number | null;
  notes: string;
}

export interface ActiveWorkflowContext {
  template: WorkflowTemplate;
  progress: WorkflowProgressRecord;
  currentActivity: WorkflowStepActivity | null;
  nextActivity: WorkflowStepActivity | null;
  completionPercent: number;
}

/** Future-ready hooks for PMIS, collaboration, agents, automation. */
export interface WorkflowExtensionHooks {
  pmisProjectId?: string | null;
  collaborationSessionId?: string | null;
  assignedAgentId?: string | null;
  automationRuleIds?: string[];
  organizationWorkflowId?: string | null;
  governmentApprovalWorkflowId?: string | null;
  clientWorkflowId?: string | null;
  aiOptimizationEnabled?: boolean;
}

export interface WorkflowAssistantRequest {
  assistanceType: WorkflowAIAssistanceType;
  workflowId: string;
  disciplineId: string;
  stepId?: string;
  sessionTopic?: string | null;
}

export interface WorkflowAssistantResult {
  assistanceType: WorkflowAIAssistanceType;
  prompt: string;
  workflowTitle: string;
  stepTitle: string | null;
  suggestedActions: string[];
}

export interface WorkflowEngineSummary {
  activeWorkflow: ActiveWorkflowContext | null;
  availableWorkflows: WorkflowTemplate[];
  summaryText: string;
}

export interface WorkflowAutomationEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  sessionTopic?: string | null;
}

export interface WorkflowAutomationEngineResult {
  active: boolean;
  activeWorkflow: ActiveWorkflowContext | null;
  workflowAction: string | null;
  reportAction: string | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}
