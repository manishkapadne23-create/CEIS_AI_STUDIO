export type DecisionSupportCategory =
  | "comparison"
  | "risk-analysis"
  | "value-engineering"
  | "engineering-recommendation"
  | "general-decision";

export type DecisionConfidenceLevel =
  | "high"
  | "medium"
  | "low"
  | "preliminary";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type RiskLikelihood = "rare" | "unlikely" | "possible" | "likely" | "almost-certain";

export interface DecisionAnalysisFramework {
  problemStatement: string;
  availableAlternatives: string[];
  evaluationCriteria: string[];
  requiredSections: string[];
}

export interface ComparisonCriterion {
  id: string;
  label: string;
  description: string;
}

export interface ComparisonAlternative {
  id: string;
  name: string;
  description?: string;
}

export interface ComparisonTable {
  title: string;
  alternatives: ComparisonAlternative[];
  criteria: ComparisonCriterion[];
  markdownSkeleton: string;
  knownTemplateId?: string;
}

export interface RiskCategory {
  id: string;
  label: string;
  examples: string[];
}

export interface RiskMatrixEntry {
  category: string;
  risk: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  mitigation: string;
}

export interface RiskAnalysisFramework {
  categories: RiskCategory[];
  matrixSkeleton: string;
  mitigationPrompt: string;
}

export interface ValueEngineeringFramework {
  focusAreas: string[];
  analysisPrompts: string[];
  lccaRequired: boolean;
}

export interface EngineeringDecisionRecommendation {
  recommendedOption: string | null;
  confidenceLevel: DecisionConfidenceLevel;
  assumptions: string[];
  engineeringLimitations: string[];
  applicableStandards: string[];
  bestPractices: string[];
  engineeringRemarks: string;
}

export type DecisionOutputType =
  | "decision-report"
  | "executive-summary"
  | "risk-matrix"
  | "comparison-table"
  | "recommendation-note"
  | "presentation-summary";

export interface DecisionOutputPlan {
  outputs: DecisionOutputType[];
  outline: string;
}

/** Future-ready extension hooks for MCDA, AI optimization, PMIS, scenario analysis. */
export interface DecisionSupportExtensionHooks {
  mcdaEnabled?: boolean;
  aiOptimizationEnabled?: boolean;
  scenarioAnalysisEnabled?: boolean;
  pmisDecisionEngineProjectId?: string | null;
}

export interface DecisionSupportEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  sessionTopic?: string | null;
  followUpIntent?: string | null;
}

export interface DecisionSupportResult {
  active: boolean;
  category: DecisionSupportCategory | null;
  userIntent: string;
  comparison: ComparisonTable | null;
  decisionFramework: DecisionAnalysisFramework | null;
  riskFramework: RiskAnalysisFramework | null;
  valueEngineering: ValueEngineeringFramework | null;
  recommendation: EngineeringDecisionRecommendation | null;
  outputPlan: DecisionOutputPlan | null;
  promptAugmentation: string;
  summaryText: string;
}
