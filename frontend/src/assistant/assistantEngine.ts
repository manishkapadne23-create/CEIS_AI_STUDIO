import { parseBookmarkCommand } from "./bookmarkManager";
import { parseNoteCommand, createNote, listNotes } from "./noteManager";
import { buildReminderSummary, formatRemindersForPrompt, isReminderQuery } from "./reminderEngine";
import { buildQuickAccessSnapshot, formatQuickAccessForPrompt } from "./quickAccess";
import {
  completeTask,
  createTask,
  deleteTask,
  findTaskByName,
  getPendingTasks,
  listTasks,
  parseTaskCommand,
  pinTask,
} from "./taskManager";
import type {
  AssistantEngineInput,
  AssistantEngineResult,
  AssistantExtensionHooks,
  AssistantSuggestions,
} from "./types";

let extensionHooks: AssistantExtensionHooks = {};

export const setAssistantExtensionHooks = (
  hooks: AssistantExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getAssistantExtensionHooks = (): AssistantExtensionHooks =>
  extensionHooks;

const ASSISTANT_TRIGGERS =
  /\b(task|note|bookmark|reminder|today'?s?\s+tasks?|overdue|my\s+tasks?|pending\s+actions?|next\s+task|quick\s+access)\b/i;

const buildSuggestions = (
  input: AssistantEngineInput
): AssistantSuggestions => {
  const pending = getPendingTasks();
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const nextTask =
    pending.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0] ??
    null;

  const pendingActions: string[] = [];
  if (pending.length > 0) {
    pendingActions.push(`${pending.length} pending engineering task(s)`);
  }
  if (/\bcalculate|computation\b/i.test(input.userMessage)) {
    pendingActions.push("Complete engineering calculation");
  }
  if (/\breview|audit\b/i.test(input.userMessage)) {
    pendingActions.push("Complete engineering review");
  }

  return {
    nextTask,
    pendingActions,
    incompleteDocuments: [],
    missingStandards: /\bstandard|irc|is\s+\d/i.test(input.userMessage)
      ? []
      : ["Verify applicable standards for current task"],
    requiredCalculations: /\bcalculate|design\b/i.test(input.userMessage)
      ? ["Complete related engineering calculation"]
      : [],
    upcomingReviews: /\breview|inspect/i.test(input.userMessage)
      ? ["Schedule engineering review"]
      : [],
  };
};

/** Run Engineering Digital Assistant for a user turn. */
export const runAssistantEngine = (
  input: AssistantEngineInput
): AssistantEngineResult => {
  let taskAction: string | null = null;
  let noteAction: string | null = null;
  let bookmarkAction: string | null = null;

  const taskCommand = parseTaskCommand(input.userMessage);
  if (taskCommand) {
    switch (taskCommand.action) {
      case "create": {
        const task = createTask({
          name: taskCommand.payload,
          disciplineId: input.disciplineId,
          disciplineName: input.disciplineName,
        });
        taskAction = `Created task: ${task.name} [${task.priority}]`;
        break;
      }
      case "complete": {
        const task = findTaskByName(taskCommand.payload);
        if (task) {
          completeTask(task.id);
          taskAction = `Completed task: ${task.name}`;
        } else {
          taskAction = `Task not found: ${taskCommand.payload}`;
        }
        break;
      }
      case "delete": {
        const task = findTaskByName(taskCommand.payload);
        if (task) {
          deleteTask(task.id);
          taskAction = `Deleted task: ${task.name}`;
        }
        break;
      }
      case "pin": {
        const task = findTaskByName(taskCommand.payload);
        if (task) {
          pinTask(task.id);
          taskAction = `Pinned task: ${task.name}`;
        }
        break;
      }
      case "list": {
        const tasks = listTasks().slice(0, 10);
        taskAction =
          tasks.length > 0
            ? `Tasks (${tasks.length}):\n${tasks.map((t) => `- [${t.status}] ${t.name}`).join("\n")}`
            : "No tasks yet. Say 'Create task [name]' to add one.";
        break;
      }
    }
  }

  const noteCommand = parseNoteCommand(input.userMessage);
  if (noteCommand) {
    if (noteCommand.action === "create") {
      const parts = noteCommand.payload.split(/[:\-]/);
      const title = parts[0]?.trim() ?? "Note";
      const content = parts.slice(1).join(" ").trim() || noteCommand.payload;
      const note = createNote({
        title,
        content,
        disciplineId: input.disciplineId,
        disciplineName: input.disciplineName,
      });
      noteAction = `Created note: ${note.title}`;
    } else if (noteCommand.action === "list") {
      const notes = listNotes().slice(0, 8);
      noteAction =
        notes.length > 0
          ? notes.map((n) => `- ${n.title}: ${n.content.slice(0, 60)}`).join("\n")
          : "No notes yet.";
    }
  }

  const bookmarkCommand = parseBookmarkCommand(
    input.userMessage,
    input.conversationId
  );
  if (bookmarkCommand?.bookmark) {
    bookmarkAction = `Bookmarked: ${bookmarkCommand.bookmark.title} (${bookmarkCommand.bookmark.type})`;
  }

  const reminders = buildReminderSummary();
  const quickAccess = buildQuickAccessSnapshot(input.conversationId);
  const suggestions = buildSuggestions(input);

  const active =
    ASSISTANT_TRIGGERS.test(input.userMessage) ||
    taskAction !== null ||
    noteAction !== null ||
    bookmarkAction !== null ||
    isReminderQuery(input.userMessage) ||
    getPendingTasks().length > 0;

  const extensionNotes: string[] = [];
  if (extensionHooks.calendarIntegrationEnabled) {
    extensionNotes.push("Calendar integration enabled");
  }
  if (extensionHooks.voiceCommandsEnabled) {
    extensionNotes.push("Voice commands enabled");
  }
  if (extensionHooks.mobileNotificationsEnabled) {
    extensionNotes.push("Mobile notifications enabled");
  }
  if (extensionHooks.pmisTaskMigrationId) {
    extensionNotes.push(`PMIS migration: ${extensionHooks.pmisTaskMigrationId}`);
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Digital Assistant (EDA)",
    "========================================",
    "Personal engineering secretary — organize daily technical work (not enterprise PM).",
    "",
    taskAction ? `TASK ACTION: ${taskAction}` : "",
    noteAction ? `NOTE ACTION: ${noteAction}` : "",
    bookmarkAction ? `BOOKMARK: ${bookmarkAction}` : "",
    "",
    "REMINDERS:",
    formatRemindersForPrompt(reminders),
    "",
    "QUICK ACCESS:",
    formatQuickAccessForPrompt(quickAccess),
    "",
    "SMART SUGGESTIONS:",
    suggestions.nextTask
      ? `Next task: ${suggestions.nextTask.name} [${suggestions.nextTask.priority}]`
      : "Next task: none pending",
    suggestions.pendingActions.length > 0
      ? `Pending: ${suggestions.pendingActions.join("; ")}`
      : "",
    suggestions.missingStandards.length > 0
      ? `Standards: ${suggestions.missingStandards.join("; ")}`
      : "",
    suggestions.requiredCalculations.length > 0
      ? `Calculations: ${suggestions.requiredCalculations.join("; ")}`
      : "",
    suggestions.upcomingReviews.length > 0
      ? `Reviews: ${suggestions.upcomingReviews.join("; ")}`
      : "",
    "",
    "EDA COMMANDS:",
    "- Create task [name] | Complete task [name] | List tasks | Pin task [name]",
    "- Create note [title: content] | List notes",
    "- Bookmark [item]",
  extensionNotes.length > 0
      ? `\nFuture: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `Tasks pending: ${getPendingTasks().length}`,
    `Overdue: ${reminders.overdue.length}`,
    `Today: ${reminders.today.length}`,
    taskAction ? "task-action" : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active,
    taskAction,
    noteAction,
    bookmarkAction,
    reminders,
    quickAccess,
    suggestions,
    promptAugmentation,
    summaryText,
  };
};

export const formatAssistantForPrompt = (
  result: AssistantEngineResult
): string => result.promptAugmentation;
