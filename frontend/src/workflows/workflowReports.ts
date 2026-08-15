import type { ActiveWorkflowContext } from "./types";

export interface WorkflowReport {
  title: string;
  workflowTitle: string;
  disciplineName: string;
  status: string;
  completionPercent: number;
  progressSummary: string;
  completedChecklist: string[];
  pendingActions: string[];
  engineeringNotes: string;
  generatedAt: number;
}

export const buildCompletedChecklist = (
  context: ActiveWorkflowContext
): string[] => {
  const { template, progress } = context;
  return template.completionChecklist.map((item) => {
    const stepComplete = progress.completedStepIds.length >= template.activities.length;
    return stepComplete ? `✓ ${item}` : `○ ${item}`;
  });
};

export const buildPendingActions = (
  context: ActiveWorkflowContext
): string[] => {
  const actions: string[] = [];
  const { template, progress, currentActivity } = context;

  if (progress.status === "paused") {
    actions.push("Resume workflow to continue");
  }

  if (currentActivity && !progress.completedStepIds.includes(currentActivity.id)) {
    actions.push(`Complete: ${currentActivity.title}`);
    if (currentActivity.requiredDocuments.length > 0) {
      actions.push(
        `Prepare documents: ${currentActivity.requiredDocuments.join(", ")}`
      );
    }
    if (currentActivity.requiredStandards.length > 0) {
      actions.push(
        `Apply standards: ${currentActivity.requiredStandards.join(", ")}`
      );
    }
  }

  const remainingSteps = template.activities.filter(
    (a) => !progress.completedStepIds.includes(a.id)
  );
  if (remainingSteps.length > 1) {
    actions.push(
      `${remainingSteps.length - 1} additional step(s) remaining`
    );
  }

  return actions;
};

export const buildProgressSummary = (
  context: ActiveWorkflowContext
): string => {
  const { template, progress, completionPercent } = context;
  return [
    `Workflow: ${template.title}`,
    `Status: ${progress.status}`,
    `Progress: ${completionPercent}% (${progress.completedStepIds.length}/${template.activities.length} steps)`,
    `Current step: ${progress.currentStepIndex + 1}`,
    progress.startedAt
      ? `Started: ${new Date(progress.startedAt).toLocaleDateString()}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildWorkflowReport = (
  context: ActiveWorkflowContext
): WorkflowReport => ({
  title: `Workflow Report — ${context.template.title}`,
  workflowTitle: context.template.title,
  disciplineName: context.template.disciplineName,
  status: context.progress.status,
  completionPercent: context.completionPercent,
  progressSummary: buildProgressSummary(context),
  completedChecklist: buildCompletedChecklist(context),
  pendingActions: buildPendingActions(context),
  engineeringNotes: context.progress.notes || "No notes recorded.",
  generatedAt: Date.now(),
});

export const formatWorkflowReportForPrompt = (
  report: WorkflowReport
): string =>
  [
    report.title,
    report.progressSummary,
    "",
    "COMPLETED CHECKLIST:",
    ...report.completedChecklist,
    "",
    "PENDING ACTIONS:",
    ...report.pendingActions.map((a) => `- ${a}`),
    "",
    report.engineeringNotes ? `NOTES:\n${report.engineeringNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
