import { listBookmarks as listAssistantBookmarks } from "../assistant/bookmarkManager";
import {
  readFavouriteCalculatorIds,
  readRecentlyUsedCalculatorIds,
} from "../config/calculators/calculatorsPersistence";
import { getCalculatorsCatalogByDisciplineId } from "../config/calculators";
import {
  readFavouriteStandardIds,
  readRecentlyViewedStandardIds,
} from "../config/standards/standardsPersistence";
import { getStandardsCatalogByDisciplineId } from "../config/standards";
import { listDocuments } from "../documents/documentMemory";
import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import { invalidateSearchCache } from "../search/searchCache";
import { invalidateUniversalSearchIndex } from "../search/searchIndex";
import { getFavoriteTemplates } from "../templates/templateSearch";
import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";
import type { FavoriteItem, FavoriteResourceType } from "./types";

const FAVORITES_KEY = "sarathi.personalization.favorites";

const loadFavorites = (): FavoriteItem[] => {
  const raw = readPersistedString(FAVORITES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
};

const saveFavorites = (items: FavoriteItem[]): void => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items.slice(0, 200)));
  invalidateUniversalSearchIndex();
  invalidateSearchCache();
};

const getAllDisciplineIds = (): string[] =>
  DISCIPLINE_DEFINITIONS.map((discipline) => discipline.id);

const getActivityResourceIds = (): string[] => {
  const raw = readPersistedString(PERSISTED_KEYS.activityLog);
  if (!raw) {
    return [];
  }
  try {
    const activities = JSON.parse(raw) as Array<{
      type: string;
      resourceId: string | null;
    }>;
    return activities
      .filter((item) => item.resourceId)
      .map((item) => `${item.type}:${item.resourceId}`);
  } catch {
    return [];
  }
};

export const getUnifiedFavorites = (): FavoriteItem[] => {
  const stored = loadFavorites();
  const aggregated: FavoriteItem[] = [...stored];

  for (const disciplineId of getAllDisciplineIds()) {
    const standardsCatalog = getStandardsCatalogByDisciplineId(disciplineId);
    for (const standardId of readFavouriteStandardIds(disciplineId)) {
      const standard = standardsCatalog?.standards.find((entry) => entry.id === standardId);
      aggregated.push({
        id: `standard-${disciplineId}-${standardId}`,
        type: "standard",
        title: standard?.codeNumber ?? standardId,
        resourceId: standardId,
        disciplineId,
        createdAt: Date.now(),
      });
    }

    const calculatorsCatalog = getCalculatorsCatalogByDisciplineId(disciplineId);
    for (const calculatorId of readFavouriteCalculatorIds(disciplineId)) {
      const calculator = calculatorsCatalog?.calculators.find(
        (entry) => entry.id === calculatorId
      );
      aggregated.push({
        id: `calculator-${disciplineId}-${calculatorId}`,
        type: "calculator",
        title: calculator?.name ?? calculatorId,
        resourceId: calculatorId,
        disciplineId,
        createdAt: Date.now(),
      });
    }
  }

  for (const template of getFavoriteTemplates()) {
    aggregated.push({
      id: `template-${template.id}`,
      type: "template",
      title: template.title,
      resourceId: template.id,
      disciplineId: template.disciplineId,
      createdAt: Date.now(),
    });
  }

  for (const bookmark of listAssistantBookmarks()) {
    aggregated.push({
      id: `bookmark-${bookmark.id}`,
      type:
        bookmark.type === "ai-conversation"
          ? "conversation"
          : (bookmark.type as FavoriteResourceType),
      title: bookmark.title,
      resourceId: bookmark.resourceId ?? bookmark.id,
      disciplineId: bookmark.disciplineId,
      createdAt: bookmark.createdAt,
    });
  }

  const deduped = new Map<string, FavoriteItem>();
  for (const item of aggregated) {
    const key = `${item.type}:${item.resourceId}:${item.disciplineId ?? ""}`;
    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  }

  return [...deduped.values()].sort((a, b) => b.createdAt - a.createdAt);
};

export const addFavorite = (
  item: Omit<FavoriteItem, "id" | "createdAt">
): FavoriteItem => {
  const entry: FavoriteItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const next = [
    entry,
    ...loadFavorites().filter(
      (favorite) =>
        !(
          favorite.type === entry.type &&
          favorite.resourceId === entry.resourceId &&
          favorite.disciplineId === entry.disciplineId
        )
    ),
  ];
  saveFavorites(next);
  return entry;
};

export const removeFavorite = (favoriteId: string): void => {
  saveFavorites(loadFavorites().filter((item) => item.id !== favoriteId));
};

export const isFavoriteResource = (
  type: FavoriteResourceType,
  resourceId: string,
  disciplineId?: string | null
): boolean =>
  getUnifiedFavorites().some(
    (item) =>
      item.type === type &&
      item.resourceId === resourceId &&
      (disciplineId ? item.disciplineId === disciplineId : true)
  );

export const getFavoriteResourceIdSet = (): Set<string> =>
  new Set(getUnifiedFavorites().map((item) => `${item.type}:${item.resourceId}`));

export const getRecentResourceIds = (): Set<string> => {
  const ids = new Set<string>();

  for (const disciplineId of getAllDisciplineIds()) {
    readRecentlyViewedStandardIds(disciplineId).forEach((id) => ids.add(`standard:${id}`));
    readRecentlyUsedCalculatorIds(disciplineId).forEach((id) => ids.add(`calculator:${id}`));
  }

  const chatsRaw = readPersistedString(PERSISTED_KEYS.chatSessions);
  if (chatsRaw) {
    try {
      const chats = JSON.parse(chatsRaw) as Array<{ id: string }>;
      chats.slice(0, 8).forEach((chat) => ids.add(`conversation:${chat.id}`));
    } catch {
      // ignore
    }
  }

  getActivityResourceIds().forEach((id) => ids.add(id));
  return ids;
};

export const getFrequentResourceIds = (): Set<string> => {
  const ids = new Set<string>();
  for (const disciplineId of getAllDisciplineIds()) {
    readRecentlyViewedStandardIds(disciplineId)
      .slice(0, 4)
      .forEach((id) => ids.add(`standard:${id}`));
    readRecentlyUsedCalculatorIds(disciplineId)
      .slice(0, 4)
      .forEach((id) => ids.add(`calculator:${id}`));
  }
  listDocuments()
    .slice(0, 6)
    .forEach((doc) => ids.add(`document:${doc.id}`));
  return ids;
};
