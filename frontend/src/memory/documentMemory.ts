import { listDocuments } from "../documents/documentMemory";
import type { MemorySearchResult } from "./types";

export const getDocumentMemorySummary = () => {
  const documents = listDocuments();
  return {
    totalDocuments: documents.length,
    recentlyViewed: documents
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 8),
    bookmarked: documents.filter((doc) => doc.tags.includes("bookmarked")),
  };
};

export const searchDocumentMemory = (query: string): MemorySearchResult[] => {
  const normalized = query.toLowerCase();
  return listDocuments()
    .filter((doc) => {
      if (!normalized) return true;
      const haystack = `${doc.name} ${doc.category} ${doc.keywords.join(" ")} ${doc.tags.join(" ")}`.toLowerCase();
      return haystack.includes(normalized);
    })
    .map((doc) => ({
      id: `document-${doc.id}`,
      category: "documents" as const,
      title: doc.name,
      description: `${doc.category} · ${doc.disciplineId}`,
      timestamp: doc.updatedAt,
      resourceId: doc.id,
      route: "/documents",
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
};
