export type {
  AssistantEngineInput,
  AssistantEngineResult,
  AssistantExtensionHooks,
  AssistantSuggestions,
  BookmarkType,
  CreateBookmarkInput,
  CreateNoteInput,
  CreateTaskInput,
  EngineeringBookmark,
  EngineeringNote,
  EngineeringTask,
  EngineeringTaskCategory,
  NoteCategory,
  QuickAccessSnapshot,
  ReminderSummary,
  TaskPriority,
  TaskStatus,
} from "./types";

export {
  archiveTask,
  completeTask,
  createTask,
  deleteTask,
  duplicateTask,
  findTaskByName,
  getPendingTasks,
  getTask,
  listTasks,
  parseTaskCommand,
  pinTask,
  updateTask,
} from "./taskManager";

export {
  createNote,
  deleteNote,
  listNotes,
  parseNoteCommand,
} from "./noteManager";

export {
  createBookmark,
  deleteBookmark,
  listBookmarks,
  parseBookmarkCommand,
} from "./bookmarkManager";

export {
  buildReminderSummary,
  formatRemindersForPrompt,
  isReminderQuery,
} from "./reminderEngine";

export {
  buildQuickAccessSnapshot,
  formatQuickAccessForPrompt,
} from "./quickAccess";

export {
  formatAssistantForPrompt,
  getAssistantExtensionHooks,
  runAssistantEngine,
  setAssistantExtensionHooks,
} from "./assistantEngine";
