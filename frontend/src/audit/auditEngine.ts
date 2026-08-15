import {
  formatChecklistForPrompt,
  getDisciplineChecklist,
} from "./checklistManager";
import {
  formatFollowUpForPrompt,
  formatObservationsForPrompt,
  generateObservations,
  getFollowUpSummary,
} from "./observationManager";
import { buildAuditReportPlan, formatAuditReportForPrompt } from "./reportGenerator";
import {
  detectAuditType,
  detectReviewMode,
  formatReviewCriteriaForPrompt,
  isAuditQuery,
} from "./reviewEngine";
import { countBySeverity } from "./observationManager";
import { formatSeveritySummary } from "./severityAnalyzer";
import type {
  AuditEngineInput,
  AuditEngineResult,
  AuditExtensionHooks,
} from "./types";

let extensionHooks: AuditExtensionHooks = {};

export const setAuditExtensionHooks = (hooks: AuditExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getAuditExtensionHooks = (): AuditExtensionHooks => extensionHooks;

/** Run Engineering Audit & Review Engine for a user turn. */
export const runAuditEngine = (input: AuditEngineInput): AuditEngineResult => {
  const inactive: AuditEngineResult = {
    active: false,
    auditType: "general-audit",
    reviewMode: "detailed-review",
    criteria: [],
    observations: [],
    checklist: null,
    followUp: { open: 0, resolved: 0, pendingReview: 0, closed: 0, total: 0 },
    reportPlan: { sections: [], outline: "" },
    promptAugmentation: "",
    summaryText: "",
  };

  if (!isAuditQuery(input.userMessage)) {
    return inactive;
  }

  const auditId = input.conversationId;
  const auditType = detectAuditType(input.userMessage);
  const reviewMode = detectReviewMode(input.userMessage);

  const checklist = getDisciplineChecklist(
    input.disciplineId,
    input.disciplineName,
    auditType
  );

  const criteria = checklist?.items ?? [];
  const observations = generateObservations(
    input.userMessage,
    auditId,
    criteria,
    input.disciplineName
  );

  const followUp = getFollowUpSummary();
  const reportPlan = buildAuditReportPlan(auditType, reviewMode, observations);
  const severityCounts = countBySeverity(observations);

  const extensionNotes: string[] = [];
  if (extensionHooks.independentEngineerReview) {
    extensionNotes.push("Independent Engineer review mode");
  }
  if (extensionHooks.pmcReviewEnabled) extensionNotes.push("PMC review enabled");
  if (extensionHooks.thirdPartyAuditEnabled) {
    extensionNotes.push("Third-party audit enabled");
  }
  if (extensionHooks.ownerAuditEnabled) extensionNotes.push("Owner audit enabled");
  if (extensionHooks.governmentAuditEnabled) {
    extensionNotes.push("Government audit enabled");
  }
  if (extensionHooks.pmisAuditModuleId) {
    extensionNotes.push(`PMIS audit: ${extensionHooks.pmisAuditModuleId}`);
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Audit & Review Engine (EARE)",
    "========================================",
    "Structured technical review assistant — supports professional judgment, does not replace it.",
    "",
    `Audit type: ${auditType.replace(/-/g, " ")}`,
    `Review mode: ${reviewMode.replace(/-/g, " ")}`,
    input.disciplineName ? `Discipline: ${input.disciplineName}` : "",
    input.projectName ? `Project: ${input.projectName}` : "",
    input.selectedStandardCode
      ? `Reference standard: ${input.selectedStandardCode}`
      : "",
    "",
    "REVIEW CRITERIA:",
    formatReviewCriteriaForPrompt(criteria, reviewMode),
    "",
    "DISCIPLINE CHECKLIST:",
    formatChecklistForPrompt(checklist),
    "",
    "OBSERVATIONS (generate with OBS-### numbering):",
    "Each observation must include: Number, Category, Severity (Low/Medium/High/Critical), Description, Recommendation, Responsible Discipline, Status.",
    "",
    formatObservationsForPrompt(observations),
    "",
    `Severity summary: ${formatSeveritySummary(severityCounts)}`,
    "",
    formatFollowUpForPrompt(followUp),
    "",
    formatAuditReportForPrompt(reportPlan),
    "",
    "EARE INSTRUCTIONS:",
    "- Review for completeness, consistency, technical issues, missing/conflicting information",
    "- Check standards references, best practices, constructability, maintainability, safety",
    "- Generate observation register with severity classification",
    "- Provide executive summary, risk summary, compliance status, recommended actions, review conclusion",
    "- Track open, pending, resolved, and closed observations",
    extensionNotes.length > 0
      ? `\nFuture capabilities: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `EARE: ${auditType}`,
    `Mode: ${reviewMode}`,
    `Observations: ${observations.length}`,
    formatSeveritySummary(severityCounts),
    `Follow-up open: ${followUp.open}`,
  ].join(" | ");

  return {
    active: true,
    auditType,
    reviewMode,
    criteria,
    observations,
    checklist,
    followUp,
    reportPlan,
    promptAugmentation,
    summaryText,
  };
};

export const formatAuditForPrompt = (result: AuditEngineResult): string =>
  result.promptAugmentation;
