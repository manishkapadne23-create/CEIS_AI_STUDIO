export type DashboardWidgetId =
  | "recent-conversations"
  | "recent-projects"
  | "recent-documents"
  | "recent-standards"
  | "recent-calculators"
  | "recent-reports"
  | "recent-templates"
  | "recent-workflows"
  | "saved-bookmarks"
  | "recent-notes"
  | "engineering-insights"
  | "activity-summary"
  | "notifications"
  | "learning-progress"
  | "productivity"
  | "quick-actions";

export type ActivityPeriod = "today" | "week" | "month";

export type NotificationType =
  | "standards-update"
  | "engineering-news"
  | "event"
  | "webinar"
  | "tender-alert"
  | "job-opportunity"
  | "business-promotion"
  | "system";

export interface DashboardWidget {
  id: DashboardWidgetId;
  label: string;
  pinned: boolean;
  hidden: boolean;
  order: number;
}

export interface DashboardBookmark {
  id: string;
  title: string;
  type: string;
  url?: string;
  reference?: string;
  createdAt: number;
}

export interface DashboardNote {
  id: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ActivityEntry {
  id: string;
  type: string;
  title: string;
  module: string;
  timestamp: number;
}

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface LearningProgress {
  coursesStarted: number;
  coursesCompleted: number;
  topicsExplored: number;
  mentorRecommendations: string[];
  skillProgressPercent: number;
}

export interface ProductivityItem {
  id: string;
  type: "task" | "review" | "draft" | "workflow" | "reminder";
  title: string;
  dueDate: number | null;
  priority: "low" | "medium" | "high";
}

export interface EngineeringRecommendation {
  category: "standard" | "calculator" | "tool" | "learning" | "template" | "workflow";
  title: string;
  description: string;
  action: string;
}

export interface DashboardPreferences {
  widgetOrder: DashboardWidgetId[];
  hiddenWidgets: DashboardWidgetId[];
  pinnedWidgets: DashboardWidgetId[];
  defaultWorkspace: string | null;
  defaultDisciplineId: string | null;
  defaultDisciplineName: string | null;
}

export interface DashboardState {
  preferences: DashboardPreferences;
  bookmarks: DashboardBookmark[];
  notes: DashboardNote[];
  activities: ActivityEntry[];
  notifications: DashboardNotification[];
  lastOpenedAt: number;
}

export interface DashboardEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
}

export interface DashboardEngineResult {
  active: boolean;
  dashboardAction: string | null;
  reportAction: string | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface DashboardExtensionHooks {
  enterpriseDashboardId?: string | null;
  institutionDashboardId?: string | null;
  organizationDashboardId?: string | null;
  pmisExecutiveDashboardId?: string | null;
}

export const ALL_WIDGET_IDS: DashboardWidgetId[] = [
  "recent-conversations",
  "recent-projects",
  "recent-documents",
  "recent-standards",
  "recent-calculators",
  "recent-reports",
  "recent-templates",
  "recent-workflows",
  "saved-bookmarks",
  "recent-notes",
  "engineering-insights",
  "activity-summary",
  "notifications",
  "learning-progress",
  "productivity",
  "quick-actions",
];

export const WIDGET_LABELS: Record<DashboardWidgetId, string> = {
  "recent-conversations": "Recent AI Conversations",
  "recent-projects": "Recent Projects",
  "recent-documents": "Recent Documents",
  "recent-standards": "Recent Standards",
  "recent-calculators": "Recent Calculators",
  "recent-reports": "Recent Reports",
  "recent-templates": "Recent Templates",
  "recent-workflows": "Recent Workflows",
  "saved-bookmarks": "Saved Bookmarks",
  "recent-notes": "Recent Notes",
  "engineering-insights": "Engineering Insights",
  "activity-summary": "Activity Summary",
  notifications: "Notifications",
  "learning-progress": "Learning Progress",
  productivity: "Productivity",
  "quick-actions": "Quick Actions",
};
