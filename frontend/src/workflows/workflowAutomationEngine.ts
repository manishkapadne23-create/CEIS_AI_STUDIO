import {
  buildWorkflowEngineSummary,
  getActiveWorkflowContext,
  getWorkflowExtensionHooks,
} from "./workflowEngine";
import {
  formatLibrarySummaryForPrompt,
  formatWorkflowStructureForPrompt,
} from "./workflowLibrary";
import {
  buildWorkflowReport,
  formatWorkflowReportForPrompt,
} from "./workflowReports";
import {
  formatStepGuidance,
  getNextActionRecommendation,
  suggestCalculatorsForStep,
  suggestReportsForStep,
  suggestStandardsForStep,
  suggestTemplatesForStep,
} from "./workflowRunner";
import {
  formatSearchResultsForPrompt,
  isWorkflowAutomationQuery,
  searchFromMessage,
} from "./workflowSearch";
import {
  bookmarkWorkflowByTitle,
  shareWorkflowByTitle,
} from "./workflowTracker";
import { formatWorkflowGuidanceSummary } from "./workflowAssistant";
import type {
  WorkflowAutomationEngineInput,
  WorkflowAutomationEngineResult,
} from "./types";

const parseWorkflowCommand = (
  message: string
): { action: string; payload: string } | null => {
  const listMatch = message.match(
    /^(?:list|show|browse)\s+workflows?(?:\s+for\s+(.+))?$/i
  );
  if (listMatch) return { action: "list", payload: listMatch[1]?.trim() ?? "" };

  const searchMatch = message.match(
    /^(?:search|find)\s+workflows?\s*(?:for\s+)?(.+)?$/i
  );
  if (searchMatch) {
    return { action: "search", payload: searchMatch[1]?.trim() ?? "" };
  }

  const reportMatch = message.match(/^workflow\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const bookmarkMatch = message.match(/^bookmark\s+workflow\s*[:\-]?\s*(.+)$/i);
  if (bookmarkMatch) return { action: "bookmark", payload: bookmarkMatch[1].trim() };

  const shareMatch = message.match(/^share\s+workflow\s*[:\-]?\s*(.+)$/i);
  if (shareMatch) return { action: "share", payload: shareMatch[1].trim() };

  return null;
};

/** Run Engineering Workflow Automation Engine (EWAE) for a user turn. */
export const runWorkflowAutomationEngine = (
  input: WorkflowAutomationEngineInput
): WorkflowAutomationEngineResult => {
  let workflowAction: string | null = null;
  let reportAction: string | null = null;
  let searchResultCount = 0;

  const command = parseWorkflowCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "list":
      case "search": {
        const result = searchFromMessage(
          command.payload || input.userMessage,
          input.disciplineId
        );
        searchResultCount = result.totalCount;
        workflowAction = formatSearchResultsForPrompt(result);
        break;
      }
      case "report": {
        const context = getActiveWorkflowContext();
        if (context) {
          const report = buildWorkflowReport(context);
          reportAction = formatWorkflowReportForPrompt(report);
        } else {
          reportAction = "No active workflow. Start a workflow first.";
        }
        break;
      }
      case "bookmark": {
        workflowAction =
          bookmarkWorkflowByTitle(command.payload) ??
          `Workflow not found: ${command.payload}`;
        break;
      }
      case "share": {
        workflowAction =
          shareWorkflowByTitle(command.payload) ??
          `Workflow not found: ${command.payload}`;
        break;
      }
    }
  }

  const activeContext = getActiveWorkflowContext();
  const engineSummary = buildWorkflowEngineSummary(
    input.disciplineId,
    input.disciplineName
  );

  if (activeContext && !workflowAction && !reportAction) {
    const recommendations = getNextActionRecommendation(activeContext);
    const current = activeContext.currentActivity;
    workflowAction = [
      formatWorkflowGuidanceSummary(
        activeContext.template,
        activeContext.progress.currentStepIndex,
        activeContext.progress.status
      ),
      current
        ? formatStepGuidance(
            current,
            activeContext.progress.currentStepIndex + 1,
            activeContext.template.activities.length
          )
        : "",
      "",
      "RECOMMENDED ACTIONS:",
      ...recommendations.map((r) => `- ${r}`),
      "",
      "SUGGESTED STANDARDS:",
      ...suggestStandardsForStep(activeContext).map((s) => `- ${s}`),
      "",
      "SUGGESTED CALCULATORS:",
      ...suggestCalculatorsForStep(activeContext).map((c) => `- ${c}`),
      "",
      "SUGGESTED TEMPLATES:",
      ...suggestTemplatesForStep(activeContext).map((t) => `- ${t}`),
      "",
      "SUGGESTED REPORTS:",
      ...suggestReportsForStep(activeContext).map((r) => `- ${r}`),
    ]
      .filter(Boolean)
      .join("\n");
  } else if (!workflowAction && engineSummary.availableWorkflows.length > 0 && isWorkflowAutomationQuery(input.userMessage)) {
    const result = searchFromMessage(input.userMessage, input.disciplineId);
    searchResultCount = result.totalCount;
    workflowAction = formatSearchResultsForPrompt(result);
  }

  const extensionHooks = getWorkflowExtensionHooks();
  const extensionNotes: string[] = [];
  if (extensionHooks.pmisProjectId) {
    extensionNotes.push(`PMIS: ${extensionHooks.pmisProjectId}`);
  }
  if (extensionHooks.organizationWorkflowId) {
    extensionNotes.push(`Organization: ${extensionHooks.organizationWorkflowId}`);
  }
  if (extensionHooks.governmentApprovalWorkflowId) {
    extensionNotes.push(`Government: ${extensionHooks.governmentApprovalWorkflowId}`);
  }
  if (extensionHooks.clientWorkflowId) {
    extensionNotes.push(`Client: ${extensionHooks.clientWorkflowId}`);
  }
  if (extensionHooks.aiOptimizationEnabled) {
    extensionNotes.push("AI workflow optimization enabled");
  }

  const active =
    isWorkflowAutomationQuery(input.userMessage) ||
    activeContext !== null ||
    workflowAction !== null ||
    reportAction !== null;

  const promptAugmentation = [
    "========================================",
    "Engineering Workflow Automation Engine (EWAE)",
    "========================================",
    "Guide engineers through complete engineering procedures step-by-step.",
    "",
    formatLibrarySummaryForPrompt(),
    "",
    workflowAction ? `WORKFLOW:\n${workflowAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeContext
      ? `\nWORKFLOW STRUCTURE:\n${formatWorkflowStructureForPrompt(activeContext.template)}`
      : engineSummary.summaryText
        ? `\n${engineSummary.summaryText}`
        : "",
    "",
    "SMART WORKFLOW CONTROLS:",
    "Pause workflow | Resume workflow | Restart workflow | Save workflow",
    "Bookmark workflow [name] | Share workflow [name] | Workflow report",
  "",
    "EWAE COMMANDS:",
    "- List workflows | Search workflows [keyword]",
    "- Start [workflow name] workflow | Next step | Complete step",
    "- Generate checklist | Suggest standards | Create report",
    extensionNotes.length > 0
      ? `\nFuture: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    active ? "ewae-active" : "",
    activeContext ? activeContext.template.title : "",
    activeContext ? `${activeContext.completionPercent}%` : "",
    searchResultCount > 0 ? `${searchResultCount} workflows` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active,
    activeWorkflow: activeContext,
    workflowAction,
    reportAction,
    searchResultCount,
    promptAugmentation,
    summaryText,
  };
};

export const formatWorkflowAutomationForPrompt = (
  result: WorkflowAutomationEngineResult
): string => result.promptAugmentation;
