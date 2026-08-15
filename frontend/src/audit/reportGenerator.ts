import { countBySeverity, formatObservationsForPrompt } from "./observationManager";
import { formatSeveritySummary } from "./severityAnalyzer";
import type {
  AuditObservation,
  AuditReportPlan,
  AuditType,
  ReviewMode,
} from "./types";

export const buildAuditReportPlan = (
  auditType: AuditType,
  reviewMode: ReviewMode,
  observations: AuditObservation[]
): AuditReportPlan => {
  const severityCounts = countBySeverity(observations);

  const sections = [
    "Executive Summary",
    "Observation Register",
    "Risk Summary",
    "Compliance Status",
    "Recommended Actions",
    "Review Conclusion",
  ];

  const outline = [
    "# Engineering Audit & Review Report",
    "",
    "## 1. Executive Summary",
    `Audit type: ${auditType.replace(/-/g, " ")} | Mode: ${reviewMode.replace(/-/g, " ")}`,
    `Total observations: ${observations.length}`,
    formatSeveritySummary(severityCounts),
    "",
    "## 2. Observation Register",
    "Structured register with observation number, category, severity, description, recommendation, responsible discipline, and status.",
    "",
    formatObservationsForPrompt(observations),
    "",
    "## 3. Risk Summary",
    "Consolidated risk view from high and critical observations.",
    severityCounts.critical + severityCounts.high > 0
      ? `⚠ ${severityCounts.critical + severityCounts.high} high/critical observation(s) require immediate attention.`
      : "No critical observations at this stage.",
    "",
    "## 4. Compliance Status",
    "Overall compliance assessment against applicable standards and project requirements.",
    "",
    "## 5. Recommended Actions",
    "Prioritized action list with responsible discipline and target closure.",
    "",
    "## 6. Review Conclusion",
    "Professional conclusion on acceptability, conditional acceptance, or rejection.",
    "State: Supports professional judgment — does not replace independent engineering review.",
  ].join("\n");

  return { sections, outline };
};

export const formatAuditReportForPrompt = (plan: AuditReportPlan): string => {
  return [
    "AUDIT REPORT SECTIONS:",
    plan.sections.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    "",
    plan.outline,
  ].join("\n");
};
