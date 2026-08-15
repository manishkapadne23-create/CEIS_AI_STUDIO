export type {
  ComparisonAlternative,
  ComparisonCriterion,
  ComparisonTable,
  DecisionAnalysisFramework,
  DecisionConfidenceLevel,
  DecisionOutputPlan,
  DecisionOutputType,
  DecisionSupportCategory,
  DecisionSupportEngineInput,
  DecisionSupportExtensionHooks,
  DecisionSupportResult,
  EngineeringDecisionRecommendation,
  RiskAnalysisFramework,
  RiskCategory,
  RiskLikelihood,
  RiskMatrixEntry,
  RiskSeverity,
  ValueEngineeringFramework,
} from "./types";

export {
  buildComparisonTable,
  extractAlternativesFromMessage,
  isComparisonQuery,
  KNOWN_COMPARISON_TEMPLATES,
  matchKnownComparison,
} from "./comparisonEngine";

export {
  buildRiskAnalysisFramework,
  formatRiskForPrompt,
  isRiskAnalysisQuery,
  RISK_CATEGORIES,
} from "./riskAnalyzer";

export {
  buildEngineeringRecommendation,
  formatRecommendationForPrompt,
  isRecommendationQuery,
} from "./recommendationEngine";

export {
  buildDecisionAnalysisFramework,
  formatDecisionFrameworkForPrompt,
  formatDecisionOutputsForPrompt,
  planDecisionOutputs,
} from "./reportGenerator";

export {
  buildValueEngineeringFramework,
  formatValueEngineeringForPrompt,
  isValueEngineeringQuery,
} from "./valueEngineering";

export {
  formatDecisionSupportForPrompt,
  getDecisionSupportSummary,
  getDecisionSupportExtensionHooks,
  setDecisionSupportExtensionHooks,
} from "./decisionEngine";

export {
  runDecisionSupportEngine,
  isDecisionSupportQuery,
} from "../decision-intelligence/decisionEngine";
