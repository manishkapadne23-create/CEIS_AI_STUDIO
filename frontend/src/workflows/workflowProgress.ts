import { saveToWorkspace } from "../actions/workspaceSaver";
import type {
  WorkflowProgressRecord,
  WorkflowProgressStatus,
  WorkflowTemplate,
} from "./types";

const STORAGE_KEY = "sarathi.workflow.progress";

const progressStore = new Map<string, WorkflowProgressRecord>();
let activeProgressId: string | null = null;

const readPersisted = (): WorkflowProgressRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkflowProgressRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writePersisted = (): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(progressStore.values()))
    );
  } catch {
    // Ignore storage failures.
  }
};

const hydrate = (): void => {
  if (progressStore.size > 0) return;
  for (const record of readPersisted()) {
    progressStore.set(record.id, record);
  }
};

const createProgressRecord = (
  template: WorkflowTemplate,
  conversationId: string | null
): WorkflowProgressRecord => ({
  id: crypto.randomUUID(),
  workflowId: template.id,
  workflowTitle: template.title,
  disciplineId: template.disciplineId,
  disciplineName: template.disciplineName,
  conversationId,
  status: "not-started",
  currentStepIndex: 0,
  completedStepIds: [],
  startedAt: null,
  updatedAt: Date.now(),
  pausedAt: null,
  completedAt: null,
  notes: "",
});

export const getWorkflowProgress = (
  progressId: string
): WorkflowProgressRecord | null => {
  hydrate();
  return progressStore.get(progressId) ?? null;
};

export const getActiveWorkflowProgress = (): WorkflowProgressRecord | null => {
  hydrate();
  if (!activeProgressId) return null;
  return progressStore.get(activeProgressId) ?? null;
};

export const getProgressForWorkflow = (
  workflowId: string,
  conversationId?: string | null
): WorkflowProgressRecord | null => {
  hydrate();
  const records = Array.from(progressStore.values()).filter(
    (record) =>
      record.workflowId === workflowId &&
      (conversationId ? record.conversationId === conversationId : true)
  );
  return records.sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;
};

export const listWorkflowProgress = (
  disciplineId?: string | null
): WorkflowProgressRecord[] => {
  hydrate();
  const records = Array.from(progressStore.values());
  return disciplineId
    ? records.filter((record) => record.disciplineId === disciplineId)
    : records;
};

export const startWorkflowProgress = (
  template: WorkflowTemplate,
  conversationId: string | null
): WorkflowProgressRecord => {
  hydrate();

  const existing = getProgressForWorkflow(template.id, conversationId);
  if (existing && existing.status !== "completed") {
    activeProgressId = existing.id;
    const resumed: WorkflowProgressRecord = {
      ...existing,
      status: "in-progress",
      startedAt: existing.startedAt ?? Date.now(),
      updatedAt: Date.now(),
      pausedAt: null,
    };
    progressStore.set(existing.id, resumed);
    writePersisted();
    return resumed;
  }

  const record = createProgressRecord(template, conversationId);
  record.status = "in-progress";
  record.startedAt = Date.now();
  progressStore.set(record.id, record);
  activeProgressId = record.id;
  writePersisted();
  return record;
};

export const updateWorkflowProgressStatus = (
  progressId: string,
  status: WorkflowProgressStatus
): WorkflowProgressRecord | null => {
  hydrate();
  const record = progressStore.get(progressId);
  if (!record) return null;

  const updated: WorkflowProgressRecord = {
    ...record,
    status,
    updatedAt: Date.now(),
    pausedAt:
      status === "paused" || status === "continue-later"
        ? Date.now()
        : record.pausedAt,
    completedAt: status === "completed" ? Date.now() : record.completedAt,
  };
  progressStore.set(progressId, updated);
  writePersisted();
  return updated;
};

export const completeWorkflowStep = (
  progressId: string,
  stepId: string,
  template: WorkflowTemplate
): WorkflowProgressRecord | null => {
  hydrate();
  const record = progressStore.get(progressId);
  if (!record) return null;

  const completedStepIds = record.completedStepIds.includes(stepId)
    ? record.completedStepIds
    : [...record.completedStepIds, stepId];

  const nextIndex = Math.min(
    record.currentStepIndex + 1,
    template.activities.length - 1
  );

  const allComplete = completedStepIds.length >= template.activities.length;

  const updated: WorkflowProgressRecord = {
    ...record,
    completedStepIds,
    currentStepIndex: allComplete ? record.currentStepIndex : nextIndex,
    status: allComplete ? "completed" : "in-progress",
    completedAt: allComplete ? Date.now() : null,
    updatedAt: Date.now(),
  };

  progressStore.set(progressId, updated);
  writePersisted();
  return updated;
};

export const setActiveWorkflowProgress = (
  progressId: string | null
): void => {
  activeProgressId = progressId;
};

export const appendWorkflowNotes = (
  progressId: string,
  note: string
): WorkflowProgressRecord | null => {
  hydrate();
  const record = progressStore.get(progressId);
  if (!record) return null;
  const updated: WorkflowProgressRecord = {
    ...record,
    notes: [record.notes, note].filter(Boolean).join("\n"),
    updatedAt: Date.now(),
  };
  progressStore.set(progressId, updated);
  writePersisted();
  return updated;
};

export const saveWorkflowProgressToWorkspace = (
  record: WorkflowProgressRecord,
  template: WorkflowTemplate
): void => {
  const category =
    record.status === "completed" ? "reports" : "templates";

  saveToWorkspace({
    title: `${template.title} — ${record.status}`,
    content: [
      `# Workflow Progress: ${template.title}`,
      `Status: ${record.status}`,
      `Progress: ${record.completedStepIds.length}/${template.activities.length} steps`,
      `Current step: ${record.currentStepIndex + 1}`,
      "",
      "## Completion Checklist",
      ...template.completionChecklist.map((item) => `- [ ] ${item}`),
      "",
      record.notes ? `## Notes\n${record.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    category,
    disciplineId: record.disciplineId,
    disciplineName: record.disciplineName,
    conversationId: record.conversationId ?? undefined,
  });
};

export const resetWorkflowProgressStore = (): void => {
  progressStore.clear();
  activeProgressId = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
};
