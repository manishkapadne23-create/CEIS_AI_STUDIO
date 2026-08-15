import { formatClauseRegister, formatAnalysisForPrompt } from "./clauseAnalyzer";
import { formatClaimAssessment } from "./claimsEngine";
import { formatResponsibilityMatrix } from "./obligationMapper";
import { formatRiskRegister } from "./riskAnalyzer";
import type { ContractReport, ContractWorkspace } from "./types";

export const buildContractReport = (workspace: ContractWorkspace): ContractReport => {
  const { analysis, risks, responsibilities, claims } = workspace;

  const executiveBrief = [
    `Contract: ${workspace.title}`,
    `Type: ${analysis.contractTypeName ?? "Not identified"}`,
    `Project: ${analysis.projectName ?? "N/A"}`,
    `Value: ${analysis.contractValue ?? "Not specified"}`,
    `Clauses: ${analysis.clauses.length} | Risks: ${risks.length} | Claims assessed: ${claims.length}`,
    "Disclaimer: Engineering contract intelligence — not legal advice.",
  ].join("\n");

  const contractSummary = formatAnalysisForPrompt(analysis);

  const clauseRegister = formatClauseRegister(analysis.clauses);

  const riskRegister = formatRiskRegister(risks);

  const responsibilityMatrix = formatResponsibilityMatrix(responsibilities);

  const claimsSummary =
    claims.length > 0
      ? claims.map((c) => formatClaimAssessment(c)).join("\n\n---\n\n")
      : "No claims assessed. Use 'Assess delay claim' or 'Claims guidance'.";

  const variationSummary = analysis.clauses.some((c) =>
    c.title.includes("Variation")
  )
    ? "Variation clause identified — follow written instruction protocol and notice requirements"
    : "Variation provisions not identified — review contract for change order mechanism";

  return {
    title: `Contract Report — ${workspace.title}`,
    executiveBrief,
    contractSummary,
    clauseRegister,
    riskRegister,
    responsibilityMatrix,
    claimsSummary,
    variationSummary,
    generatedAt: Date.now(),
  };
};

export const formatContractReportForPrompt = (report: ContractReport): string =>
  [
    report.title,
    "",
    "EXECUTIVE BRIEF:",
    report.executiveBrief,
    "",
    "CONTRACT SUMMARY:",
    report.contractSummary,
    "",
    "CLAUSE REGISTER:",
    report.clauseRegister,
    "",
    report.riskRegister,
    "",
    "RESPONSIBILITY MATRIX:",
    report.responsibilityMatrix,
    "",
    "CLAIMS SUMMARY:",
    report.claimsSummary,
    "",
    "VARIATION:",
    report.variationSummary,
  ].join("\n");
