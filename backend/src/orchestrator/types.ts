export type EoeIntentId =
  | "question"
  | "design"
  | "calculation"
  | "code-search"
  | "document-search"
  | "learning"
  | "estimation"
  | "tender"
  | "contract"
  | "troubleshooting"
  | "research"
  | "decision-support";

export type EoeModuleId =
  | "ai-expert"
  | "knowledge-base"
  | "standards-engine"
  | "calculator-engine"
  | "workflow-engine"
  | "document-engine"
  | "learning-hub"
  | "professional-tools"
  | "engineering-memory"
  | "decision-intelligence"
  | "simulation-engine";

export type EoeModuleRole = "primary" | "supporting" | "fallback";

export interface EoeIntentDetection {
  primaryIntent: EoeIntentId;
  secondaryIntents: EoeIntentId[];
  intentLabel: string;
  confidence: number;
  triggerPhrase: string | null;
}

export interface EoeContextDetection {
  disciplineId: string | null;
  disciplineName: string | null;
  specializationId: string | null;
  specializationName: string | null;
  topic: string | null;
  workspaceModuleId: string | null;
  projectId: string | null;
  projectName: string | null;
  conversationId: string | null;
  conversationTurnCount: number;
  memorySummary: string | null;
  subscriptionPlan: string;
  language: string;
}

export interface EoeModuleRoute {
  moduleId: EoeModuleId;
  role: EoeModuleRole;
  priority: number;
  reason: string;
  confidence: number;
  available: boolean;
  usedFallback: boolean;
  resolvedModuleId: EoeModuleId;
}

export interface EoeTaskStep {
  order: number;
  moduleId: EoeModuleId;
  action: string;
}

export interface EoeTaskPlan {
  templateId: string | null;
  templateLabel: string | null;
  steps: EoeTaskStep[];
  isComplex: boolean;
  summary: string;
}

export interface EoeModuleContribution {
  moduleId: EoeModuleId;
  status: "ok" | "degraded" | "unavailable";
  summary: string;
  references: string[];
  metadata?: Record<string, unknown>;
}

export interface EoeComposedResponse {
  title: string;
  orchestrationSummary: string;
  sections: Array<{
    type:
      | "ai-guidance"
      | "standards"
      | "calculations"
      | "templates"
      | "reports"
      | "learning"
      | "references"
      | "workflow";
    title: string;
    content: string;
    moduleId: EoeModuleId;
  }>;
  knowledgeReferences: string[];
  recommendedModules: EoeModuleId[];
}

export interface EoeOrchestratorInput {
  userMessage: string;
  conversationId?: string | null;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  moduleId?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  projectContext?: string | null;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  memorySummary?: string | null;
  subscriptionPlan?: string;
  language?: string;
}

export interface EoeOrchestratorResult {
  engine: "Engineering Orchestrator Engine";
  version: string;
  intent: EoeIntentDetection;
  context: EoeContextDetection;
  routes: EoeModuleRoute[];
  primaryRoute: EoeModuleRoute | null;
  supportingRoutes: EoeModuleRoute[];
  fallbackRoutes: EoeModuleRoute[];
  taskPlan: EoeTaskPlan;
  moduleContributions: EoeModuleContribution[];
  composedResponse: EoeComposedResponse;
  promptAugmentation: string;
  summaryText: string;
}
