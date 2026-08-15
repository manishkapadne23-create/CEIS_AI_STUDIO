import {
  completeWorkflowStep,
  getActiveWorkflowProgress,
  getProgressForWorkflow,
  getWorkflowProgress,
  listWorkflowProgress,
  saveWorkflowProgressToWorkspace,
  setActiveWorkflowProgress,
  startWorkflowProgress,
  updateWorkflowProgressStatus,
} from "./workflowProgress";
import {
  detectWorkflowAssistanceIntent,
  detectWorkflowControlIntent,
  buildWorkflowAssistantPrompt,
  formatWorkflowGuidanceSummary,
} from "./workflowAssistant";
import {
  getWorkflowTemplate,
  getWorkflowsForDiscipline,
  resolveWorkflowFromMessage,
  searchWorkflows,
} from "./workflowRegistry";
import type {
  ActiveWorkflowContext,
  WorkflowAssistantResult,
  WorkflowEngineSummary,
  WorkflowExtensionHooks,
  WorkflowTemplate,
} from "./types";

let extensionHooks: WorkflowExtensionHooks = {};

export const setWorkflowExtensionHooks = (
  hooks: WorkflowExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getWorkflowExtensionHooks = (): WorkflowExtensionHooks =>
  extensionHooks;

export const getActiveWorkflowContext = (): ActiveWorkflowContext | null => {
  const progress = getActiveWorkflowProgress();
  if (!progress) return null;

  const template = getWorkflowTemplate(progress.workflowId);
  if (!template) return null;

  const currentActivity =
    template.activities[progress.currentStepIndex] ?? null;
  const nextActivity =
    template.activities[progress.currentStepIndex + 1] ?? null;
  const completionPercent = Math.round(
    (progress.completedStepIds.length / template.activities.length) * 100
  );

  return {
    template,
    progress,
    currentActivity,
    nextActivity,
    completionPercent,
  };
};

export const startWorkflow = (
  workflowId: string,
  conversationId: string | null
): ActiveWorkflowContext | null => {
  const template = getWorkflowTemplate(workflowId);
  if (!template) return null;

  const progress = startWorkflowProgress(template, conversationId);
  setActiveWorkflowProgress(progress.id);
  return getActiveWorkflowContext();
};

export const startWorkflowFromMessage = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null,
  conversationId: string | null
): ActiveWorkflowContext | null => {
  const template = resolveWorkflowFromMessage(
    message,
    disciplineId,
    disciplineName
  );
  if (!template) return null;
  return startWorkflow(template.id, conversationId);
};

export const pauseActiveWorkflow = (): ActiveWorkflowContext | null => {
  const context = getActiveWorkflowContext();
  if (!context) return null;
  updateWorkflowProgressStatus(context.progress.id, "paused");
  return getActiveWorkflowContext();
};

export const resumeActiveWorkflow = (): ActiveWorkflowContext | null => {
  const context = getActiveWorkflowContext();
  if (!context) return null;
  updateWorkflowProgressStatus(context.progress.id, "in-progress");
  return getActiveWorkflowContext();
};

export const markContinueLater = (): ActiveWorkflowContext | null => {
  const context = getActiveWorkflowContext();
  if (!context) return null;
  updateWorkflowProgressStatus(context.progress.id, "continue-later");
  saveWorkflowProgressToWorkspace(context.progress, context.template);
  return getActiveWorkflowContext();
};

export const completeActiveWorkflow = (): ActiveWorkflowContext | null => {
  const context = getActiveWorkflowContext();
  if (!context) return null;
  updateWorkflowProgressStatus(context.progress.id, "completed");
  saveWorkflowProgressToWorkspace(context.progress, context.template);
  return getActiveWorkflowContext();
};

export const advanceWorkflowStep = (
  stepId?: string
): ActiveWorkflowContext | null => {
  const context = getActiveWorkflowContext();
  if (!context) return null;

  const targetStepId =
    stepId ?? context.currentActivity?.id ?? context.template.activities[0]?.id;
  if (!targetStepId) return context;

  completeWorkflowStep(
    context.progress.id,
    targetStepId,
    context.template
  );
  return getActiveWorkflowContext();
};

export const restartActiveWorkflow = (): ActiveWorkflowContext | null => {
  const context = getActiveWorkflowContext();
  if (!context) return null;
  return startWorkflow(context.template.id, context.progress.conversationId);
};

export const handleWorkflowMessage = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null,
  conversationId: string | null,
  sessionTopic?: string | null
): {
  context: ActiveWorkflowContext | null;
  assistantResult: WorkflowAssistantResult | null;
  started: boolean;
} => {
  const startedContext = startWorkflowFromMessage(
    message,
    disciplineId,
    disciplineName,
    conversationId
  );
  if (startedContext) {
    return { context: startedContext, assistantResult: null, started: true };
  }

  const control = detectWorkflowControlIntent(message);
  if (control === "pause") {
    return { context: pauseActiveWorkflow(), assistantResult: null, started: false };
  }
  if (control === "resume") {
    return { context: resumeActiveWorkflow(), assistantResult: null, started: false };
  }
  if (control === "complete") {
    return { context: completeActiveWorkflow(), assistantResult: null, started: false };
  }
  if (control === "save") {
    const ctx = getActiveWorkflowContext();
    if (ctx) saveWorkflowProgressToWorkspace(ctx.progress, ctx.template);
    return { context: ctx, assistantResult: null, started: false };
  }
  if (control === "restart") {
    return { context: restartActiveWorkflow(), assistantResult: null, started: false };
  }

  const advanceMatch = message.match(/^complete\s+step|next\s+step|advance\s+step/i);
  if (advanceMatch) {
    return { context: advanceWorkflowStep(), assistantResult: null, started: false };
  }

  const assistanceType = detectWorkflowAssistanceIntent(message);
  const context = getActiveWorkflowContext();
  if (!assistanceType || !context) {
    return { context, assistantResult: null, started: false };
  }

  const assistantResult = buildWorkflowAssistantPrompt(
    {
      assistanceType,
      workflowId: context.template.id,
      disciplineId: context.template.disciplineId,
      stepId: context.currentActivity?.id,
      sessionTopic: sessionTopic ?? null,
    },
    context.template,
    context.currentActivity
  );

  return { context, assistantResult, started: false };
};

export const buildWorkflowEngineSummary = (
  disciplineId: string | null,
  disciplineName: string | null
): WorkflowEngineSummary => {
  const activeWorkflow = getActiveWorkflowContext();
  const availableWorkflows = getWorkflowsForDiscipline(
    disciplineId,
    disciplineName
  );

  const lines: string[] = [];

  if (activeWorkflow) {
    lines.push(
      formatWorkflowGuidanceSummary(
        activeWorkflow.template,
        activeWorkflow.progress.currentStepIndex,
        activeWorkflow.progress.status
      )
    );
  } else if (availableWorkflows.length > 0) {
    lines.push(
      "========================================",
      "Available Engineering Workflows",
      "========================================",
      `Discipline: ${disciplineName ?? disciplineId ?? "General"}`,
      `Workflows available: ${availableWorkflows.length}`,
      ...availableWorkflows.slice(0, 6).map(
        (workflow) => `  • ${workflow.title} — ${workflow.objective}`
      ),
      "",
      'Say "Start [workflow name] workflow" to begin guided execution.'
    );
  }

  if (extensionHooks.pmisProjectId) {
    lines.push(`PMIS project (future): ${extensionHooks.pmisProjectId}`);
  }

  return {
    activeWorkflow,
    availableWorkflows,
    summaryText: lines.join("\n"),
  };
};

export {
  getWorkflowTemplate,
  getWorkflowsForDiscipline,
  searchWorkflows,
  listWorkflowProgress,
  getProgressForWorkflow,
  getWorkflowProgress,
};

export type { WorkflowTemplate, ActiveWorkflowContext };
