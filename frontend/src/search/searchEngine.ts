import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import { getPersonalizationSearchBoost } from "../personalization/recommendationEngine";
import {
  expandSearchQuery,
  getUniversalSearchIndex,
  type SearchIndexEntry,
} from "./searchIndex";
import { getCachedSearchResults, setCachedSearchResults } from "./searchCache";
import { getRelatedSearches, getSuggestedDisciplines } from "./searchSuggestions";
import type { UniversalSearchFilters } from "./searchFilters";
import type {
  UniversalSearchGroup,
  UniversalSearchGroupId,
  UniversalSearchResponse,
  UniversalSearchResult,
} from "./types";

const GROUP_ORDER: UniversalSearchGroupId[] = [
  "standards",
  "documents",
  "calculators",
  "learning",
  "reports",
  "conversations",
  "templates",
  "tools",
  "workflows",
  "bookmarks",
  "notes",
  "disciplines",
  "engineering-hub",
];

const GROUP_LABELS: Record<UniversalSearchGroupId, { label: string; icon: string }> = {
  standards: { label: "Standards & Codes", icon: "📜" },
  documents: { label: "Documents", icon: "📄" },
  calculators: { label: "Calculators", icon: "🔢" },
  learning: { label: "Learning Resources", icon: "🎓" },
  reports: { label: "Reports", icon: "📊" },
  conversations: { label: "AI Conversations", icon: "💬" },
  templates: { label: "Templates", icon: "📋" },
  tools: { label: "Engineering Tools", icon: "🛠️" },
  workflows: { label: "Workflows", icon: "🔄" },
  bookmarks: { label: "Bookmarks", icon: "🔖" },
  notes: { label: "Notes", icon: "📝" },
  disciplines: { label: "Engineering Disciplines", icon: "🏗️" },
  "engineering-hub": { label: "Engineering Hub", icon: "📰" },
};

const CODE_NUMBER_PATTERN = /\b(is|irc|iec|asme|iso|nfpa|astm|bs)\s*[\d:./-]+/i;

const scoreEntry = (
  entry: SearchIndexEntry,
  queryTerms: string[],
  rawQuery: string
): { score: number; matchedTerms: string[] } => {
  const haystack = [
    entry.title,
    entry.subtitle ?? "",
    entry.disciplineName ?? "",
    entry.type,
    ...entry.keywords,
  ]
    .join(" ")
    .toLowerCase();

  const titleLower = entry.title.toLowerCase();
  const normalizedQuery = rawQuery.trim().toLowerCase();
  let score = 0;
  const matchedTerms: string[] = [];

  if (normalizedQuery && titleLower === normalizedQuery) {
    score += 20;
    matchedTerms.push("exact-title");
  } else if (normalizedQuery && titleLower.startsWith(normalizedQuery)) {
    score += 12;
    matchedTerms.push("prefix-title");
  }

  if (CODE_NUMBER_PATTERN.test(rawQuery) && CODE_NUMBER_PATTERN.test(entry.title)) {
    score += 10;
    matchedTerms.push("code-number");
  }

  for (const term of queryTerms) {
    if (!term) {
      continue;
    }
    if (titleLower.includes(term)) {
      score += 6;
      matchedTerms.push(term);
      continue;
    }
    if (haystack.includes(term)) {
      score += 2;
      matchedTerms.push(term);
    }
  }

  if (entry.isFavorite) {
    score += 3;
  }
  if (entry.isRecent) {
    score += 2;
  }

  score += getPersonalizationSearchBoost(
    entry.type,
    entry.resourceId,
    entry.disciplineId
  );

  return { score, matchedTerms: [...new Set(matchedTerms)] };
};

const passesFilters = (
  entry: SearchIndexEntry,
  filters: UniversalSearchFilters
): boolean => {
  if (filters.scope === "workspace" && filters.disciplineId) {
    if (entry.disciplineId && entry.disciplineId !== filters.disciplineId) {
      return false;
    }
  }

  if (filters.disciplineId && entry.disciplineId !== filters.disciplineId) {
    return false;
  }

  if (filters.moduleId && entry.moduleId !== filters.moduleId) {
    return false;
  }

  if (filters.entityTypes?.length && !filters.entityTypes.includes(entry.type)) {
    return false;
  }

  if (filters.documentType && entry.type === "document") {
    const documentType = entry.subtitle?.toLowerCase() ?? "";
    if (!documentType.includes(filters.documentType.toLowerCase())) {
      return false;
    }
  }

  if (filters.standardCode && entry.type === "standard") {
    if (!entry.title.toLowerCase().includes(filters.standardCode.toLowerCase())) {
      return false;
    }
  }

  if (filters.calculatorId && entry.type === "calculator") {
    if (entry.resourceId !== filters.calculatorId) {
      return false;
    }
  }

  if (filters.favoritesOnly && !entry.isFavorite) {
    return false;
  }

  if (filters.recentOnly && !entry.isRecent) {
    return false;
  }

  if (filters.dateFrom && entry.timestamp && entry.timestamp < filters.dateFrom) {
    return false;
  }

  if (filters.dateTo && entry.timestamp && entry.timestamp > filters.dateTo) {
    return false;
  }

  return true;
};

const toSearchResult = (
  entry: SearchIndexEntry,
  score: number,
  matchedTerms: string[]
): UniversalSearchResult => ({
  id: entry.id,
  type: entry.type,
  group: entry.group,
  title: entry.title,
  subtitle: entry.subtitle,
  disciplineId: entry.disciplineId,
  disciplineName: entry.disciplineName,
  resourceId: entry.resourceId,
  moduleId: entry.moduleId,
  score,
  matchedTerms,
  isFavorite: entry.isFavorite,
  isRecent: entry.isRecent,
  deepLink: entry.deepLink,
});

const groupResults = (
  results: UniversalSearchResult[],
  limitPerGroup = 12
): UniversalSearchGroup[] => {
  const grouped = new Map<UniversalSearchGroupId, UniversalSearchResult[]>();

  for (const result of results) {
    const existing = grouped.get(result.group) ?? [];
    if (existing.length < limitPerGroup) {
      existing.push(result);
      grouped.set(result.group, existing);
    }
  }

  return GROUP_ORDER.filter((groupId) => grouped.has(groupId)).map((groupId) => ({
    id: groupId,
    label: GROUP_LABELS[groupId].label,
    icon: GROUP_LABELS[groupId].icon,
    results: grouped.get(groupId) ?? [],
  }));
};

export const runUniversalSearch = (
  query: string,
  filters: UniversalSearchFilters
): UniversalSearchResponse => {
  const normalizedQuery = query.trim();
  const cached = getCachedSearchResults(normalizedQuery, filters);
  if (cached) {
    return cached;
  }

  if (!normalizedQuery) {
    return {
      query: "",
      normalizedQuery: "",
      groups: [],
      totalCount: 0,
      relatedSearches: [],
      suggestedDisciplines: getSuggestedDisciplines(),
      fromCache: false,
    };
  }

  const queryTerms = expandSearchQuery(normalizedQuery);
  const limit = filters.limit ?? 60;

  const scored = getUniversalSearchIndex()
    .filter((entry) => passesFilters(entry, filters))
    .map((entry) => {
      const { score, matchedTerms } = scoreEntry(entry, queryTerms, normalizedQuery);
      return { entry, score, matchedTerms };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry, score, matchedTerms }) => toSearchResult(entry, score, matchedTerms));

  const groups = groupResults(scored);
  const response: UniversalSearchResponse = {
    query: normalizedQuery,
    normalizedQuery: normalizedQuery.toLowerCase(),
    groups,
    totalCount: scored.length,
    relatedSearches: scored.length === 0 ? getRelatedSearches(normalizedQuery) : [],
    suggestedDisciplines:
      scored.length === 0
        ? DISCIPLINE_DEFINITIONS.slice(0, 6).map((discipline) => discipline.name)
        : [],
    fromCache: false,
  };

  setCachedSearchResults(normalizedQuery, filters, response);
  return response;
};

export const runDropdownSearch = (
  query: string,
  filters: UniversalSearchFilters
): UniversalSearchResult[] => {
  const response = runUniversalSearch(query, {
    ...filters,
    limit: filters.dropdownLimit ?? 12,
  });

  return response.groups.flatMap((group) => group.results).slice(0, filters.dropdownLimit ?? 12);
};
