import {
  buildComparisonTable,
  extractAlternativesFromMessage,
  formatComparisonForPrompt,
  inferComparisonSubject,
  isComparisonQuery,
} from "./comparisonEngine";
import { buildDecisionMatrix, formatDecisionMatrixForPrompt } from "./decisionMatrix";
import { buildDecisionReports } from "./decisionReports";
import { searchDecisionIntelligence } from "./decisionSearch";
import {
  buildEdieRiskFramework,
  formatEdieRiskForPrompt,
  isRiskAnalysisQuery,
} from "./riskEngine";
import {
  buildEngineeringRecommendation,
  buildStructuredDecisionOutput,
  formatRecommendationForPrompt,
  formatStructuredOutputForPrompt,
  isRecommendationQuery,
} from "./recommendationEngine";
import { createDecisionSession } from "./decisionWorkspace";
import { isValueEngineeringQuery, buildValueEngineeringFramework, formatValueEngineeringForPrompt } from "../decision-support/valueEngineering";
import type {
  DecisionIntelligenceCategory,
  DecisionIntelligenceInput,
  DecisionIntelligenceResult,
} from "./types";

const EDIE_TRIGGERS =
  /\b(compare|comparison|versus|vs\.?|decide|decision|recommend|evaluate\s+alternatives|pros\s+and\s+cons|trade[\s-]off|risk\s+analysis|risk\s+assessment|feasibility|constructability|maintainability|decision\s+matrix|mcda|weighted\s+scoring|help\s+me\s+decide|assess\s+options|which\s+is\s+better|choose\s+between)\b/i;

export const isDecisionIntelligenceQuery = (
  message: string,
  followUpIntent?: string | null
): boolean => EDIE_TRIGGERS.test(message) || followUpIntent === "compare";

const resolveCategory = (
  message: string,
  hasComparison: boolean,
  hasRisk: boolean,
  hasMatrix: boolean
): DecisionIntelligenceCategory => {
  if (/decision\s+matrix|weighted\s+scoring|mcda/i.test(message) || hasMatrix) {
    return "decision-matrix";
  }
  if (/feasibility|constructability|maintainability/i.test(message)) {
    return "feasibility-review";
  }
  if (hasComparison) return "comparison";
  if (hasRisk) return "risk-analysis";
  if (isValueEngineeringQuery(message)) return "value-engineering";
  if (isRecommendationQuery(message)) return "engineering-recommendation";
  return "general-decision";
};

export const runDecisionIntelligenceEngine = (
  input: DecisionIntelligenceInput
): DecisionIntelligenceResult => {
  const inactiveStructured = buildStructuredDecisionOutput(
    input.userMessage,
    [],
    input.disciplineId,
    "preliminary"
  );

  const inactive: DecisionIntelligenceResult = {
    active: false,
    category: null,
    userIntent: "none",
    comparisonSubject: null,
    structuredOutput: inactiveStructured,
    decisionMatrix: null,
    comparisonMarkdown: null,
    riskMarkdown: null,
    reports: buildDecisionReports(inactiveStructured, null, null, input.disciplineName),
    searchResults: [],
    promptAugmentation: "",
    summaryText: "",
  };

  if (!isDecisionIntelligenceQuery(input.userMessage, input.followUpIntent)) {
    return inactive;
  }

  const comparison = buildComparisonTable(input.userMessage);
  const alternatives =
    comparison?.alternatives.map((alt) => alt.name) ??
    (extractAlternativesFromMessage(input.userMessage)
      ? [extractAlternativesFromMessage(input.userMessage)![0], extractAlternativesFromMessage(input.userMessage)![1]]
      : ["Alternative A", "Alternative B"]);

  const recommendation = buildEngineeringRecommendation(
    input.userMessage,
    input.disciplineId,
    input.disciplineName,
    alternatives.length >= 2
  );

  const structuredOutput = buildStructuredDecisionOutput(
    input.userMessage,
    alternatives,
    input.disciplineId,
    recommendation.confidenceLevel
  );

  const riskActive =
    isRiskAnalysisQuery(input.userMessage) || isComparisonQuery(input.userMessage);
  const riskFramework = riskActive ? buildEdieRiskFramework() : null;

  const matrixActive =
    /decision\s+matrix|weighted\s+scoring|mcda|score\s+matrix/i.test(input.userMessage) ||
    isComparisonQuery(input.userMessage);

  const decisionMatrix = matrixActive
    ? buildDecisionMatrix(
        input.userMessage,
        alternatives,
        input.disciplineId,
        recommendation.confidenceLevel
      )
    : null;

  const category = resolveCategory(
    input.userMessage,
    comparison !== null,
    riskActive,
    decisionMatrix !== null
  );

  const valueEngineering = isValueEngineeringQuery(input.userMessage)
    ? buildValueEngineeringFramework(input.userMessage)
    : null;

  const reports = buildDecisionReports(
    structuredOutput,
    comparison,
    decisionMatrix,
    input.disciplineName
  );

  const searchResults = searchDecisionIntelligence(
    input.userMessage,
    input.disciplineId,
    8
  );

  createDecisionSession({
    title: comparison?.title ?? input.userMessage.slice(0, 80),
    problemStatement: input.userMessage,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    alternatives,
    category,
  });

  const promptSections = [
    "========================================",
    "Engineering Decision Intelligence Engine (EDIE)",
    "========================================",
    "You are an Engineering Decision Support System — NOT an automatic decision maker.",
    "Support structured, standards-based, transparent engineering decisions.",
    "The qualified engineer retains final decision authority.",
    "",
    "REVIEW DIMENSIONS: Technical feasibility, economic consideration, constructability,",
    "maintainability, safety, environmental impact, risk assessment, life-cycle perspective.",
    "",
    formatStructuredOutputForPrompt(structuredOutput),
    formatComparisonForPrompt(comparison),
    formatDecisionMatrixForPrompt(decisionMatrix),
    formatEdieRiskForPrompt(riskFramework),
    formatValueEngineeringForPrompt(valueEngineering),
    formatRecommendationForPrompt(recommendation),
    "",
    "DECISION REPORTS (generate on request):",
    "- Decision Note",
    "- Technical Justification",
    "- Comparison Report",
    "- Risk Register",
    "- Recommendation Summary",
    "- Executive Decision Brief",
    "",
    searchResults.length > 0
      ? `Related references:\n${searchResults.map((r) => `- [${r.type}] ${r.title}`).join("\n")}`
      : "",
  ].filter(Boolean);

  const promptAugmentation = promptSections.join("\n");

  return {
    active: true,
    category,
    userIntent: inferComparisonSubject(input.userMessage) ?? "general-decision",
    comparisonSubject: inferComparisonSubject(input.userMessage),
    structuredOutput,
    decisionMatrix,
    comparisonMarkdown: comparison?.markdownSkeleton ?? null,
    riskMarkdown: riskFramework?.matrixSkeleton ?? null,
    reports,
    searchResults,
    promptAugmentation,
    summaryText: [
      `EDIE active: ${category}`,
      comparison ? `Comparison: ${comparison.title}` : "",
      decisionMatrix ? `Decision matrix: ${decisionMatrix.title}` : "",
      `Confidence: ${recommendation.confidenceLevel}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
};

export const formatDecisionIntelligenceForPrompt = (
  result: DecisionIntelligenceResult
): string => result.promptAugmentation;

export const getDecisionIntelligenceSummary = (
  result: DecisionIntelligenceResult
): string => result.summaryText;

// Backward-compatible aliases for decision-support consumers
export const runDecisionSupportEngine = runDecisionIntelligenceEngine;
export const isDecisionSupportQuery = isDecisionIntelligenceQuery;
export const formatDecisionSupportForPrompt = formatDecisionIntelligenceForPrompt;
export const getDecisionSupportSummary = getDecisionIntelligenceSummary;
