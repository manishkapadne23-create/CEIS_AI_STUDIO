import { listBookmarks } from "../assistant/bookmarkManager";
import { listNotes } from "../assistant/noteManager";
import { listDocuments } from "../documents/documentMemory";
import { getKnowledgeSearchIndex } from "../knowledge/engine/buildKnowledgeSearchIndex";
import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";
import { TEMPLATE_LIBRARY } from "../templates/templateLibrary";
import { ALL_WORKFLOW_TEMPLATES } from "../workflows/workflowTemplates";
import { ENGINEERING_HUB_SECTIONS } from "../navigation/routeConfig";
import { disciplineIdToSlug } from "../navigation/disciplineSlugs";
import {
  getFavoriteResourceIdSet,
  getFrequentResourceIds,
  getRecentResourceIds,
} from "../personalization/favoritesManager";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { UniversalSearchEntityType, UniversalSearchGroupId } from "./types";

export interface SearchIndexEntry {
  id: string;
  type: UniversalSearchEntityType;
  group: UniversalSearchGroupId;
  title: string;
  subtitle?: string;
  disciplineId: string | null;
  disciplineName: string | null;
  resourceId?: string;
  moduleId?: WorkspaceCategoryId | null;
  keywords: string[];
  deepLink?: string;
  timestamp?: number;
  isFavorite?: boolean;
  isRecent?: boolean;
}

const ENGINEERING_ABBREVIATIONS: Record<string, string[]> = {
  is: ["indian standard", "is code", "is codes"],
  irc: ["indian roads congress", "irc code"],
  nbc: ["national building code", "nbc india"],
  iec: ["international electrotechnical commission"],
  asme: ["american society of mechanical engineers"],
  iso: ["international organization for standardization"],
  nfpa: ["national fire protection association"],
  astm: ["american society for testing and materials"],
  bs: ["british standard"],
  etabs: ["structural analysis software"],
  staad: ["structural analysis design"],
  revit: ["bim software", "building information modeling"],
  autocad: ["cad software", "drafting"],
};

export const expandSearchQuery = (query: string): string[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const expansions = new Set<string>([normalized, ...tokens]);

  for (const token of tokens) {
    const abbreviation = ENGINEERING_ABBREVIATIONS[token];
    if (abbreviation) {
      abbreviation.forEach((value) => expansions.add(value));
    }
  }

  if (/^is\s*\d+/i.test(normalized)) {
    expansions.add("indian standard");
  }
  if (/^irc\s*\d+/i.test(normalized)) {
    expansions.add("indian roads congress");
  }

  return [...expansions];
};

export const entityTypeToGroup = (
  type: UniversalSearchEntityType
): UniversalSearchGroupId => {
  switch (type) {
    case "standard":
      return "standards";
    case "document":
      return "documents";
    case "calculator":
      return "calculators";
    case "learning":
    case "knowledge":
      return "learning";
    case "report":
      return "reports";
    case "conversation":
      return "conversations";
    case "template":
      return "templates";
    case "tool":
      return "tools";
    case "workflow":
      return "workflows";
    case "bookmark":
      return "bookmarks";
    case "note":
      return "notes";
    case "discipline":
      return "disciplines";
    case "engineering-hub":
      return "engineering-hub";
    default:
      return "learning";
  }
};

const readStoredChats = (): Array<{
  id: string;
  title: string;
  messages: Array<{ role: string; content: string }>;
  createdAt: string;
}> => {
  const raw = readPersistedString(PERSISTED_KEYS.chatSessions);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Array<{
      id: string;
      title: string;
      messages: Array<{ role: string; content: string }>;
      createdAt: string;
    }>;
  } catch {
    return [];
  }
};

const readResearchReports = (): Array<{ id: string; title: string; topic?: string }> => {
  const raw = readPersistedString("sarathi.research.workspaces");
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Array<{ id: string; title: string; topic?: string }>;
  } catch {
    return [];
  }
};

let cachedUniversalIndex: SearchIndexEntry[] | null = null;

export const buildUniversalSearchIndex = (): SearchIndexEntry[] => {
  const entries: SearchIndexEntry[] = [];

  for (const catalogEntry of getKnowledgeSearchIndex()) {
    entries.push({
      id: catalogEntry.id,
      type: catalogEntry.type as UniversalSearchEntityType,
      group: entityTypeToGroup(catalogEntry.type as UniversalSearchEntityType),
      title: catalogEntry.title,
      subtitle: catalogEntry.subtitle,
      disciplineId: catalogEntry.disciplineId,
      disciplineName: catalogEntry.disciplineName,
      resourceId: catalogEntry.resourceId,
      moduleId: catalogEntry.moduleId as WorkspaceCategoryId | null,
      keywords: catalogEntry.keywords ?? [],
      deepLink: catalogEntry.moduleId
        ? `/chat/${disciplineIdToSlug(catalogEntry.disciplineId)}/${catalogEntry.moduleId}`
        : `/chat/${disciplineIdToSlug(catalogEntry.disciplineId)}`,
    });
  }

  for (const document of listDocuments()) {
    entries.push({
      id: `document-${document.id}`,
      type: "document",
      group: "documents",
      title: document.name,
      subtitle: `${document.documentType} · ${document.category}`,
      disciplineId: document.disciplineId,
      disciplineName: document.disciplineName ?? null,
      resourceId: document.id,
      moduleId: "documents",
      keywords: [
        document.category,
        document.documentType,
        document.drawingNumber ?? "",
        ...document.keywords,
        ...document.tags,
        ...document.standardsReferenced,
      ].filter(Boolean),
      deepLink: "/documents",
      timestamp: document.updatedAt,
    });
  }

  for (const template of TEMPLATE_LIBRARY) {
    entries.push({
      id: `template-${template.id}`,
      type: "template",
      group: "templates",
      title: template.title,
      subtitle: template.documentTypeName,
      disciplineId: template.disciplineId,
      disciplineName: template.disciplineName,
      resourceId: template.id,
      moduleId: "professional-tools",
      keywords: [template.category, template.description, template.documentTypeName],
      deepLink: `/chat/${disciplineIdToSlug(template.disciplineId)}/professional-tools`,
    });
  }

  for (const workflow of ALL_WORKFLOW_TEMPLATES.filter((item) => item.enabled)) {
    entries.push({
      id: `workflow-${workflow.id}`,
      type: "workflow",
      group: "workflows",
      title: workflow.title,
      subtitle: workflow.overview,
      disciplineId: workflow.disciplineId,
      disciplineName: workflow.disciplineName ?? null,
      resourceId: workflow.id,
      moduleId: "learning-hub",
      keywords: [workflow.category ?? "", workflow.title, workflow.overview],
      deepLink: `/chat/${disciplineIdToSlug(workflow.disciplineId)}/learning-hub`,
    });
  }

  for (const bookmark of listBookmarks()) {
    entries.push({
      id: `bookmark-${bookmark.id}`,
      type: "bookmark",
      group: "bookmarks",
      title: bookmark.title,
      subtitle: bookmark.type.replace("-", " "),
      disciplineId: bookmark.disciplineId,
      disciplineName: null,
      resourceId: bookmark.resourceId ?? bookmark.id,
      keywords: [bookmark.title, bookmark.type],
      deepLink: bookmark.conversationId ? "/chat" : undefined,
      timestamp: bookmark.createdAt,
      isFavorite: true,
    });
  }

  for (const note of listNotes()) {
    entries.push({
      id: `note-${note.id}`,
      type: "note",
      group: "notes",
      title: note.title,
      subtitle: note.category.replace("-", " "),
      disciplineId: note.disciplineId,
      disciplineName: note.disciplineName,
      resourceId: note.id,
      keywords: [note.title, note.content, note.category],
      timestamp: note.updatedAt,
      isFavorite: note.pinned,
    });
  }

  for (const chat of readStoredChats()) {
    const preview = chat.messages
      .slice(-2)
      .map((message) => message.content)
      .join(" ")
      .slice(0, 120);
    entries.push({
      id: `conversation-${chat.id}`,
      type: "conversation",
      group: "conversations",
      title: chat.title,
      subtitle: preview || "AI conversation",
      disciplineId: null,
      disciplineName: null,
      resourceId: chat.id,
      keywords: [chat.title, preview],
      deepLink: "/chat",
      timestamp: new Date(chat.createdAt).getTime(),
    });
  }

  for (const report of readResearchReports()) {
    entries.push({
      id: `report-${report.id}`,
      type: "report",
      group: "reports",
      title: report.title ?? report.topic ?? "Research Report",
      subtitle: report.topic ?? "Engineering research report",
      disciplineId: null,
      disciplineName: null,
      resourceId: report.id,
      keywords: [report.title ?? "", report.topic ?? ""],
      deepLink: "/chat",
    });
  }

  for (const section of ENGINEERING_HUB_SECTIONS) {
    entries.push({
      id: `engineering-hub-${section}`,
      type: "engineering-hub",
      group: "engineering-hub",
      title: section.charAt(0).toUpperCase() + section.slice(1),
      subtitle: "Engineering Hub",
      disciplineId: null,
      disciplineName: null,
      resourceId: section,
      keywords: ["engineering hub", section, "news events jobs webinars"],
      deepLink: `/engineering-hub/${section}`,
    });
  }

  for (const discipline of DISCIPLINE_DEFINITIONS) {
    if (entries.some((entry) => entry.id === `discipline-${discipline.id}`)) {
      continue;
    }
    entries.push({
      id: `discipline-${discipline.id}`,
      type: "discipline",
      group: "disciplines",
      title: discipline.name,
      subtitle: "Engineering discipline",
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      resourceId: discipline.id,
      keywords: [discipline.name, discipline.id],
      deepLink: `/chat/${disciplineIdToSlug(discipline.id)}`,
    });
  }

  const favorites = getFavoriteResourceIdSet();
  const recent = getRecentResourceIds();
  const frequent = getFrequentResourceIds();

  return entries.map((entry) => {
    const resourceKey = entry.resourceId
      ? `${entry.type}:${entry.resourceId}`
      : null;
    return {
      ...entry,
      isFavorite: resourceKey ? favorites.has(resourceKey) : entry.isFavorite,
      isRecent: resourceKey ? recent.has(resourceKey) : entry.isRecent,
      keywords: [
        ...entry.keywords,
        resourceKey && frequent.has(resourceKey) ? "frequently-used" : "",
      ].filter(Boolean),
    };
  });
};

export const getUniversalSearchIndex = (): SearchIndexEntry[] => {
  if (!cachedUniversalIndex) {
    cachedUniversalIndex = buildUniversalSearchIndex();
  }
  return cachedUniversalIndex;
};

export const invalidateUniversalSearchIndex = (): void => {
  cachedUniversalIndex = null;
};

export const getSuggestionCandidates = (): string[] => {
  const index = getUniversalSearchIndex();
  const standards = index
    .filter((entry) => entry.type === "standard")
    .slice(0, 40)
    .map((entry) => entry.title);
  const disciplines = DISCIPLINE_DEFINITIONS.map((discipline) => discipline.name);
  const topics = [
    "structural design",
    "concrete mix design",
    "steel connection design",
    "foundation design",
    "electrical load calculation",
    "HVAC design",
    "project estimation",
    "tender evaluation",
    "IS 456",
    "IS 800",
    "IRC 6",
    "NBC 2016",
    "ETABS",
    "STAAD.Pro",
    "Revit",
    "AutoCAD",
  ];

  return [...new Set([...standards, ...disciplines, ...topics])];
};
