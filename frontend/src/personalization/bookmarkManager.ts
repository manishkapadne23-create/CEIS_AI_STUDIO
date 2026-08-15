import {
  createBookmark,
  deleteBookmark,
  listBookmarks,
} from "../assistant/bookmarkManager";
import type { BookmarkType, EngineeringBookmark } from "../assistant/types";
import { readPersistedString, writePersistedString } from "../utils/persistedState";
import type { BookmarkCollection } from "./types";

const COLLECTIONS_KEY = "sarathi.personalization.bookmarkCollections";

const loadCollections = (): BookmarkCollection[] => {
  const raw = readPersistedString(COLLECTIONS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as BookmarkCollection[];
  } catch {
    return [];
  }
};

const saveCollections = (collections: BookmarkCollection[]): void => {
  writePersistedString(COLLECTIONS_KEY, JSON.stringify(collections));
};

export const listBookmarkCollections = (): BookmarkCollection[] =>
  loadCollections().sort((a, b) => b.updatedAt - a.updatedAt);

export const createBookmarkCollection = (
  name: string,
  folder: string | null = null
): BookmarkCollection => {
  const collection: BookmarkCollection = {
    id: crypto.randomUUID(),
    name,
    folder,
    bookmarkIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveCollections([collection, ...loadCollections()]);
  return collection;
};

export const addBookmarkToCollection = (
  collectionId: string,
  bookmarkId: string
): BookmarkCollection | null => {
  const collections = loadCollections();
  const index = collections.findIndex((collection) => collection.id === collectionId);
  if (index < 0) {
    return null;
  }
  const collection = collections[index];
  const bookmarkIds = [...new Set([...collection.bookmarkIds, bookmarkId])];
  collections[index] = {
    ...collection,
    bookmarkIds,
    updatedAt: Date.now(),
  };
  saveCollections(collections);
  return collections[index];
};

export const getQuickAccessBookmarks = (limit = 8): EngineeringBookmark[] =>
  listBookmarks().slice(0, limit);

export const createPersonalBookmark = (input: {
  type: BookmarkType;
  title: string;
  resourceId?: string | null;
  disciplineId?: string | null;
  conversationId?: string | null;
  collectionId?: string | null;
  folder?: string | null;
}): EngineeringBookmark => {
  const bookmark = createBookmark({
    type: input.type,
    title: input.title,
    resourceId: input.resourceId ?? null,
    disciplineId: input.disciplineId ?? null,
    conversationId: input.conversationId ?? null,
  });

  if (input.collectionId) {
    addBookmarkToCollection(input.collectionId, bookmark.id);
  } else if (input.folder) {
    const existing = loadCollections().find(
      (collection) => collection.folder === input.folder
    );
    const collection =
      existing ?? createBookmarkCollection(input.folder, input.folder);
    addBookmarkToCollection(collection.id, bookmark.id);
  }

  return bookmark;
};

export const removePersonalBookmark = (bookmarkId: string): boolean => {
  const collections = loadCollections().map((collection) => ({
    ...collection,
    bookmarkIds: collection.bookmarkIds.filter((id) => id !== bookmarkId),
    updatedAt: Date.now(),
  }));
  saveCollections(collections);
  return deleteBookmark(bookmarkId);
};

export const getBookmarksByFolder = (): Record<string, EngineeringBookmark[]> => {
  const bookmarks = listBookmarks();
  const collections = listBookmarkCollections();
  const grouped: Record<string, EngineeringBookmark[]> = {
    "Quick Access": getQuickAccessBookmarks(),
  };

  for (const collection of collections) {
    const folder = collection.folder ?? collection.name;
    grouped[folder] = collection.bookmarkIds
      .map((id) => bookmarks.find((bookmark) => bookmark.id === id))
      .filter((bookmark): bookmark is EngineeringBookmark => bookmark !== undefined);
  }

  return grouped;
};
