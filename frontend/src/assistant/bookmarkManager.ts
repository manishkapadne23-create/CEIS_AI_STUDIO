import type { BookmarkType, CreateBookmarkInput, EngineeringBookmark } from "./types";

const STORAGE_KEY = "sarathi.assistant.bookmarks";

let bookmarkStore: EngineeringBookmark[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    bookmarkStore = raw ? (JSON.parse(raw) as EngineeringBookmark[]) : [];
  } catch {
    bookmarkStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkStore.slice(0, 150)));
};

const inferBookmarkType = (title: string): BookmarkType => {
  const text = title.toLowerCase();
  if (/\b(is|irc|iec|astm|standard|code)\b/i.test(text)) return "standard";
  if (/\bcalculat/i.test(text)) return "calculator";
  if (/\breport|dpr\b/i.test(text)) return "report";
  if (/\btemplate\b/i.test(text)) return "template";
  if (/\blearn|course|tutorial\b/i.test(text)) return "learning-resource";
  if (/\bdocument|drawing|pdf\b/i.test(text)) return "document";
  if (/\bchat|conversation\b/i.test(text)) return "ai-conversation";
  return "standard";
};

export const createBookmark = (input: CreateBookmarkInput): EngineeringBookmark => {
  hydrate();
  const bookmark: EngineeringBookmark = {
    id: crypto.randomUUID(),
    type: input.type,
    title: input.title.trim(),
    resourceId: input.resourceId ?? null,
    url: null,
    disciplineId: input.disciplineId ?? null,
    conversationId: input.conversationId ?? null,
    createdAt: Date.now(),
  };
  bookmarkStore.unshift(bookmark);
  persist();
  return bookmark;
};

export const listBookmarks = (type?: BookmarkType): EngineeringBookmark[] => {
  hydrate();
  const items = type
    ? bookmarkStore.filter((b) => b.type === type)
    : bookmarkStore;
  return [...items].sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteBookmark = (bookmarkId: string): boolean => {
  hydrate();
  const before = bookmarkStore.length;
  bookmarkStore = bookmarkStore.filter((b) => b.id !== bookmarkId);
  if (bookmarkStore.length !== before) {
    persist();
    return true;
  }
  return false;
};

export const parseBookmarkCommand = (
  message: string,
  conversationId: string
): { action: string; bookmark: EngineeringBookmark | null } | null => {
  const bookmarkMatch = message.match(
    /^(?:bookmark|save)\s+(.+)$/i
  );
  if (!bookmarkMatch) return null;

  const title = bookmarkMatch[1].trim();
  const bookmark = createBookmark({
    type: inferBookmarkType(title),
    title,
    conversationId:
      inferBookmarkType(title) === "ai-conversation" ? conversationId : null,
  });

  return { action: "bookmark", bookmark };
};
