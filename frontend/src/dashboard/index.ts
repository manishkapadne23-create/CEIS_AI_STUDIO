export type {
  ActivityEntry,
  ActivityPeriod,
  DashboardBookmark,
  DashboardEngineInput,
  DashboardEngineResult,
  DashboardExtensionHooks,
  DashboardNote,
  DashboardNotification,
  DashboardPreferences,
  DashboardState,
  DashboardWidget,
  DashboardWidgetId,
  EngineeringRecommendation,
  LearningProgress,
  NotificationType,
  ProductivityItem,
} from "./types";

export { ALL_WIDGET_IDS, WIDGET_LABELS } from "./types";

export {
  aggregateModuleActivities,
  filterActivitiesByPeriod,
  formatActivitySummary,
  formatRecentItems,
  getActivities,
  getRecentDocuments,
  getRecentProjects,
  getRecentReports,
  getRecentTemplates,
  getRecentWorkflows,
  recordActivity,
} from "./activityFeed";

export {
  formatInsightsSummary,
  formatRecommendations,
  getRecommendations,
  getSuggestedCalculators,
  getSuggestedStandards,
} from "./recommendationWidget";

export {
  formatNotifications,
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  NOTIFICATION_COUNT,
} from "./notificationWidget";

export {
  addBookmark,
  addNote,
  formatLearningProgress,
  formatProductivity,
  formatQuickActions,
  formatSearchResults,
  getBookmarks,
  getLearningProgress,
  getNotes,
  getProductivityItems,
  globalSearch,
} from "./analyticsWidget";

export {
  formatWidgetList,
  getVisibleWidgets,
  getWidgets,
  hideWidget,
  loadPreferences,
  pinWidget,
  reorderWidget,
  resolveWidgetId,
  setDefaultDiscipline,
  setDefaultWorkspace,
  showWidget,
  unpinWidget,
} from "./widgetManager";

export {
  formatDashboardForPrompt,
  getDashboardExtensionHooks,
  runDashboardEngine,
  setDashboardExtensionHooks,
} from "./dashboardEngine";
