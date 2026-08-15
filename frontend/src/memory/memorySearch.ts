import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";
import { readFavouriteStandardIds } from "../config/standards/standardsPersistence";
import { readFavouriteCalculatorIds } from "../config/calculators/calculatorsPersistence";
import { getUnifiedFavorites } from "../personalization/favoritesManager";
import { searchDocumentMemory } from "./documentMemory";
import { searchProjectMemory } from "./projectMemory";
import type { MemorySearchCategory, MemorySearchResult } from "./types";

const searchConversations = (query: string): MemorySearchResult[] => {
  const normalized = query.toLowerCase();
  try {
    const raw = readPersistedString(PERSISTED_KEYS.chatSessions);
    if (!raw) return [];
    const sessions = JSON.parse(raw) as Array<{
      id: string;
      title: string;
      updatedAt?: number;
      messages?: Array<{ role: string; content: string }>;
    }>;
    return sessions
      .filter((session) => {
        if (!normalized) return true;
        const preview = session.messages?.[0]?.content ?? "";
        return (
          session.title.toLowerCase().includes(normalized) ||
          preview.toLowerCase().includes(normalized)
        );
      })
      .map((session) => ({
        id: `chat-${session.id}`,
        category: "conversations" as const,
        title: session.title || "Untitled chat",
        description: session.messages?.[0]?.content?.slice(0, 100) ?? "",
        timestamp: session.updatedAt ?? Date.now(),
        resourceId: session.id,
        route: "/chat",
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
};

const searchStandardsMemory = (
  query: string,
  disciplineId?: string | null
): MemorySearchResult[] => {
  if (!disciplineId) return [];
  const normalized = query.toLowerCase();
  const ids = [
    ...readFavouriteStandardIds(disciplineId),
    ...readFavouriteCalculatorIds(disciplineId),
  ];
  return ids
    .filter((id) => !normalized || id.toLowerCase().includes(normalized))
    .map((id) => ({
      id: `memory-std-${id}`,
      category: "standards" as const,
      title: id,
      description: "Saved standard or calculator reference",
      timestamp: Date.now(),
      resourceId: id,
    }));
};

export const searchEngineeringMemory = (
  query: string,
  categories?: MemorySearchCategory[] | null,
  disciplineId?: string | null
): MemorySearchResult[] => {
  const allCategories = categories ?? [
    "projects",
    "documents",
    "standards",
    "conversations",
    "reports",
    "calculations",
    "workflows",
  ];

  const results: MemorySearchResult[] = [];

  if (allCategories.includes("projects")) {
    results.push(...searchProjectMemory(query).filter((r) => r.category === "projects"));
  }
  if (allCategories.includes("documents")) {
    results.push(...searchDocumentMemory(query));
  }
  if (allCategories.includes("standards")) {
    results.push(...searchStandardsMemory(query, disciplineId));
    results.push(
      ...getUnifiedFavorites()
        .filter((fav) => fav.type === "standard")
        .filter((fav) => !query || fav.title.toLowerCase().includes(query.toLowerCase()))
        .map((fav) => ({
          id: `fav-${fav.id}`,
          category: "standards" as const,
          title: fav.title,
          description: "Favorite standard",
          timestamp: fav.createdAt,
          resourceId: fav.resourceId,
        }))
    );
  }
  if (allCategories.includes("conversations")) {
    results.push(...searchConversations(query));
  }
  if (allCategories.includes("reports")) {
    results.push(...searchProjectMemory(query).filter((r) => r.category === "reports"));
  }
  if (allCategories.includes("calculations")) {
    results.push(...searchProjectMemory(query).filter((r) => r.category === "calculations"));
  }
  if (allCategories.includes("workflows")) {
    results.push(...searchProjectMemory(query).filter((r) => r.category === "workflows"));
  }

  return results.sort((a, b) => b.timestamp - a.timestamp).slice(0, 24);
};
