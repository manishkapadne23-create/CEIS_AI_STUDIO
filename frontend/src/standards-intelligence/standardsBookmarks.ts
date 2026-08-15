import {
  readFavouriteStandardIds,
  readRecentlyViewedStandardIds,
  toggleFavouriteStandard,
  recordStandardView,
} from "../config/standards/standardsPersistence";
import type { FavoriteClauseBookmark } from "./types";

const PINNED_KEY = "sarathi.standards.pinned";
const CLAUSE_FAVORITES_KEY = "sarathi.standards.clauseFavorites";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
};

export const readPinnedStandards = (disciplineId: string): string[] =>
  readJson<string[]>(`${PINNED_KEY}.${disciplineId}`, []);

export const togglePinnedStandard = (
  disciplineId: string,
  standardId: string
): string[] => {
  const current = readPinnedStandards(disciplineId);
  const next = current.includes(standardId)
    ? current.filter((id) => id !== standardId)
    : [standardId, ...current].slice(0, 20);
  writeJson(`${PINNED_KEY}.${disciplineId}`, next);
  return next;
};

export const readFavoriteClauses = (disciplineId: string): FavoriteClauseBookmark[] =>
  readJson<FavoriteClauseBookmark[]>(`${CLAUSE_FAVORITES_KEY}.${disciplineId}`, []);

export const toggleFavoriteClause = (
  disciplineId: string,
  bookmark: Omit<FavoriteClauseBookmark, "createdAt">
): FavoriteClauseBookmark[] => {
  const current = readFavoriteClauses(disciplineId);
  const exists = current.some((entry) => entry.clauseId === bookmark.clauseId);
  const next = exists
    ? current.filter((entry) => entry.clauseId !== bookmark.clauseId)
    : [{ ...bookmark, createdAt: Date.now() }, ...current].slice(0, 30);
  writeJson(`${CLAUSE_FAVORITES_KEY}.${disciplineId}`, next);
  return next;
};

export const isClauseFavorite = (
  disciplineId: string,
  clauseId: string
): boolean =>
  readFavoriteClauses(disciplineId).some((entry) => entry.clauseId === clauseId);

export {
  readFavouriteStandardIds,
  readRecentlyViewedStandardIds,
  toggleFavouriteStandard,
  recordStandardView,
};
