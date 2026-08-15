import type { EngineeringSubscriptionPlan, EngineeringUserLanguage } from "../ai/contextEngine/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type EngineeringIntent =
  | "general-question"
  | "standards"
  | "calculation"
  | "design"
  | "planning"
  | "estimation"
  | "quantity"
  | "qa-qc"
  | "tender"
  | "contracts"
  | "claims"
  | "construction"
  | "maintenance"
  | "learning"
  | "research"
  | "comparison"
  | "workflow"
  | "document"
  | "report-generation"
  | "checklist";

export type OrchestratorEngineId =
  | "standards-engine"
  | "calculator-engine"
  | "professional-tools"
  | "workflow-engine"
  | "action-engine"
  | "document-intelligence"
  | "ai-expert"
  | "decision-support"
  | "agent-engine"
  | "learning-hub";

export type KnowledgeGraphNodeType =
  | "standard"
  | "calculator"
  | "document"
  | "template"
  | "report"
  | "topic"
  | "professional-tool"
  | "learning-resource"
  | "workflow";

export interface KnowledgeGraphNode {
  id: string;
  type: KnowledgeGraphNodeType;
  label: string;
  description?: string;
  moduleId?: WorkspaceCategoryId;
  resourceId?: string;
}

export interface KnowledgeGraphEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface EngineeringKnowledgeGraph {
  topic: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface IntentClassification {
  primaryIntent: EngineeringIntent;
  secondaryIntents: EngineeringIntent[];
  confidence: number;
  triggerPhrase: string | null;
}

export interface ModuleRouteTarget {
  moduleId: WorkspaceCategoryId;
  engineId: OrchestratorEngineId;
  reason: string;
  priority: number;
  confidence: number;
}

export interface OrchestratorRecommendation {
  category:
    | "standards"
    | "calculators"
    | "templates"
    | "reports"
    | "learning-resources"
    | "workflows"
    | "professional-tools";
  title: string;
  description: string;
  moduleId: WorkspaceCategoryId;
  resourceId?: string;
  priority: number;
}

export interface ExecutionStep {
  engineId: OrchestratorEngineId;
  moduleId: WorkspaceCategoryId | null;
  action: string;
  order: number;
}

export interface ExecutionPlan {
  steps: ExecutionStep[];
  isMultiModule: boolean;
  summary: string;
}

export interface OrchestratorContextSnapshot {
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId: WorkspaceCategoryId | null;
  conversationId: string;
  sessionTopic: string | null;
  projectId: string | null;
  projectName: string | null;
  subscriptionPlan: EngineeringSubscriptionPlan;
  language: EngineeringUserLanguage;
  conversationTurnCount: number;
  activeAgentName: string | null;
  selectedStandardCode: string | null;
}

/** Future-ready extension hooks for multi-agent, PMIS, voice, BIM, GIS, digital twin. */
export interface OrchestratorExtensionHooks {
  multiAgentEnabled?: boolean;
  localAiPreferred?: boolean;
  cloudAiPreferred?: boolean;
  pmisProjectId?: string | null;
  voiceSessionId?: string | null;
  drawingIntelligenceEnabled?: boolean;
  bimIntegrationEnabled?: boolean;
  gisIntegrationEnabled?: boolean;
  digitalTwinProjectId?: string | null;
}

export interface OrchestratorEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  activeModuleId: WorkspaceCategoryId | null;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  sessionTopic?: string | null;
  followUpIntent?: string | null;
  subscriptionPlan?: EngineeringSubscriptionPlan;
  language?: EngineeringUserLanguage;
  selectedStandardCode?: string | null;
}

export interface OrchestratorResult {
  context: OrchestratorContextSnapshot;
  classification: IntentClassification;
  moduleRoutes: ModuleRouteTarget[];
  primaryModuleRoute: ModuleRouteTarget | null;
  executionPlan: ExecutionPlan;
  knowledgeGraph: EngineeringKnowledgeGraph;
  recommendations: OrchestratorRecommendation[];
  promptAugmentation: string;
  summaryText: string;
}
