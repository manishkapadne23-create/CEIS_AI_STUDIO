import {
  aggregateModuleActivities,
  formatActivitySummary,
  formatRecentItems,
  getRecentDocuments,
  getRecentProjects,
  getRecentReports,
  getRecentTemplates,
  getRecentWorkflows,
  recordActivity,
} from "./activityFeed";
import {
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
import {
  formatNotifications,
  getNotifications,
  getUnreadCount,
  NOTIFICATION_COUNT,
} from "./notificationWidget";
import { formatInsightsSummary, formatRecommendations, getRecommendations } from "./recommendationWidget";
import type {
  ActivityPeriod,
  DashboardEngineInput,
  DashboardEngineResult,
  DashboardExtensionHooks,
  NotificationType,
} from "./types";
import {
  formatWidgetList,
  getVisibleWidgets,
  hideWidget,
  loadPreferences,
  pinWidget,
  resolveWidgetId,
  setDefaultDiscipline,
  setDefaultWorkspace,
  showWidget,
} from "./widgetManager";

let extensionHooks: DashboardExtensionHooks = {};

export const setDashboardExtensionHooks = (hooks: DashboardExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getDashboardExtensionHooks = (): DashboardExtensionHooks => extensionHooks;

const LAST_OPENED_KEY = "sarathi.dashboard.lastOpened";

const isDashboardQuery = (message: string): boolean =>
  /\b(dashboard|engineering\s+intelligence\s+dashboard|my\s+dashboard|open\s+dashboard|show\s+dashboard|activity\s+summary|engineering\s+insights|notifications?|learning\s+progress|productivity|quick\s+actions|global\s+search|pin\s+widget|hide\s+widget|show\s+widget|dashboard\s+widgets?)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const openMatch = message.match(
    /^(?:open\s+dashboard|show\s+dashboard|engineering\s+(?:intelligence\s+)?dashboard|my\s+dashboard)$/i
  );
  if (openMatch) return { action: "open", payload: "" };

  const summaryMatch = message.match(
    /^activity\s+summary(?:\s+(today|this\s+week|this\s+month|week|month))?$/i
  );
  if (summaryMatch) return { action: "activity", payload: summaryMatch[1]?.trim() ?? "today" };

  const insightsMatch = message.match(/^engineering\s+insights$/i);
  if (insightsMatch) return { action: "insights", payload: "" };

  const notifMatch = message.match(/^notifications?(?:\s+(.+))?$/i);
  if (notifMatch) return { action: "notifications", payload: notifMatch[1]?.trim() ?? "" };

  const learningMatch = message.match(/^learning\s+progress$/i);
  if (learningMatch) return { action: "learning", payload: "" };

  const productivityMatch = message.match(/^productivity$/i);
  if (productivityMatch) return { action: "productivity", payload: "" };

  const quickMatch = message.match(/^quick\s+actions?$/i);
  if (quickMatch) return { action: "quick-actions", payload: "" };

  const searchMatch = message.match(
    /^(?:global\s+search|search\s+dashboard|unified\s+search)\s+(.+)$/i
  );
  if (searchMatch) return { action: "search", payload: searchMatch[1].trim() };

  const pinMatch = message.match(/^pin\s+widget\s+(.+)$/i);
  if (pinMatch) return { action: "pin", payload: pinMatch[1].trim() };

  const hideMatch = message.match(/^hide\s+widget\s+(.+)$/i);
  if (hideMatch) return { action: "hide", payload: hideMatch[1].trim() };

  const showWidgetMatch = message.match(/^show\s+widget\s+(.+)$/i);
  if (showWidgetMatch) return { action: "show-widget", payload: showWidgetMatch[1].trim() };

  const widgetsMatch = message.match(/^dashboard\s+widgets?$/i);
  if (widgetsMatch) return { action: "widgets", payload: "" };

  const recentMatch = message.match(
    /^recent\s+(projects?|documents?|templates?|workflows?|reports?)$/i
  );
  if (recentMatch) return { action: "recent", payload: recentMatch[1].trim() };

  const bookmarksMatch = message.match(/^saved\s+bookmarks?$/i);
  if (bookmarksMatch) return { action: "bookmarks", payload: "" };

  const notesMatch = message.match(/^recent\s+notes?$/i);
  if (notesMatch) return { action: "notes", payload: "" };

  const addNoteMatch = message.match(/^add\s+(?:dashboard\s+)?note\s+(.+)$/i);
  if (addNoteMatch) return { action: "add-note", payload: addNoteMatch[1].trim() };

  const bookmarkMatch = message.match(/^bookmark\s+(.+)$/i);
  if (bookmarkMatch) return { action: "bookmark", payload: bookmarkMatch[1].trim() };

  const defaultDiscMatch = message.match(/^set\s+default\s+discipline$/i);
  if (defaultDiscMatch) return { action: "default-discipline", payload: "" };

  const defaultWsMatch = message.match(/^set\s+default\s+workspace\s+(.+)$/i);
  if (defaultWsMatch) return { action: "default-workspace", payload: defaultWsMatch[1].trim() };

  return null;
};

const resolvePeriod = (payload: string): ActivityPeriod => {
  if (/week/i.test(payload)) return "week";
  if (/month/i.test(payload)) return "month";
  return "today";
};

const resolveNotificationType = (payload: string): NotificationType | undefined => {
  const p = payload.toLowerCase();
  if (/standard/i.test(p)) return "standards-update";
  if (/news/i.test(p)) return "engineering-news";
  if (/event/i.test(p)) return "event";
  if (/webinar/i.test(p)) return "webinar";
  if (/tender/i.test(p)) return "tender-alert";
  if (/job/i.test(p)) return "job-opportunity";
  if (/promo|business/i.test(p)) return "business-promotion";
  if (/system/i.test(p)) return "system";
  return undefined;
};

const buildDashboardOverview = (
  disciplineId: string | null,
  disciplineName: string | null
): string => {
  const widgets = getVisibleWidgets();
  const unread = getUnreadCount();
  const progress = getLearningProgress();
  const productivity = getProductivityItems();
  const activities = aggregateModuleActivities();

  return [
    "════════════════════════════════════════",
    "  ENGINEERING INTELLIGENCE DASHBOARD (EID)",
    "════════════════════════════════════════",
    `Discipline: ${disciplineName ?? "Not set"}`,
    `Active widgets: ${widgets.length} | Unread notifications: ${unread}`,
    `Learning progress: ${progress.skillProgressPercent}% | Pending items: ${productivity.length}`,
    "",
    "── QUICK ACTIONS ──",
    formatQuickActions().split("\n").slice(1, 8).join("\n"),
    "",
    "── ACTIVITY (Today) ──",
    formatActivitySummary("today").split("\n").slice(2, 8).join("\n"),
    "",
    "── RECENT PROJECTS ──",
    formatRecentItems("projects", getRecentProjects()).split("\n").slice(1, 4).join("\n"),
    "",
    "── ENGINEERING INSIGHTS ──",
    formatRecommendations(getRecommendations(disciplineId, disciplineName))
      .split("\n")
      .slice(1, 6)
      .join("\n"),
    "",
    "── NOTIFICATIONS ──",
    formatNotifications(getNotifications()).split("\n").slice(1, 6).join("\n"),
    "",
    `Total tracked activities: ${activities.length}`,
    "",
    "Commands: activity summary | engineering insights | notifications | learning progress",
    "         productivity | global search [query] | dashboard widgets",
  ].join("\n");
};

/** Run Engineering Intelligence Dashboard (EID) for a user turn. */
export const runDashboardEngine = (
  input: DashboardEngineInput
): DashboardEngineResult => {
  let dashboardAction: string | null = null;
  let reportAction: string | null = null;
  let searchResultCount = 0;

  localStorage.setItem(LAST_OPENED_KEY, String(Date.now()));
  recordActivity("dashboard-access", "Dashboard accessed", "dashboard");

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "open":
        dashboardAction = buildDashboardOverview(input.disciplineId, input.disciplineName);
        break;
      case "activity":
        dashboardAction = formatActivitySummary(resolvePeriod(command.payload));
        break;
      case "insights":
        dashboardAction = formatInsightsSummary(input.disciplineId, input.disciplineName);
        break;
      case "notifications": {
        const filterType = resolveNotificationType(command.payload);
        dashboardAction = formatNotifications(getNotifications(), filterType);
        break;
      }
      case "learning":
        dashboardAction = formatLearningProgress(getLearningProgress());
        break;
      case "productivity":
        dashboardAction = formatProductivity(getProductivityItems());
        break;
      case "quick-actions":
        dashboardAction = formatQuickActions();
        break;
      case "search": {
        const results = globalSearch(command.payload);
        searchResultCount = results.length;
        dashboardAction = formatSearchResults(results);
        break;
      }
      case "pin": {
        const widgetId = resolveWidgetId(command.payload);
        dashboardAction = widgetId ? pinWidget(widgetId) : `Widget not found: ${command.payload}`;
        break;
      }
      case "hide": {
        const widgetId = resolveWidgetId(command.payload);
        dashboardAction = widgetId ? hideWidget(widgetId) : `Widget not found: ${command.payload}`;
        break;
      }
      case "show-widget": {
        const widgetId = resolveWidgetId(command.payload);
        dashboardAction = widgetId ? showWidget(widgetId) : `Widget not found: ${command.payload}`;
        break;
      }
      case "widgets":
        dashboardAction = formatWidgetList();
        break;
      case "recent": {
        const type = command.payload.replace(/s$/, "");
        if (/project/i.test(type)) {
          dashboardAction = formatRecentItems("projects", getRecentProjects());
        } else if (/document/i.test(type)) {
          dashboardAction = formatRecentItems("documents", getRecentDocuments());
        } else if (/template/i.test(type)) {
          dashboardAction = formatRecentItems("templates", getRecentTemplates());
        } else if (/workflow/i.test(type)) {
          dashboardAction = formatRecentItems("workflows", getRecentWorkflows());
        } else if (/report/i.test(type)) {
          dashboardAction = formatRecentItems("reports", getRecentReports());
        }
        break;
      }
      case "bookmarks": {
        const bookmarks = getBookmarks();
        dashboardAction = formatRecentItems("bookmarks", bookmarks);
        break;
      }
      case "notes": {
        const notes = getNotes();
        dashboardAction =
          notes.length === 0
            ? "No notes yet. Use: Add note [text]"
            : ["RECENT NOTES:", ...notes.map((n, i) => `${i + 1}. ${n.content}`)].join("\n");
        break;
      }
      case "add-note":
        addNote(command.payload);
        dashboardAction = `Note added: ${command.payload}`;
        break;
      case "bookmark":
        addBookmark(command.payload, "custom");
        dashboardAction = `Bookmarked: ${command.payload}`;
        break;
      case "default-discipline":
        setDefaultDiscipline(input.disciplineId, input.disciplineName);
        dashboardAction = `Default discipline set: ${input.disciplineName ?? "none"}`;
        break;
      case "default-workspace":
        setDefaultWorkspace(command.payload);
        dashboardAction = `Default workspace set: ${command.payload}`;
        break;
    }
  }

  if (!dashboardAction && !reportAction && isDashboardQuery(input.userMessage)) {
    dashboardAction = buildDashboardOverview(input.disciplineId, input.disciplineName);
  }

  const active =
    isDashboardQuery(input.userMessage) ||
    dashboardAction !== null ||
    reportAction !== null;

  const prefs = loadPreferences();
  const extensionNotes: string[] = [];
  if (extensionHooks.enterpriseDashboardId) extensionNotes.push(`Enterprise: ${extensionHooks.enterpriseDashboardId}`);
  if (extensionHooks.institutionDashboardId) extensionNotes.push(`Institution: ${extensionHooks.institutionDashboardId}`);
  if (extensionHooks.organizationDashboardId) extensionNotes.push(`Organization: ${extensionHooks.organizationDashboardId}`);
  if (extensionHooks.pmisExecutiveDashboardId) extensionNotes.push(`PMIS Executive: ${extensionHooks.pmisExecutiveDashboardId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Intelligence Dashboard (EID)",
    "========================================",
    "Personal engineering intelligence — NOT a PMIS dashboard.",
    "",
    dashboardAction ? `DASHBOARD:\n${dashboardAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    prefs.defaultDisciplineName ? `\nDefault discipline: ${prefs.defaultDisciplineName}` : "",
    "",
    "EID COMMANDS:",
    "- Open dashboard | Activity summary [today/week/month] | Engineering insights",
    "- Notifications | Learning progress | Productivity | Quick actions",
    "- Global search [keyword] | Recent projects/templates/workflows/reports",
    "- Dashboard widgets | Pin widget [name] | Hide widget [name] | Show widget [name]",
    "- Add note [text] | Bookmark [item] | Set default discipline",
    `- Notifications catalog: ${NOTIFICATION_COUNT}`,
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    dashboardAction,
    reportAction,
    searchResultCount,
    promptAugmentation,
    summaryText: [
      active ? "eid-active" : "",
      getUnreadCount() > 0 ? `${getUnreadCount()} notifications` : "",
      searchResultCount > 0 ? `${searchResultCount} results` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatDashboardForPrompt = (result: DashboardEngineResult): string =>
  result.promptAugmentation;
