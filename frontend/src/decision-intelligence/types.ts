import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type DecisionIntelligenceCategory =
  | "comparison"
  | "risk-analysis"
  | "value-engineering"
  | "engineering-recommendation"
  | "general-decision"
  | "decision-matrix"
  | "feasibility-review";

export type DecisionConfidenceLevel =
  | "high"
  | "medium"
  | "low"
  | "preliminary";

export type ComparisonSubject =
  | "materials"
  | "technologies"
  | "construction-methods"
  | "equipment"
  | "software"
  | "standards"
  | "design-alternatives";

export interface DecisionCriterion {
  id: string;
  label: string;
  description: string;
  weight: number;
  category:
    | "technical"
    | "economic"
    | "constructability"
    | "maintainability"
    | "safety"
    | "environmental"
    | "risk"
    | "lifecycle";
}

export interface DecisionMatrixAlternative {
  id: string;
  name: string;
  description?: string;
  scores: Record<string, number>;
  weightedScore: number;
}

export interface DecisionMatrix {
  title: string;
  problemStatement: string;
  criteria: DecisionCriterion[];
  alternatives: DecisionMatrixAlternative[];
  weightTotal: number;
  recommendedAlternativeId: string | null;
  confidenceLevel: DecisionConfidenceLevel;
  markdownTable: string;
}

export interface StructuredDecisionOutput {
  problemStatement: string;
  availableAlternatives: string[];
  advantages: Record<string, string[]>;
  limitations: Record<string, string[]>;
  applicableStandards: string[];
  engineeringAssumptions: string[];
  risks: string[];
  recommendedOption: string | null;
  confidenceLevel: DecisionConfidenceLevel;
}

export interface DecisionWorkspaceSession {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  problemStatement: string;
  alternatives: string[];
  category: DecisionIntelligenceCategory | null;
  createdAt: number;
  updatedAt: number;
}

export interface DecisionSearchResult {
  id: string;
  type: "alternative" | "standard" | "material" | "technology" | "criterion";
  title: string;
  subtitle?: string;
  disciplineId?: string | null;
}

export interface DecisionIntelligenceInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  sessionTopic?: string | null;
  followUpIntent?: string | null;
}

export interface DecisionIntelligenceResult {
  active: boolean;
  category: DecisionIntelligenceCategory | null;
  userIntent: string;
  comparisonSubject: ComparisonSubject | null;
  structuredOutput: StructuredDecisionOutput;
  decisionMatrix: DecisionMatrix | null;
  comparisonMarkdown: string | null;
  riskMarkdown: string | null;
  reports: {
    decisionNote: string;
    technicalJustification: string;
    comparisonReport: string;
    riskRegister: string;
    recommendationSummary: string;
    executiveBrief: string;
  };
  searchResults: DecisionSearchResult[];
  promptAugmentation: string;
  summaryText: string;
}

/** Future-ready: MCDA, AHP, weighted scoring, digital twin, PMIS executive support */
export interface DecisionIntelligenceCapabilities {
  mcda: boolean;
  ahp: boolean;
  weightedScoring: boolean;
  digitalTwin: boolean;
  pmisExecutive: boolean;
}

export const DECISION_INTELLIGENCE_CAPABILITIES: DecisionIntelligenceCapabilities = {
  mcda: true,
  ahp: false,
  weightedScoring: true,
  digitalTwin: false,
  pmisExecutive: false,
};

export type { WorkspaceCategoryId };
