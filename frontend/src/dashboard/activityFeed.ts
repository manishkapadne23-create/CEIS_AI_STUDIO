import type { ActivityEntry } from "./types";

const ACTIVITY_KEY = "sarathi.dashboard.activities";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const recordActivity = (
  type: string,
  title: string,
  module: string
): void => {
  const activities = readJson<ActivityEntry[]>(ACTIVITY_KEY, []);
  activities.unshift({
    id: crypto.randomUUID(),
    type,
    title,
    module,
    timestamp: Date.now(),
  });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(0, 200)));
};

export const getActivities = (): ActivityEntry[] =>
  readJson<ActivityEntry[]>(ACTIVITY_KEY, []);

const startOfDay = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const startOfWeek = (d: Date): number => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return startOfDay(new Date(d.setDate(diff)));
};

const startOfMonth = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth(), 1).getTime();

export const aggregateModuleActivities = (): ActivityEntry[] => {
  const entries: ActivityEntry[] = [...getActivities()];

  const projects = readJson<{ id: string; name: string; updatedAt?: number }[]>(
    "sarathi.projects.registry",
    []
  );
  for (const p of projects.slice(0, 5)) {
    entries.push({
      id: `proj-${p.id}`,
      type: "project",
      title: p.name,
      module: "projects",
      timestamp: p.updatedAt ?? Date.now(),
    });
  }

  const templates = readJson<string[]>("sarathi.templates.recent", []);
  for (const id of templates.slice(0, 5)) {
    entries.push({
      id: `tpl-${id}`,
      type: "template",
      title: id,
      module: "templates",
      timestamp: Date.now() - entries.length * 1000,
    });
  }

  const workflows = readJson<{ id: string; workflowTitle: string; updatedAt: number }[]>(
    "sarathi.workflow.progress",
    []
  );
  for (const w of workflows.slice(0, 5)) {
    entries.push({
      id: `wf-${w.id}`,
      type: "workflow",
      title: w.workflowTitle,
      module: "workflows",
      timestamp: w.updatedAt,
    });
  }

  const reports = readJson<{ title?: string; generatedAt?: number }[]>(
    "sarathi.templates.generated",
    []
  );
  for (const r of reports.slice(0, 5)) {
    entries.push({
      id: crypto.randomUUID(),
      type: "report",
      title: r.title ?? "Generated report",
      module: "templates",
      timestamp: r.generatedAt ?? Date.now(),
    });
  }

  const designRecent = readJson<string[]>("sarathi.design.recent", []);
  for (const id of designRecent.slice(0, 3)) {
    entries.push({
      id: `design-${id}`,
      type: "design",
      title: `Design session ${id.slice(0, 8)}`,
      module: "design",
      timestamp: Date.now(),
    });
  }

  return entries.sort((a, b) => b.timestamp - a.timestamp);
};

export const filterActivitiesByPeriod = (
  activities: ActivityEntry[],
  period: "today" | "week" | "month"
): ActivityEntry[] => {
  const now = new Date();
  const cutoff =
    period === "today"
      ? startOfDay(now)
      : period === "week"
        ? startOfWeek(new Date())
        : startOfMonth(now);
  return activities.filter((a) => a.timestamp >= cutoff);
};

export const formatActivitySummary = (
  period: "today" | "week" | "month"
): string => {
  const all = aggregateModuleActivities();
  const filtered = filterActivitiesByPeriod(all, period);
  const label =
    period === "today" ? "Today" : period === "week" ? "This Week" : "This Month";

  const byModule = new Map<string, number>();
  for (const a of filtered) {
    byModule.set(a.module, (byModule.get(a.module) ?? 0) + 1);
  }

  return [
    `ACTIVITY SUMMARY — ${label}`,
    `Total activities: ${filtered.length}`,
    "",
    "By Module:",
    ...Array.from(byModule.entries()).map(([m, c]) => `- ${m}: ${c}`),
    "",
    "Recent:",
    ...filtered.slice(0, 8).map(
      (a, i) =>
        `${i + 1}. [${a.module}] ${a.title} — ${new Date(a.timestamp).toLocaleString()}`
    ),
  ].join("\n");
};

export const formatRecentItems = (
  type: string,
  items: { title: string; meta?: string }[]
): string =>
  items.length === 0
    ? `No recent ${type} found.`
    : [
        `RECENT ${type.toUpperCase()}:`,
        ...items.map((item, i) => `${i + 1}. ${item.title}${item.meta ? ` — ${item.meta}` : ""}`),
      ].join("\n");

export const getRecentProjects = (): { title: string; meta?: string }[] =>
  readJson<{ name: string; disciplineName?: string }[]>("sarathi.projects.registry", [])
    .slice(0, 5)
    .map((p) => ({ title: p.name, meta: p.disciplineName }));

export const getRecentTemplates = (): { title: string; meta?: string }[] => {
  const recentIds = readJson<string[]>("sarathi.templates.recent", []);
  return recentIds.slice(0, 5).map((id) => ({ title: id }));
};

export const getRecentWorkflows = (): { title: string; meta?: string }[] =>
  readJson<{ workflowTitle: string; status: string }[]>("sarathi.workflow.progress", [])
    .slice(0, 5)
    .map((w) => ({ title: w.workflowTitle, meta: w.status }));

export const getRecentReports = (): { title: string; meta?: string }[] =>
  readJson<{ title?: string; type?: string; generatedAt?: number }[]>(
    "sarathi.templates.generated",
    []
  )
    .slice(0, 5)
    .map((r) => ({
      title: r.title ?? "Report",
      meta: r.generatedAt ? new Date(r.generatedAt).toLocaleDateString() : undefined,
    }));

export const getRecentDocuments = (): { title: string; meta?: string }[] => {
  const generated = readJson<{ title?: string }[]>("sarathi.templates.generated", []);
  const design = readJson<{ title?: string }[]>("sarathi.design.sessions", []);
  return [
    ...generated.slice(0, 3).map((d) => ({ title: d.title ?? "Document", meta: "template" })),
    ...design.slice(0, 2).map((d) => ({ title: d.title ?? "Design doc", meta: "design" })),
  ];
};
