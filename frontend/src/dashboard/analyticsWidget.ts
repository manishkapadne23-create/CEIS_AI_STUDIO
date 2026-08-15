import type { LearningProgress, ProductivityItem } from "./types";

const BOOKMARKS_KEY = "sarathi.dashboard.bookmarks";
const NOTES_KEY = "sarathi.dashboard.notes";
const TASKS_KEY = "sarathi.dashboard.tasks";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const getLearningProgress = (): LearningProgress => {
  const mentorWorkspaces = readJson<{ learningPlans?: unknown[]; focusArea?: string }[]>(
    "sarathi.mentor.workspaces",
    []
  );
  const researchWorkspaces = readJson<{ topic?: string }[]>(
    "sarathi.research.workspaces",
    []
  );

  const plansStarted = mentorWorkspaces.reduce(
    (sum, w) => sum + (w.learningPlans?.length ?? 0),
    0
  );
  const topicsExplored = researchWorkspaces.length + mentorWorkspaces.length;

  const mentorRecommendations = mentorWorkspaces
    .slice(0, 3)
    .map((w) => w.focusArea ?? "Career development")
    .filter(Boolean);

  return {
    coursesStarted: plansStarted,
    coursesCompleted: Math.floor(plansStarted * 0.3),
    topicsExplored,
    mentorRecommendations:
      mentorRecommendations.length > 0
        ? mentorRecommendations
        : ["Explore learning roadmap: 90-day plan", "Skill gap analysis", "Certification guidance"],
    skillProgressPercent: Math.min(100, topicsExplored * 15 + plansStarted * 10),
  };
};

export const formatLearningProgress = (progress: LearningProgress): string =>
  [
    "LEARNING PROGRESS",
    `Courses Started: ${progress.coursesStarted}`,
    `Courses Completed: ${progress.coursesCompleted}`,
    `Topics Explored: ${progress.topicsExplored}`,
    `Skill Development: ${progress.skillProgressPercent}%`,
    "",
    "AI Mentor Recommendations:",
    ...progress.mentorRecommendations.map((r) => `- ${r}`),
  ].join("\n");

export const getProductivityItems = (): ProductivityItem[] => {
  const items: ProductivityItem[] = [];

  const workflows = readJson<
    { id: string; workflowTitle: string; status: string; updatedAt: number }[]
  >("sarathi.workflow.progress", []);
  for (const w of workflows.filter((wf) => wf.status !== "completed").slice(0, 5)) {
    items.push({
      id: w.id,
      type: "workflow",
      title: w.workflowTitle,
      dueDate: null,
      priority: w.status === "paused" ? "medium" : "high",
    });
  }

  const estimates = readJson<
    { id: string; title: string; status?: string }[]
  >("sarathi.estimation.estimates", []);
  for (const e of estimates.slice(0, 3)) {
    items.push({
      id: e.id,
      type: "draft",
      title: `Estimate: ${e.title}`,
      dueDate: null,
      priority: "medium",
    });
  }

  const customTasks = readJson<ProductivityItem[]>(TASKS_KEY, []);
  items.push(...customTasks);

  const now = Date.now();
  items.push({
    id: "reminder-review",
    type: "reminder",
    title: "Review pending engineering deliverables",
    dueDate: now + 86400000,
    priority: "medium",
  });

  return items.slice(0, 10);
};

export const formatProductivity = (items: ProductivityItem[]): string => {
  const grouped = {
    workflow: items.filter((i) => i.type === "workflow"),
    draft: items.filter((i) => i.type === "draft"),
    task: items.filter((i) => i.type === "task"),
    review: items.filter((i) => i.type === "review"),
    reminder: items.filter((i) => i.type === "reminder"),
  };

  const section = (title: string, list: ProductivityItem[]) =>
    list.length > 0
      ? [title, ...list.map((i) => `- [${i.priority}] ${i.title}`)].join("\n")
      : "";

  return [
    "PRODUCTIVITY",
    section("Incomplete Workflows:", grouped.workflow),
    section("Saved Drafts:", grouped.draft),
    section("Tasks Due:", grouped.task),
    section("Pending Reviews:", grouped.review),
    section("Upcoming Reminders:", grouped.reminder),
  ]
    .filter(Boolean)
    .join("\n\n");
};

export const getBookmarks = (): { title: string; type: string }[] => {
  const dashboardBookmarks = readJson<{ title: string; type: string }[]>(BOOKMARKS_KEY, []);
  const workflowBookmarks = readJson<string[]>("sarathi.workflows.bookmarks", []);
  const templateFavorites = readJson<string[]>("sarathi.templates.favorites", []);

  return [
    ...dashboardBookmarks.map((b) => ({ title: b.title, type: b.type })),
    ...workflowBookmarks.map((id) => ({ title: id, type: "workflow" })),
    ...templateFavorites.map((id) => ({ title: id, type: "template" })),
  ].slice(0, 10);
};

export const addBookmark = (title: string, type: string): void => {
  const bookmarks = readJson<{ id: string; title: string; type: string; createdAt: number }[]>(
    BOOKMARKS_KEY,
    []
  );
  bookmarks.unshift({
    id: crypto.randomUUID(),
    title,
    type,
    createdAt: Date.now(),
  });
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks.slice(0, 50)));
};

export const getNotes = (): { content: string; updatedAt: number }[] =>
  readJson<{ content: string; updatedAt: number }[]>(NOTES_KEY, []);

export const addNote = (content: string): void => {
  const notes = readJson<{ id: string; content: string; tags: string[]; createdAt: number; updatedAt: number }[]>(
    NOTES_KEY,
    []
  );
  const now = Date.now();
  notes.unshift({ id: crypto.randomUUID(), content, tags: [], createdAt: now, updatedAt: now });
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes.slice(0, 50)));
};

export const formatQuickActions = (): string =>
  [
    "QUICK ACTIONS",
    "1. New AI Chat — Start a new engineering conversation",
    "2. Upload Document — Analyze engineering documents",
    "3. Start Workflow — Begin a guided engineering workflow",
    "4. Open Calculator — Access engineering calculators",
    "5. Open Standards — Browse engineering standards",
    "6. Generate Report — Create engineering reports from templates",
    "7. Search Knowledge — Search lessons, research, and knowledge base",
    "",
    "Say any command directly in chat, e.g.:",
    '- "Start workflow: Bridge Design"',
    '- "Generate report: Structural Design"',
    '- "Open dashboard" to return here',
  ].join("\n");

export const globalSearch = (
  query: string
): { category: string; title: string; source: string }[] => {
  const q = query.toLowerCase();
  if (!q) return [];
  const results: { category: string; title: string; source: string }[] = [];

  const projects = readJson<{ name: string }[]>("sarathi.projects.registry", []);
  for (const p of projects) {
    if (p.name.toLowerCase().includes(q)) {
      results.push({ category: "Projects", title: p.name, source: "projects" });
    }
  }

  const templates = readJson<string[]>("sarathi.templates.recent", []);
  for (const t of templates) {
    if (t.toLowerCase().includes(q)) {
      results.push({ category: "Templates", title: t, source: "templates" });
    }
  }

  const workflows = readJson<{ workflowTitle: string }[]>("sarathi.workflow.progress", []);
  for (const w of workflows) {
    if (w.workflowTitle.toLowerCase().includes(q)) {
      results.push({ category: "Workflows", title: w.workflowTitle, source: "workflows" });
    }
  }

  const lessons = readJson<{ title: string }[]>("sarathi.knowledge-capture.workspaces", []);
  for (const l of lessons) {
    if (l.title?.toLowerCase().includes(q)) {
      results.push({ category: "Knowledge", title: l.title, source: "knowledge-capture" });
    }
  }

  const research = readJson<{ title: string; topic?: string }[]>("sarathi.research.workspaces", []);
  for (const r of research) {
    if (r.title?.toLowerCase().includes(q) || r.topic?.toLowerCase().includes(q)) {
      results.push({ category: "Research", title: r.title ?? r.topic ?? "Research", source: "research" });
    }
  }

  const notes = getNotes();
  for (const n of notes) {
    if (n.content.toLowerCase().includes(q)) {
      results.push({ category: "Notes", title: n.content.slice(0, 60), source: "dashboard" });
    }
  }

  const standards = ["IS 456", "IS 800", "IEC 60364", "ASME B31.3", "ISO 9001", "NFPA 70"];
  for (const s of standards) {
    if (s.toLowerCase().includes(q)) {
      results.push({ category: "Standards", title: s, source: "standards" });
    }
  }

  return results.slice(0, 15);
};

export const formatSearchResults = (
  results: { category: string; title: string; source: string }[]
): string =>
  results.length === 0
    ? "No results found."
    : [
        `GLOBAL SEARCH RESULTS (${results.length}):`,
        ...results.map((r, i) => `${i + 1}. [${r.category}] ${r.title} (${r.source})`),
      ].join("\n");
