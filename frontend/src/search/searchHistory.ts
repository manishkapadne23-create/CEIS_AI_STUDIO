import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { SearchHistoryEntry } from "./types";

const MAX_HISTORY = 20;

const loadHistory = (): SearchHistoryEntry[] => {
  const raw = readPersistedString(PERSISTED_KEYS.searchHistory);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as SearchHistoryEntry[];
  } catch {
    return [];
  }
};

const saveHistory = (entries: SearchHistoryEntry[]): void => {
  writePersistedString(PERSISTED_KEYS.searchHistory, JSON.stringify(entries.slice(0, MAX_HISTORY)));
};

export const getSearchHistory = (): SearchHistoryEntry[] =>
  loadHistory().sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return b.timestamp - a.timestamp;
  });

export const addSearchHistoryEntry = (
  query: string,
  resultCount?: number
): SearchHistoryEntry => {
  const normalized = query.trim();
  if (!normalized) {
    return {
      id: crypto.randomUUID(),
      query: "",
      timestamp: Date.now(),
      pinned: false,
    };
  }

  const existing = loadHistory();
  const previous = existing.find(
    (entry) => entry.query.toLowerCase() === normalized.toLowerCase()
  );

  const entry: SearchHistoryEntry = {
    id: previous?.id ?? crypto.randomUUID(),
    query: normalized,
    timestamp: Date.now(),
    pinned: previous?.pinned ?? false,
    resultCount,
  };

  const next = [
    entry,
    ...existing.filter((item) => item.id !== entry.id),
  ].slice(0, MAX_HISTORY);

  saveHistory(next);
  return entry;
};

export const pinSearchHistoryEntry = (entryId: string, pinned: boolean): void => {
  const next = loadHistory().map((entry) =>
    entry.id === entryId ? { ...entry, pinned } : entry
  );
  saveHistory(next);
};

export const removeSearchHistoryEntry = (entryId: string): void => {
  saveHistory(loadHistory().filter((entry) => entry.id !== entryId));
};

export const clearSearchHistory = (pinnedOnly = false): void => {
  if (pinnedOnly) {
    saveHistory(loadHistory().filter((entry) => !entry.pinned));
    return;
  }
  saveHistory(loadHistory().filter((entry) => entry.pinned));
};

export const getPinnedSearches = (): SearchHistoryEntry[] =>
  getSearchHistory().filter((entry) => entry.pinned);

export const getRecentSearches = (limit = 8): SearchHistoryEntry[] =>
  getSearchHistory()
    .filter((entry) => !entry.pinned)
    .slice(0, limit);
