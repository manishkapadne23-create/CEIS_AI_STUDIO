import { appendWorkflowNotes } from "./workflowProgress";
import { startWorkflow } from "./workflowEngine";import type { ActiveWorkflowContext, WorkflowStepActivity } from "./types";

export const getNextActionRecommendation = (
  context: ActiveWorkflowContext
): string[] => {
  const actions: string[] = [];
  const current = context.currentActivity;

  if (current) {
    actions.push(`Complete step: ${current.title}`);
    if (current.requiredStandards.length > 0) {
      actions.push(
        `Review standards: ${current.requiredStandards.slice(0, 3).join(", ")}`
      );
    }
    if (current.requiredCalculations.length > 0) {
      actions.push(`Run calculations for: ${current.title}`);
    }
    if (current.aiAssistance.includes("generate-document")) {
      actions.push("Generate required document for this step");
    }
    if (current.aiAssistance.includes("generate-checklist")) {
      actions.push("Generate inspection/quality checklist");
    }
  }

  if (context.nextActivity) {
    actions.push(`Next step: ${context.nextActivity.title}`);
  }

  return actions;
};

export const formatStepGuidance = (
  activity: WorkflowStepActivity,
  stepNumber: number,
  totalSteps: number
): string =>
  [
    `Step ${stepNumber}/${totalSteps}: ${activity.title}`,
    activity.description,
    activity.requiredStandards.length > 0
      ? `Standards: ${activity.requiredStandards.join(", ")}`
      : "",
    activity.requiredDocuments.length > 0
      ? `Documents: ${activity.requiredDocuments.join(", ")}`
      : "",
    activity.requiredCalculations.length > 0
      ? `Calculations: ${activity.requiredCalculations.join(", ")}`
      : "",
    activity.qualityChecks.length > 0
      ? `Quality checks: ${activity.qualityChecks.join("; ")}`
      : "",
    activity.outputs.length > 0
      ? `Outputs: ${activity.outputs.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

export const restartWorkflowById = (
  workflowId: string,
  conversationId: string | null
): ActiveWorkflowContext | null => startWorkflow(workflowId, conversationId);

export const suggestStandardsForStep = (
  context: ActiveWorkflowContext
): string[] => {
  const current = context.currentActivity;
  if (!current) return context.template.requiredStandards;
  return [
    ...new Set([
      ...context.template.requiredStandards,
      ...current.requiredStandards,
    ]),
  ];
};

export const suggestCalculatorsForStep = (
  context: ActiveWorkflowContext
): string[] => {
  const current = context.currentActivity;
  if (!current) return context.template.requiredCalculations;
  return current.requiredCalculations;
};

export const suggestTemplatesForStep = (
  context: ActiveWorkflowContext
): string[] => {
  const current = context.currentActivity;
  const type = context.template.category ?? "report";
  const suggestions = [`${type} template`, "Inspection checklist template"];
  if (current?.outputs.length) {
    suggestions.push(...current.outputs.map((o) => `${o} template`));
  }
  return suggestions;
};

export const suggestReportsForStep = (
  context: ActiveWorkflowContext
): string[] => {
  const current = context.currentActivity;
  if (current?.outputs.length) return current.outputs;
  return context.template.outputs;
};

export const appendProgressNotes = (
  progressId: string,
  note: string
): boolean => appendWorkflowNotes(progressId, note) !== null;
