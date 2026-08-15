export type EmaceAgentRole = "lead" | "specialist" | "supporting";

export type EmaceExecutionMode = "sequential" | "parallel";

export interface EmaceAgentDefinition {
  id: string;
  name: string;
  role: EmaceAgentRole;
  priority: number;
  capabilities: string[];
  subscriptionTiers: string[];
  systemPrompt: string;
}

export interface EmaceRequestAnalysis {
  disciplineId: string | null;
  disciplineName: string | null;
  specializationId: string | null;
  specializationName: string | null;
  topic: string | null;
  primaryIntent: string;
  requiredAgentIds: string[];
  participatingAgentIds: string[];
  analysisSummary: string;
}

export interface EmaceAgentOutput {
  agentId: string;
  agentName: string;
  role: EmaceAgentRole;
  status: "executed" | "skipped" | "unavailable";
  observations: string[];
  recommendations: string[];
  warnings: string[];
  references: string[];
  confidence: number;
  executionOrder: number;
}

export interface EmaceCollaborationMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  action: "request-information" | "validate-output" | "raise-conflict" | "recommend-alternative";
  message: string;
  resolved: boolean;
}

export interface EmaceConflictOption {
  label: string;
  agentId: string;
  engineeringJustification: string;
  advantages: string[];
  limitations: string[];
}

export interface EmaceConflictResolution {
  id: string;
  scenarioId: string;
  topic: string;
  conflictingAgents: string[];
  optionA: EmaceConflictOption;
  optionB: EmaceConflictOption;
  applicableStandards: string[];
  recommendedOption: "A" | "B" | "user-decision";
}

export interface EmaceComposedResponse {
  executiveSummary: string;
  engineeringAnalysis: string;
  applicableStandards: string[];
  calculations: string[];
  recommendations: string[];
  risks: string[];
  nextSteps: string[];
}

export interface EmaceUserPreferencesSnapshot {
  multiAgentEnabled: boolean;
  manualMode: boolean;
  enabledAgentIds: string[];
  disabledAgentIds: string[];
  subscriptionPlan: string;
}

export interface EmaceCollaborationInput {
  userMessage: string;
  userId?: string | null;
  conversationId?: string | null;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  primaryIntent?: string | null;
  subscriptionPlan?: string | null;
  manualAgentIds?: string[] | null;
  preferences?: EmaceUserPreferencesSnapshot;
}

export interface EmaceCollaborationPackage {
  engine: "Engineering Multi-Agent Collaboration Engine";
  version: string;
  enabled: boolean;
  executionMode: EmaceExecutionMode;
  preferences: EmaceUserPreferencesSnapshot;
  analysis: EmaceRequestAnalysis;
  agentOutputs: EmaceAgentOutput[];
  collaborations: EmaceCollaborationMessage[];
  conflicts: EmaceConflictResolution[];
  composedResponse: EmaceComposedResponse;
  promptAugmentation: string;
  generatedAt: string;
}
