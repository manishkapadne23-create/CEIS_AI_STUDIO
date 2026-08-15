import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type CopilotSuggestionCategory =
  | "standards"
  | "calculators"
  | "professional-tools"
  | "templates"
  | "documents"
  | "learning-resources"
  | "workflows"
  | "reports"
  | "checklists";

export type EngineeringRecommendationType =
  | "next-step"
  | "missing-information"
  | "applicable-code"
  | "engineering-warning"
  | "best-practice"
  | "quality-check"
  | "safety-requirement";

export interface CopilotSuggestion {
  id: string;
  category: CopilotSuggestionCategory;
  title: string;
  description: string;
  moduleId?: WorkspaceCategoryId;
  resourceId?: string;
  priority: number;
}

export interface EngineeringRecommendation {
  type: EngineeringRecommendationType;
  title: string;
  message: string;
  priority: number;
}

export interface RelatedKnowledgeBundle {
  standards: CopilotSuggestion[];
  calculators: CopilotSuggestion[];
  templates: CopilotSuggestion[];
  workflows: CopilotSuggestion[];
  documents: CopilotSuggestion[];
  learningResources: CopilotSuggestion[];
}

export interface ModuleRouteDecision {
  shouldSwitch: boolean;
  moduleId: WorkspaceCategoryId;
  reason: string;
  confidence: number;
  triggerPhrase: string;
}

export interface CopilotContextSnapshot {
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  conversationId: string | null;
  sessionTopic: string | null;
  activeWorkflowTitle: string | null;
  activeWorkflowStep: string | null;
  activeStandardCodes: string[];
  uploadedDocumentCount: number;
  calculationCount: number;
  generatedReportCount: number;
}

export interface CopilotIntelligenceResult {
  snapshot: CopilotContextSnapshot;
  suggestions: CopilotSuggestion[];
  recommendations: EngineeringRecommendation[];
  relatedKnowledge: RelatedKnowledgeBundle;
  moduleRoute: ModuleRouteDecision | null;
  summaryText: string;
  userIntent: string;
}

/** Future-ready extension hooks for voice, drawing, site, document, PMIS copilots. */
export interface CopilotExtensionHooks {
  voiceCopilotEnabled?: boolean;
  drawingCopilotEnabled?: boolean;
  siteCopilotEnabled?: boolean;
  documentCopilotEnabled?: boolean;
  pmisCopilotProjectId?: string | null;
  mobileCopilotSessionId?: string | null;
}

export interface CopilotEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId: WorkspaceCategoryId | null;
  sessionTopic?: string | null;
}
