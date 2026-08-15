import { getKnowledgeRepository } from "./knowledgeRepository";
import type {
  EngineeringKnowledgeCategory,
  KnowledgeEntry,
  KnowledgeSearchMode,
  KnowledgeSearchOptions,
  KnowledgeSearchResult,
} from "./types";

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[\s,./;:()\-–—]+/)
    .filter((token) => token.length > 1);

const scoreEntry = (
  entry: KnowledgeEntry,
  queryTokens: string[],
  mode: KnowledgeSearchMode
): { score: number; matchedTerms: string[] } => {
  const haystack = [
    entry.title,
    entry.description,
    entry.disciplineName,
    entry.category,
    ...entry.keywords,
  ]
    .join(" ")
    .toLowerCase();

  const matchedTerms: string[] = [];
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      matchedTerms.push(token);
      score += entry.title.toLowerCase().includes(token) ? 3 : 1;
    }
  }

  if (mode === "standards" && entry.category === "engineering-standards") {
    score += 2;
  }
  if (mode === "calculator" && entry.category === "engineering-formulae") {
    score += 2;
  }
  if (mode === "workflow" && entry.category === "engineering-workflows") {
    score += 2;
  }
  if (mode === "category" && matchedTerms.length > 0) {
    score += 1;
  }

  return { score, matchedTerms };
};

const inferSearchMode = (query: string): KnowledgeSearchMode => {
  const normalized = query.toLowerCase();
  if (/\b(is|irc|iec|astm|standard|code)\b/.test(normalized)) return "standards";
  if (/\bcalculate|calculator|formula\b/.test(normalized)) return "calculator";
  if (/\bworkflow|procedure\b/.test(normalized)) return "workflow";
  if (normalized.length < 20) return "topic";
  return "keyword";
};

export const searchKnowledgeNetwork = (
  options: KnowledgeSearchOptions
): KnowledgeSearchResult[] => {
  const query = options.query.trim();
  if (!query) return [];

  const mode = options.mode ?? inferSearchMode(query);
  const limit = options.limit ?? 12;
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) return [];

  let entries = getKnowledgeRepository();

  if (options.disciplineId) {
    entries = entries.filter(
      (entry) => entry.disciplineId === options.disciplineId
    );
  }

  if (options.category) {
    entries = entries.filter((entry) => entry.category === options.category);
  }

  if (mode === "discipline" && options.disciplineId) {
    return entries.slice(0, limit).map((entry) => ({
      entry,
      score: 1,
      matchedTerms: [options.disciplineId!],
    }));
  }

  return entries
    .map((entry) => {
      const { score, matchedTerms } = scoreEntry(entry, queryTokens, mode);
      return { entry, score, matchedTerms };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const searchByDiscipline = (
  disciplineId: string,
  query?: string,
  limit = 12
): KnowledgeSearchResult[] =>
  searchKnowledgeNetwork({
    query: query ?? disciplineId,
    disciplineId,
    mode: "discipline",
    limit,
  });

export const searchByCategory = (
  category: EngineeringKnowledgeCategory,
  query: string,
  disciplineId?: string | null,
  limit = 12
): KnowledgeSearchResult[] =>
  searchKnowledgeNetwork({
    query,
    category,
    disciplineId,
    mode: "category",
    limit,
  });

export const searchStandards = (
  query: string,
  disciplineId?: string | null,
  limit = 8
): KnowledgeSearchResult[] =>
  searchKnowledgeNetwork({
    query,
    disciplineId,
    mode: "standards",
    limit,
  });

export const searchCalculators = (
  query: string,
  disciplineId?: string | null,
  limit = 8
): KnowledgeSearchResult[] =>
  searchKnowledgeNetwork({
    query,
    disciplineId,
    mode: "calculator",
    limit,
  });

export const searchWorkflows = (
  query: string,
  disciplineId?: string | null,
  limit = 8
): KnowledgeSearchResult[] =>
  searchKnowledgeNetwork({
    query,
    disciplineId,
    mode: "workflow",
    limit,
  });
