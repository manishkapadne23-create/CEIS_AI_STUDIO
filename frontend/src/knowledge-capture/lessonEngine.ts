import {
  BEST_PRACTICE_LIBRARY_SIZE,
  getSeedBestPractices,
  mergeBestPractices,
} from "./bestPracticeLibrary";
import {
  buildLessonEntry,
  formatLessonEntry,
  generateKnowledgeNote,
  summarizeLessons,
} from "./knowledgeCapture";
import {
  buildLessonsLearnedReport,
  formatBestPracticeGuideFromWorkspace,
  formatKnowledgeSummary,
  formatLessonsLearnedReportForPrompt,
} from "./lessonReports";
import {
  findSimilarLessons,
  formatSearchResults,
  formatSimilarLessons,
  resolveCategoryFromQuery,
  searchLessons,
} from "./lessonSearch";
import {
  buildRecommendationRegister,
  formatPreventiveActionReport,
  formatRecommendationRegister,
  formatRepeatedIssues,
  identifyRepeatedIssues,
  suggestPreventiveActions,
} from "./recommendationEngine";
import type {
  LessonEngineInput,
  LessonEngineResult,
  LessonExtensionHooks,
  LessonsLearnedWorkspace,
} from "./types";
import { LESSON_CATEGORIES } from "./types";

let extensionHooks: LessonExtensionHooks = {};

export const setLessonExtensionHooks = (hooks: LessonExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getLessonExtensionHooks = (): LessonExtensionHooks => extensionHooks;

const STORAGE_KEY = "sarathi.knowledge-capture.workspaces";
const ACTIVE_KEY = "sarathi.knowledge-capture.active";

let workspaceStore: LessonsLearnedWorkspace[] = [];
let activeWorkspaceId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    workspaceStore = raw ? (JSON.parse(raw) as LessonsLearnedWorkspace[]) : [];
    activeWorkspaceId = localStorage.getItem(ACTIVE_KEY);
  } catch {
    workspaceStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceStore.slice(0, 50)));
  if (activeWorkspaceId) localStorage.setItem(ACTIVE_KEY, activeWorkspaceId);
  else localStorage.removeItem(ACTIVE_KEY);
};

const createWorkspace = (
  title: string,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null,
  projectName: string | null
): LessonsLearnedWorkspace => {
  hydrate();
  const now = Date.now();
  const ws: LessonsLearnedWorkspace = {
    id: crypto.randomUUID(),
    title: title || `Lessons Learned — ${disciplineName ?? "Engineering"}`,
    disciplineId,
    disciplineName,
    conversationId,
    projectName,
    projectType: "general",
    lessons: [],
    bestPractices: getSeedBestPractices(),
    preventiveActions: [],
    recommendations: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  workspaceStore.unshift(ws);
  activeWorkspaceId = ws.id;
  persist();
  return ws;
};

export const getActiveLessonsWorkspace = (): LessonsLearnedWorkspace | null => {
  hydrate();
  if (!activeWorkspaceId) return null;
  return workspaceStore.find((w) => w.id === activeWorkspaceId) ?? null;
};

const updateWorkspace = (ws: LessonsLearnedWorkspace): void => {
  hydrate();
  const i = workspaceStore.findIndex((w) => w.id === ws.id);
  if (i >= 0) {
    workspaceStore[i] = { ...ws, updatedAt: Date.now() };
    persist();
  }
};

const isKnowledgeQuery = (message: string): boolean =>
  /\b(lessons?\s+learned|knowledge\s+capture|best\s+practice|capture\s+lesson|root\s+cause|preventive\s+action|recommendation\s+register|knowledge\s+summary|repeated\s+issue|similar\s+lesson|lessons?\s+report)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const startMatch = message.match(
    /^(?:start\s+lessons|create\s+lessons(?:\s+learned)?(?:\s+workspace)?|lessons?\s+learned\s+workspace)\s*(?:for\s+)?(.+)?$/i
  );
  if (startMatch) return { action: "start", payload: startMatch[1]?.trim() ?? "" };

  const captureMatch = message.match(
    /^(?:capture\s+lesson|add\s+lesson|record\s+lesson)[:\s]+(.+)$/is
  );
  if (captureMatch) return { action: "capture", payload: captureMatch[1].trim() };

  const summarizeMatch = message.match(/^summarize\s+lessons?$/i);
  if (summarizeMatch) return { action: "summarize", payload: "" };

  const bestPracticeMatch = message.match(
    /^(?:extract\s+best\s+practices?|best\s+practice\s+guide)$/i
  );
  if (bestPracticeMatch) return { action: "best-practices", payload: "" };

  const repeatedMatch = message.match(/^repeated\s+issues?$/i);
  if (repeatedMatch) return { action: "repeated", payload: "" };

  const preventiveMatch = message.match(/^preventive\s+actions?(?:\s+report)?$/i);
  if (preventiveMatch) return { action: "preventive", payload: "" };

  const similarMatch = message.match(
    /^similar\s+lessons?(?:\s+(.+))?$/i
  );
  if (similarMatch) return { action: "similar", payload: similarMatch[1]?.trim() ?? "" };

  const knowledgeNoteMatch = message.match(
    /^knowledge\s+note(?:\s+(.+))?$/i
  );
  if (knowledgeNoteMatch) return { action: "knowledge-note", payload: knowledgeNoteMatch[1]?.trim() ?? "" };

  const reportMatch = message.match(/^lessons?\s+learned\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const summaryMatch = message.match(/^knowledge\s+summary$/i);
  if (summaryMatch) return { action: "summary", payload: "" };

  const recMatch = message.match(/^recommendation\s+register$/i);
  if (recMatch) return { action: "recommendations", payload: "" };

  const searchMatch = message.match(
    /^(?:search\s+lessons?|find\s+lessons?)\s+(.+)$/i
  );
  if (searchMatch) return { action: "search", payload: searchMatch[1].trim() };

  const listMatch = message.match(
    /^(?:list\s+lessons?)(?:\s+(.+))?$/i
  );
  if (listMatch) return { action: "list", payload: listMatch[1]?.trim() ?? "" };

  const categoriesMatch = message.match(/^lesson\s+categories?$/i);
  if (categoriesMatch) return { action: "categories", payload: "" };

  return null;
};

/** Run Engineering Knowledge Capture & Lessons Learned Engine (EKCLL) for a user turn. */
export const runLessonEngine = (input: LessonEngineInput): LessonEngineResult => {
  let lessonAction: string | null = null;
  let reportAction: string | null = null;
  let searchResultCount = 0;
  let activeWorkspace = getActiveLessonsWorkspace();

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "start": {
        const title = command.payload || input.projectName || "";
        activeWorkspace = createWorkspace(
          title ? `Lessons: ${title}` : "",
          input.conversationId,
          input.disciplineId,
          input.disciplineName,
          command.payload || input.projectName || null
        );
        lessonAction = [
          `Lessons Learned Workspace: ${activeWorkspace.title}`,
          `Discipline: ${activeWorkspace.disciplineName ?? "General"}`,
          `Project: ${activeWorkspace.projectName ?? "Not specified"}`,
          "",
          `Seed best practices loaded: ${activeWorkspace.bestPractices.length}`,
          "",
          "Capture lessons with: Capture lesson: Problem: ... Root cause: ... Solution: ...",
        ].join("\n");
        break;
      }
      case "capture": {
        if (!activeWorkspace) {
          activeWorkspace = createWorkspace(
            "",
            input.conversationId,
            input.disciplineId,
            input.disciplineName,
            input.projectName ?? null
          );
        }
        const lesson = buildLessonEntry(
          command.payload,
          input.disciplineId,
          input.disciplineName,
          activeWorkspace.projectName
        );
        activeWorkspace.lessons.unshift(lesson);
        activeWorkspace.bestPractices = mergeBestPractices(
          activeWorkspace.lessons,
          activeWorkspace.bestPractices
        );
        activeWorkspace.preventiveActions = suggestPreventiveActions(activeWorkspace.lessons);
        activeWorkspace.recommendations = buildRecommendationRegister(activeWorkspace.lessons);
        updateWorkspace(activeWorkspace);
        lessonAction = formatLessonEntry(lesson);
        break;
      }
      case "summarize": {
        const lessons = activeWorkspace?.lessons ?? [];
        lessonAction = summarizeLessons(lessons);
        break;
      }
      case "best-practices": {
        const practices = activeWorkspace?.bestPractices ?? getSeedBestPractices();
        lessonAction = formatBestPracticeGuideFromWorkspace(practices);
        break;
      }
      case "repeated": {
        const lessons = activeWorkspace?.lessons ?? [];
        lessonAction = formatRepeatedIssues(identifyRepeatedIssues(lessons));
        break;
      }
      case "preventive": {
        const actions = activeWorkspace?.preventiveActions ?? [];
        if (actions.length === 0 && activeWorkspace) {
          activeWorkspace.preventiveActions = suggestPreventiveActions(activeWorkspace.lessons);
          updateWorkspace(activeWorkspace);
        }
        lessonAction = formatPreventiveActionReport(
          activeWorkspace?.preventiveActions ?? []
        );
        break;
      }
      case "similar": {
        const query = command.payload || input.userMessage;
        const allLessons = workspaceStore.flatMap((w) => w.lessons);
        const similar = findSimilarLessons(allLessons, query);
        searchResultCount = similar.length;
        lessonAction = formatSimilarLessons(similar, query);
        break;
      }
      case "knowledge-note": {
        if (!activeWorkspace || activeWorkspace.lessons.length === 0) {
          lessonAction = "No lessons captured. Use 'Capture lesson: ...' first.";
          break;
        }
        const idx = command.payload
          ? activeWorkspace.lessons.findIndex((l) =>
              l.title.toLowerCase().includes(command.payload.toLowerCase())
            )
          : 0;
        const lesson = activeWorkspace.lessons[idx >= 0 ? idx : 0];
        lessonAction = generateKnowledgeNote(lesson);
        break;
      }
      case "report": {
        if (!activeWorkspace) {
          reportAction = "No active lessons workspace. Say 'Start lessons learned [project]'.";
          break;
        }
        activeWorkspace.preventiveActions = suggestPreventiveActions(activeWorkspace.lessons);
        updateWorkspace(activeWorkspace);
        reportAction = formatLessonsLearnedReportForPrompt(
          buildLessonsLearnedReport(activeWorkspace)
        );
        break;
      }
      case "summary": {
        if (!activeWorkspace) {
          lessonAction = "No active lessons workspace.";
          break;
        }
        lessonAction = formatKnowledgeSummary(activeWorkspace);
        break;
      }
      case "recommendations": {
        const recs = activeWorkspace
          ? buildRecommendationRegister(activeWorkspace.lessons)
          : [];
        lessonAction = formatRecommendationRegister(recs);
        break;
      }
      case "search": {
        const category = resolveCategoryFromQuery(command.payload);
        const allLessons = workspaceStore.flatMap((w) => w.lessons);
        const results = searchLessons(allLessons, {
          query: command.payload,
          disciplineId: input.disciplineId,
          category,
        });
        searchResultCount = results.length;
        lessonAction = formatSearchResults(results);
        break;
      }
      case "list": {
        const lessons = activeWorkspace?.lessons ?? workspaceStore.flatMap((w) => w.lessons);
        const category = resolveCategoryFromQuery(command.payload);
        const filtered = category
          ? lessons.filter((l) => l.category === category)
          : lessons;
        searchResultCount = filtered.length;
        lessonAction = formatSearchResults(filtered.slice(0, 20));
        break;
      }
      case "categories": {
        lessonAction = [
          "LESSON CATEGORIES:",
          ...LESSON_CATEGORIES.map((c) => `- ${c.label} (${c.id})`),
        ].join("\n");
        break;
      }
    }
  }

  if (!lessonAction && !reportAction && isKnowledgeQuery(input.userMessage)) {
    if (!activeWorkspace) {
      lessonAction = [
        "Engineering Knowledge Capture & Lessons Learned (EKCLL)",
        "Start with: Start lessons learned [project name]",
        "Then capture: Capture lesson: Problem: ... Solution: ...",
        `Categories: ${LESSON_CATEGORIES.map((c) => c.label).join(", ")}`,
      ].join("\n");
    } else {
      lessonAction = summarizeLessons(activeWorkspace.lessons);
    }
  }

  const active =
    isKnowledgeQuery(input.userMessage) ||
    activeWorkspace !== null ||
    lessonAction !== null ||
    reportAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.enterpriseKnowledgeBaseId) extensionNotes.push(`Enterprise KB: ${extensionHooks.enterpriseKnowledgeBaseId}`);
  if (extensionHooks.corporateKnowledgePortalId) extensionNotes.push(`Corporate Portal: ${extensionHooks.corporateKnowledgePortalId}`);
  if (extensionHooks.pmisKnowledgeManagementId) extensionNotes.push(`PMIS KM: ${extensionHooks.pmisKnowledgeManagementId}`);
  if (extensionHooks.crossProjectLearningId) extensionNotes.push(`Cross-Project: ${extensionHooks.crossProjectLearningId}`);
  if (extensionHooks.aiKnowledgeMiningId) extensionNotes.push(`AI Mining: ${extensionHooks.aiKnowledgeMiningId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Knowledge Capture & Lessons Learned (EKCLL)",
    "========================================",
    "Converts engineering experience into organizational knowledge.",
    "",
    lessonAction ? `KNOWLEDGE:\n${lessonAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeWorkspace
      ? `\nActive workspace: ${activeWorkspace.title} (${activeWorkspace.lessons.length} lessons)`
      : "",
    "",
    "EKCLL COMMANDS:",
    "- Start lessons learned [project] | Capture lesson: Problem: ... Solution: ...",
    "- Summarize lessons | Extract best practices | Repeated issues | Preventive actions report",
    "- Similar lessons [keyword] | Knowledge note | Lessons learned report",
    "- Knowledge summary | Recommendation register | Search lessons [keyword]",
    `- Best practice library: ${BEST_PRACTICE_LIBRARY_SIZE} seed practices`,
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    activeWorkspace,
    lessonAction,
    reportAction,
    searchResultCount,
    promptAugmentation,
    summaryText: [
      active ? "ekcll-active" : "",
      activeWorkspace?.title ?? "",
      searchResultCount > 0 ? `${searchResultCount} results` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatLessonForPrompt = (result: LessonEngineResult): string =>
  result.promptAugmentation;
