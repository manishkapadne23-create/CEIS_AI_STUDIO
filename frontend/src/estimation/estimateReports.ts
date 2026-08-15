import { formatBoqForPrompt } from "./boqEngine";
import {
  analyzeCosts,
  formatCostBreakdownForPrompt,
} from "./costAnalyzer";
import { formatQuantitySummary } from "./quantityEngine";
import {
  formatValueEngineeringForPrompt,
  generateValueEngineeringSuggestions,
} from "./valueEngineering";
import type { CostBreakdown, EngineeringEstimate, EstimateReport } from "./types";

export const buildEstimateReport = (
  estimate: EngineeringEstimate,
  breakdown: CostBreakdown
): EstimateReport => {
  const suggestions = generateValueEngineeringSuggestions(estimate);

  return {
    title: `Estimate Report — ${estimate.title}`,
    estimateSummary: [
      `Type: ${estimate.estimationTypeName}`,
      `Discipline: ${estimate.disciplineName ?? "Engineering"}`,
      `Project: ${estimate.projectName ?? "Not specified"}`,
      `Status: ${estimate.status}`,
      `Items: ${estimate.items.length}`,
      `Total Cost: ₹${breakdown.totalCost.toLocaleString()}`,
    ].join("\n"),
    boqSummary: formatBoqForPrompt(estimate),
    quantitySummary: formatQuantitySummary(
      estimate.items.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unit: String(i.unit),
      }))
    ),
    costSummary: formatCostBreakdownForPrompt(breakdown),
    valueEngineeringSummary: formatValueEngineeringForPrompt(suggestions),
    generatedAt: Date.now(),
  };
};

export const formatEstimateReportForPrompt = (report: EstimateReport): string =>
  [
    report.title,
    "",
    "ESTIMATE SUMMARY:",
    report.estimateSummary,
    "",
    "BOQ SUMMARY:",
    report.boqSummary,
    "",
    "QUANTITY SUMMARY:",
    report.quantitySummary,
    "",
    report.costSummary,
    "",
    report.valueEngineeringSummary,
  ].join("\n");

export const buildCostSummaryOnly = (
  estimate: EngineeringEstimate
): string => formatCostBreakdownForPrompt(analyzeCosts(estimate));
