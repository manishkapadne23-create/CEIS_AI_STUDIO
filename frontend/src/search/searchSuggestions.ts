import { getRecentSearches, getPinnedSearches } from "./searchHistory";
import { getSuggestionCandidates } from "./searchIndex";

export interface SearchSuggestion {
  text: string;
  source: "recent" | "pinned" | "catalog" | "standard" | "topic";
  score: number;
}

export const getSearchSuggestions = (
  query: string,
  limit = 8
): SearchSuggestion[] => {
  const normalized = query.trim().toLowerCase();
  const suggestions: SearchSuggestion[] = [];

  for (const entry of getPinnedSearches()) {
    if (!normalized || entry.query.toLowerCase().includes(normalized)) {
      suggestions.push({
        text: entry.query,
        source: "pinned",
        score: normalized && entry.query.toLowerCase().startsWith(normalized) ? 100 : 80,
      });
    }
  }

  for (const entry of getRecentSearches(10)) {
    if (!normalized || entry.query.toLowerCase().includes(normalized)) {
      suggestions.push({
        text: entry.query,
        source: "recent",
        score: normalized && entry.query.toLowerCase().startsWith(normalized) ? 90 : 70,
      });
    }
  }

  for (const candidate of getSuggestionCandidates()) {
    const candidateLower = candidate.toLowerCase();
    if (!normalized) {
      suggestions.push({
        text: candidate,
        source: candidate.match(/^is\s|irc|nbc|iec/i) ? "standard" : "catalog",
        score: 40,
      });
      continue;
    }

    if (candidateLower.startsWith(normalized)) {
      suggestions.push({
        text: candidate,
        source: candidate.match(/^is\s|irc|nbc|iec/i) ? "standard" : "catalog",
        score: candidateLower === normalized ? 95 : 75,
      });
      continue;
    }

    if (candidateLower.includes(normalized)) {
      suggestions.push({
        text: candidate,
        source: "topic",
        score: 55,
      });
    }
  }

  const deduped = new Map<string, SearchSuggestion>();
  for (const suggestion of suggestions.sort((a, b) => b.score - a.score)) {
    const key = suggestion.text.toLowerCase();
    if (!deduped.has(key)) {
      deduped.set(key, suggestion);
    }
  }

  return [...deduped.values()].slice(0, limit);
};

export const getRelatedSearches = (query: string): string[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const related = getSuggestionCandidates()
    .filter((candidate) => {
      const lower = candidate.toLowerCase();
      return lower !== normalized && (lower.includes(normalized) || normalized.includes(lower));
    })
    .slice(0, 5);

  if (related.length > 0) {
    return related;
  }

  if (/is|irc|standard|code/i.test(normalized)) {
    return ["IS 456", "IS 800", "IRC 6", "NBC 2016"];
  }

  if (/calculat|design|struct/i.test(normalized)) {
    return ["structural design", "concrete mix design", "foundation design"];
  }

  return ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"];
};

export const getSuggestedDisciplines = (): string[] =>
  getSuggestionCandidates()
    .filter((candidate) => candidate.includes("Engineering"))
    .slice(0, 6);
