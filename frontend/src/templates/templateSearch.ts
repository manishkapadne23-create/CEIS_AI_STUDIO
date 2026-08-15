import {
  findTemplateByTitle,
  listTemplatesForDiscipline,
  resolveDocumentTypeFromText,
  TEMPLATE_LIBRARY,
} from "./templateLibrary";
import type {
  EngineeringTemplate,
  TemplateCategory,
  TemplateSearchQuery,
  TemplateSearchResult,
} from "./types";

const FAVORITES_KEY = "sarathi.templates.favorites";
const RECENT_KEY = "sarathi.templates.recent";

let favoriteIds: Set<string> = new Set();
let recentIds: string[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const favRaw = localStorage.getItem(FAVORITES_KEY);
    favoriteIds = new Set(favRaw ? (JSON.parse(favRaw) as string[]) : []);
    const recentRaw = localStorage.getItem(RECENT_KEY);
    recentIds = recentRaw ? (JSON.parse(recentRaw) as string[]) : [];
  } catch {
    favoriteIds = new Set();
    recentIds = [];
  }
  hydrated = true;
};

const persistFavorites = (): void => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteIds]));
};

const persistRecent = (): void => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds.slice(0, 50)));
};

export const addFavoriteTemplate = (templateId: string): boolean => {
  hydrate();
  if (!TEMPLATE_LIBRARY.some((t) => t.id === templateId)) return false;
  favoriteIds.add(templateId);
  persistFavorites();
  return true;
};

export const removeFavoriteTemplate = (templateId: string): void => {
  hydrate();
  favoriteIds.delete(templateId);
  persistFavorites();
};

export const getFavoriteTemplates = (): EngineeringTemplate[] => {
  hydrate();
  return TEMPLATE_LIBRARY.filter((t) => favoriteIds.has(t.id));
};

export const recordTemplateUsage = (templateId: string): void => {
  hydrate();
  recentIds = [templateId, ...recentIds.filter((id) => id !== templateId)].slice(
    0,
    50
  );
  persistRecent();
};

export const getRecentlyUsedTemplates = (): EngineeringTemplate[] => {
  hydrate();
  return recentIds
    .map((id) => TEMPLATE_LIBRARY.find((t) => t.id === id))
    .filter((t): t is EngineeringTemplate => t !== undefined);
};

export const searchTemplates = (
  query: TemplateSearchQuery
): TemplateSearchResult => {
  hydrate();
  let templates = [...TEMPLATE_LIBRARY];

  if (query.disciplineId) {
    templates = templates.filter((t) => t.disciplineId === query.disciplineId);
  }

  if (query.category) {
    templates = templates.filter((t) => t.category === query.category);
  }

  if (query.documentTypeId) {
    templates = templates.filter(
      (t) => t.documentTypeId === query.documentTypeId
    );
  }

  if (query.favoritesOnly) {
    templates = templates.filter((t) => favoriteIds.has(t.id));
  }

  if (query.recentlyUsedOnly) {
    const recentSet = new Set(recentIds);
    templates = templates.filter((t) => recentSet.has(t.id));
  }

  if (query.keyword) {
    const keyword = query.keyword.toLowerCase();
    templates = templates.filter(
      (t) =>
        t.title.toLowerCase().includes(keyword) ||
        t.description.toLowerCase().includes(keyword) ||
        t.documentTypeName.toLowerCase().includes(keyword) ||
        t.disciplineName.toLowerCase().includes(keyword)
    );
  }

  const limit = query.limit ?? 12;
  return {
    query,
    templates: templates.slice(0, limit),
    totalCount: templates.length,
  };
};

export const searchFromMessage = (
  message: string,
  disciplineId: string | null
): TemplateSearchResult => {
  const documentTypeId = resolveDocumentTypeFromText(message);
  const categoryMatch = message.match(
    /\b(report|checklist|proposal|commercial|planning)\b/i
  );
  const category = categoryMatch?.[1]?.toLowerCase() as
    | TemplateCategory
    | undefined;

  const keywordMatch = message.match(
    /(?:search|find|list)\s+templates?\s*(?:for\s+)?(.+?)(?:\s+in\s+|\s*$)/i
  );

  return searchTemplates({
    keyword: keywordMatch?.[1]?.trim(),
    disciplineId: disciplineId ?? undefined,
    documentTypeId: documentTypeId ?? undefined,
    category,
    favoritesOnly: /\bfavorites?\b/i.test(message),
    recentlyUsedOnly: /\brecent(?:ly)?\s+used\b/i.test(message),
    limit: 10,
  });
};

export const formatSearchResultsForPrompt = (
  result: TemplateSearchResult
): string => {
  if (result.templates.length === 0) {
    return "No templates found. Try 'List templates' or 'Generate inspection report'.";
  }

  const lines = result.templates.map(
    (t, i) =>
      `${i + 1}. ${t.documentTypeName} — ${t.disciplineName}\n   Sections: ${t.sections.slice(0, 4).join(", ")}...`
  );

  return [
    `Found ${result.totalCount} template(s):`,
    ...lines,
    "",
    "Commands: Generate [document type] | Show template [name] | Favorite template [name]",
  ].join("\n");
};

export const isTemplateQuery = (message: string): boolean =>
  /\b(template|templates|generate\s+(?:report|document|checklist|proposal|boq|estimate|sop)|export\s+(?:as\s+)?(?:word|pdf|excel|markdown)|inspection\s+report|design\s+report|method\s+statement|technical\s+report|meeting\s+minutes)\b/i.test(
    message
  );

export const favoriteTemplateByTitle = (title: string): string | null => {
  const template = findTemplateByTitle(title);
  if (!template) return null;
  addFavoriteTemplate(template.id);
  return `Added to favorites: ${template.title}`;
};

export const listTemplatesForCurrentDiscipline = (
  disciplineId: string | null
): string => {
  if (!disciplineId) {
    return `Template library has ${TEMPLATE_LIBRARY.length} templates across ${new Set(TEMPLATE_LIBRARY.map((t) => t.disciplineId)).size} disciplines.`;
  }
  const templates = listTemplatesForDiscipline(disciplineId).slice(0, 10);
  return templates.length > 0
    ? templates.map((t) => `- ${t.documentTypeName}`).join("\n")
    : "No templates for this discipline.";
};
