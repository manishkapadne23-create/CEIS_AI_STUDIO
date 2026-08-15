import type { UniversalSearchFilters } from "./searchFilters";
import type { UniversalSearchResponse } from "./types";

interface CacheEntry {
  response: UniversalSearchResponse;
  timestamp: number;
}

const CACHE_TTL_MS = 30_000;
const MAX_CACHE_ENTRIES = 50;

const cache = new Map<string, CacheEntry>();

const buildCacheKey = (query: string, filters: UniversalSearchFilters): string =>
  JSON.stringify({
    query: query.trim().toLowerCase(),
    scope: filters.scope,
    disciplineId: filters.disciplineId,
    moduleId: filters.moduleId,
    entityTypes: filters.entityTypes,
    documentType: filters.documentType,
    favoritesOnly: filters.favoritesOnly,
    recentOnly: filters.recentOnly,
    limit: filters.limit,
  });

export const getCachedSearchResults = (
  query: string,
  filters: UniversalSearchFilters
): UniversalSearchResponse | null => {
  const key = buildCacheKey(query, filters);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return { ...entry.response, fromCache: true };
};

export const setCachedSearchResults = (
  query: string,
  filters: UniversalSearchFilters,
  response: UniversalSearchResponse
): void => {
  const key = buildCacheKey(query, filters);
  cache.set(key, { response: { ...response, fromCache: false }, timestamp: Date.now() });

  if (cache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
};

export const invalidateSearchCache = (): void => {
  cache.clear();
};
