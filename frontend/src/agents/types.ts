import type { EngineeringAIProviderId } from "../ai/providerInterface/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type EngineeringAgentStatus =
  | "active"
  | "beta"
  | "planned"
  | "coming-soon";

export type EngineeringAgentType = "discipline" | "specialist";

export type EngineeringAgentCapabilityId =
  | "engineering-advice"
  | "standards-guidance"
  | "engineering-calculations"
  | "professional-reports"
  | "document-review"
  | "engineering-checklists"
  | "engineering-recommendations"
  | "workflow-assistance"
  | "learning-assistance";

export interface EngineeringAgentCapability {
  id: EngineeringAgentCapabilityId;
  label: string;
  description: string;
}

export interface EngineeringAgentProfile {
  id: string;
  name: string;
  description: string;
  disciplineId: string;
  disciplineName: string;
  type: EngineeringAgentType;
  capabilities: EngineeringAgentCapabilityId[];
  supportedModules: WorkspaceCategoryId[];
  supportedStandards: string[];
  supportedCalculators: string[];
  supportedTools: string[];
  supportedDocuments: string[];
  supportedWorkflows: string[];
  status: EngineeringAgentStatus;
  personalityKey: string;
  compatibleProviders: EngineeringAIProviderId[];
  systemPromptAugmentation?: string;
}

export interface ActiveAgentContext {
  agent: EngineeringAgentProfile;
  selectedAt: number;
  selectionReason: string;
  disciplineId: string | null;
  disciplineName: string | null;
}

export interface AgentSelectionInput {
  disciplineId: string | null;
  disciplineName: string | null;
  specialization?: string | null;
  userMessage?: string;
}

export interface AgentContextPayload {
  activeAgent: EngineeringAgentProfile;
  contextSummary: string;
  capabilitySummary: string;
  supportedResourcesSummary: string;
}

/** Future specialist agents (planned, registerable without architecture change). */
export type FutureSpecialistAgentId =
  | "highway-design-agent"
  | "bridge-design-agent"
  | "traffic-engineering-agent"
  | "structural-design-agent"
  | "geotechnical-agent"
  | "quantity-survey-agent"
  | "planning-agent"
  | "contract-management-agent"
  | "claims-management-agent"
  | "tender-agent"
  | "qa-qc-agent"
  | "safety-agent"
  | "environmental-compliance-agent"
  | "site-engineer-agent"
  | "pmc-agent"
  | "independent-engineer-agent"
  | "arbitration-agent";

export const SUPPORTED_LLM_PROVIDERS: EngineeringAIProviderId[] = [
  "openai",
  "ollama",
  "claude",
  "gemini",
  "azure-openai",
  "local-llm",
  "stub",
];

export const DEFAULT_AGENT_MODULES: WorkspaceCategoryId[] = [
  "ai-expert",
  "standards",
  "calculators",
  "professional-tools",
  "documents",
  "learning-hub",
];
