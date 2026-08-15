import { formatEligibilityReport, type EligibilityResult } from "./eligibilityChecker";
import { formatRiskReport } from "./riskAnalyzer";
import { formatAnalysisForPrompt } from "./tenderParser";
import { formatScopeAnalysisForPrompt } from "./tenderAnalyzer";
import type { ClarificationPoint, TenderReport, TenderWorkspace } from "./types";

export const buildTenderReport = (
  workspace: TenderWorkspace,
  eligibility: EligibilityResult
): TenderReport => {
  const { analysis, risks, clarifications } = workspace;

  const executiveSummary = [
    `Tender: ${workspace.title}`,
    `Client: ${analysis.client ?? "To be confirmed"}`,
    `Project: ${analysis.projectName ?? "N/A"}`,
    `Value: ${analysis.projectValue ?? "Not specified"}`,
    `Bid Due: ${analysis.bidDueDate ?? "Confirm deadline"}`,
    `Risks Identified: ${risks.length}`,
    `Eligibility: ${eligibility.eligible ? "Likely eligible" : "Review required"} (${eligibility.score}/100)`,
  ].join("\n");

  const tenderSummary = formatAnalysisForPrompt(analysis);

  const technicalReview = formatScopeAnalysisForPrompt(analysis);

  const eligibilityReport = formatEligibilityReport(eligibility);

  const riskReport = formatRiskReport(risks);

  const clarificationRegister = clarifications.length > 0
    ? clarifications
        .map(
          (c, i) =>
            `${i + 1}. [${c.priority.toUpperCase()}] ${c.topic}: ${c.question}`
        )
        .join("\n")
    : "No clarification points generated — review tender for ambiguities.";

  return {
    title: `Tender Report — ${workspace.title}`,
    executiveSummary,
    tenderSummary,
    technicalReview,
    eligibilityReport,
    riskReport,
    clarificationRegister,
    generatedAt: Date.now(),
  };
};

export const formatTenderReportForPrompt = (report: TenderReport): string =>
  [
    report.title,
    "",
    "EXECUTIVE SUMMARY:",
    report.executiveSummary,
    "",
    "TENDER SUMMARY:",
    report.tenderSummary,
    "",
    "TECHNICAL REVIEW:",
    report.technicalReview,
    "",
    "ELIGIBILITY:",
    report.eligibilityReport,
    "",
    report.riskReport,
    "",
    "CLARIFICATION REGISTER:",
    report.clarificationRegister,
  ].join("\n");

export const buildTenderSummary = (workspace: TenderWorkspace): string =>
  formatAnalysisForPrompt(workspace.analysis);

export const formatClarifications = (
  points: ClarificationPoint[]
): string =>
  points.length > 0
    ? points.map((p) => `- [${p.priority}] ${p.topic}: ${p.question}`).join("\n")
    : "No clarification points.";
