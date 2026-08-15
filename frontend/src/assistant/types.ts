export type EngineeringTaskCategory =
  | "engineering"
  | "personal"
  | "technical"
  | "study"
  | "inspection"
  | "documentation"
  | "learning";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "deferred"
  | "cancelled";

export type NoteCategory =
  | "engineering-note"
  | "idea"
  | "observation"
  | "meeting-note"
  | "calculation"
  | "reference";

export type BookmarkType =
  | "standard"
  | "document"
  | "calculator"
  | "report"
  | "template"
  | "learning-resource"
  | "ai-conversation";

export interface EngineeringTask {
  id: string;
  name: string;
  disciplineId: string | null;
  disciplineName: string | null;
  category: EngineeringTaskCategory;
  priority: TaskPriority;
  dueDate: string | null;
  reminderAt: number | null;
  notes: string;
  attachments: string[];
  status: TaskStatus;
  pinned: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
}

export interface EngineeringNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  disciplineId: string | null;
  disciplineName: string | null;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface EngineeringBookmark {
  id: string;
  type: BookmarkType;
  title: string;
  resourceId: string | null;
  url: string | null;
  disciplineId: string | null;
  conversationId: string | null;
  createdAt: number;
}

export interface ReminderSummary {
  today: EngineeringTask[];
  tomorrow: EngineeringTask[];
  thisWeek: EngineeringTask[];
  overdue: EngineeringTask[];
  upcoming: EngineeringTask[];
}

export interface QuickAccessSnapshot {
  recentConversations: string[];
  recentDocuments: string[];
  recentReports: string[];
  recentCalculations: string[];
  recentStandards: string[];
}

export interface AssistantSuggestions {
  nextTask: EngineeringTask | null;
  pendingActions: string[];
  incompleteDocuments: string[];
  missingStandards: string[];
  requiredCalculations: string[];
  upcomingReviews: string[];
}

/** Future-ready hooks for calendar, email, voice, mobile, PMIS migration. */
export interface AssistantExtensionHooks {
  calendarIntegrationEnabled?: boolean;
  emailIntegrationEnabled?: boolean;
  voiceCommandsEnabled?: boolean;
  mobileNotificationsEnabled?: boolean;
  pmisTaskMigrationId?: string | null;
}

export interface AssistantEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  sessionTopic?: string | null;
}

export interface AssistantEngineResult {
  active: boolean;
  taskAction: string | null;
  noteAction: string | null;
  bookmarkAction: string | null;
  reminders: ReminderSummary;
  quickAccess: QuickAccessSnapshot;
  suggestions: AssistantSuggestions;
  promptAugmentation: string;
  summaryText: string;
}

export interface CreateTaskInput {
  name: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  category?: EngineeringTaskCategory;
  priority?: TaskPriority;
  dueDate?: string | null;
  notes?: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  category?: NoteCategory;
  disciplineId?: string | null;
  disciplineName?: string | null;
}

export interface CreateBookmarkInput {
  type: BookmarkType;
  title: string;
  resourceId?: string | null;
  conversationId?: string | null;
  disciplineId?: string | null;
}
