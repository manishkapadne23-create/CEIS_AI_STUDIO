import type {
  DashboardPreferences,
  DashboardWidget,
  DashboardWidgetId,
} from "./types";
import { ALL_WIDGET_IDS, WIDGET_LABELS } from "./types";

const PREFS_KEY = "sarathi.dashboard.preferences";

const DEFAULT_PREFS: DashboardPreferences = {
  widgetOrder: [...ALL_WIDGET_IDS],
  hiddenWidgets: [],
  pinnedWidgets: ["quick-actions", "engineering-insights", "activity-summary"],
  defaultWorkspace: null,
  defaultDisciplineId: null,
  defaultDisciplineName: null,
};

let cachedPrefs: DashboardPreferences | null = null;

export const loadPreferences = (): DashboardPreferences => {
  if (cachedPrefs) return cachedPrefs;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    cachedPrefs = raw
      ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as DashboardPreferences) }
      : { ...DEFAULT_PREFS };
  } catch {
    cachedPrefs = { ...DEFAULT_PREFS };
  }
  return cachedPrefs;
};

const savePreferences = (prefs: DashboardPreferences): void => {
  cachedPrefs = prefs;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
};

export const getWidgets = (): DashboardWidget[] => {
  const prefs = loadPreferences();
  return prefs.widgetOrder.map((id, index) => ({
    id,
    label: WIDGET_LABELS[id],
    pinned: prefs.pinnedWidgets.includes(id),
    hidden: prefs.hiddenWidgets.includes(id),
    order: index,
  }));
};

export const getVisibleWidgets = (): DashboardWidget[] =>
  getWidgets().filter((w) => !w.hidden);

export const pinWidget = (widgetId: DashboardWidgetId): string | null => {
  if (!ALL_WIDGET_IDS.includes(widgetId)) return null;
  const prefs = loadPreferences();
  if (!prefs.pinnedWidgets.includes(widgetId)) {
    prefs.pinnedWidgets.push(widgetId);
    savePreferences(prefs);
  }
  return `Pinned widget: ${WIDGET_LABELS[widgetId]}`;
};

export const unpinWidget = (widgetId: DashboardWidgetId): string | null => {
  const prefs = loadPreferences();
  prefs.pinnedWidgets = prefs.pinnedWidgets.filter((id) => id !== widgetId);
  savePreferences(prefs);
  return `Unpinned widget: ${WIDGET_LABELS[widgetId]}`;
};

export const hideWidget = (widgetId: DashboardWidgetId): string | null => {
  if (!ALL_WIDGET_IDS.includes(widgetId)) return null;
  const prefs = loadPreferences();
  if (!prefs.hiddenWidgets.includes(widgetId)) {
    prefs.hiddenWidgets.push(widgetId);
    savePreferences(prefs);
  }
  return `Hidden widget: ${WIDGET_LABELS[widgetId]}`;
};

export const showWidget = (widgetId: DashboardWidgetId): string | null => {
  const prefs = loadPreferences();
  prefs.hiddenWidgets = prefs.hiddenWidgets.filter((id) => id !== widgetId);
  savePreferences(prefs);
  return `Showing widget: ${WIDGET_LABELS[widgetId]}`;
};

export const reorderWidget = (
  widgetId: DashboardWidgetId,
  newIndex: number
): string | null => {
  const prefs = loadPreferences();
  const order = [...prefs.widgetOrder];
  const currentIndex = order.indexOf(widgetId);
  if (currentIndex < 0) return null;
  order.splice(currentIndex, 1);
  order.splice(Math.max(0, Math.min(newIndex, order.length)), 0, widgetId);
  prefs.widgetOrder = order;
  savePreferences(prefs);
  return `Moved ${WIDGET_LABELS[widgetId]} to position ${newIndex + 1}`;
};

export const setDefaultDiscipline = (
  disciplineId: string | null,
  disciplineName: string | null
): void => {
  const prefs = loadPreferences();
  prefs.defaultDisciplineId = disciplineId;
  prefs.defaultDisciplineName = disciplineName;
  savePreferences(prefs);
};

export const setDefaultWorkspace = (workspace: string): void => {
  const prefs = loadPreferences();
  prefs.defaultWorkspace = workspace;
  savePreferences(prefs);
};

export const resolveWidgetId = (query: string): DashboardWidgetId | null => {
  const q = query.toLowerCase().replace(/\s+/g, "-");
  const match = ALL_WIDGET_IDS.find(
    (id) => id.includes(q) || WIDGET_LABELS[id].toLowerCase().includes(query.toLowerCase())
  );
  return match ?? null;
};

export const formatWidgetList = (): string => {
  const widgets = getWidgets();
  return [
    "DASHBOARD WIDGETS:",
    ...widgets.map(
      (w) =>
        `${w.order + 1}. ${w.label}${w.pinned ? " [PINNED]" : ""}${w.hidden ? " [HIDDEN]" : ""}`
    ),
  ].join("\n");
};
