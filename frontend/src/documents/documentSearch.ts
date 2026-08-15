import { listDocuments } from "./documentMemory";
import type { DocumentSearchOptions, DocumentSearchResult } from "./types";

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[\s,./;:()\-–—]+/)
    .filter((token) => token.length > 1);

export const searchDocuments = (
  options: DocumentSearchOptions
): DocumentSearchResult[] => {
  const query = options.query.trim();
  if (!query) return [];

  const limit = options.limit ?? 12;
  const queryTokens = tokenize(query);
  let documents = listDocuments();

  if (options.disciplineId) {
    documents = documents.filter(
      (doc) => doc.disciplineId === options.disciplineId
    );
  }

  if (options.projectId) {
    documents = documents.filter((doc) =>
      doc.projectIds.includes(options.projectId!)
    );
  }

  if (options.category) {
    documents = documents.filter((doc) => doc.category === options.category);
  }

  if (options.drawingNumber) {
    const normalized = options.drawingNumber.toLowerCase();
    documents = documents.filter(
      (doc) => doc.drawingNumber?.toLowerCase().includes(normalized)
    );
  }

  if (options.standardNumber) {
    const normalized = options.standardNumber.toUpperCase();
    documents = documents.filter((doc) =>
      doc.standardsReferenced.some((std) =>
        std.toUpperCase().includes(normalized)
      )
    );
  }

  return documents
    .map((document) => {
      const haystack = [
        document.name,
        document.category,
        document.documentType,
        document.drawingNumber ?? "",
        document.specificationSection ?? "",
        document.author ?? "",
        ...document.keywords,
        ...document.tags,
        ...document.standardsReferenced,
        ...document.projectNames,
        document.contentPreview ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchedFields: string[] = [];
      let score = 0;

      if (document.name.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
        matchedFields.push("name");
      }

      for (const token of queryTokens) {
        if (haystack.includes(token)) {
          score += document.name.toLowerCase().includes(token) ? 3 : 1;
          matchedFields.push(token);
        }
      }

      for (const standard of document.standardsReferenced) {
        if (standard.toLowerCase().includes(query.toLowerCase())) {
          score += 4;
          matchedFields.push(`standard:${standard}`);
        }
      }

      return { document, score, matchedFields: [...new Set(matchedFields)] };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const searchByKeyword = (
  keyword: string,
  disciplineId?: string | null,
  limit = 10
): DocumentSearchResult[] =>
  searchDocuments({ query: keyword, disciplineId, limit });

export const searchByDocumentName = (
  name: string,
  limit = 10
): DocumentSearchResult[] => searchDocuments({ query: name, limit });

export const searchByStandardNumber = (
  standardNumber: string,
  disciplineId?: string | null,
  limit = 10
): DocumentSearchResult[] =>
  searchDocuments({
    query: standardNumber,
    standardNumber,
    disciplineId,
    limit,
  });

export const searchByDrawingNumber = (
  drawingNumber: string,
  limit = 10
): DocumentSearchResult[] =>
  searchDocuments({ query: drawingNumber, drawingNumber, limit });

export const searchByProject = (
  projectId: string,
  query = "",
  limit = 10
): DocumentSearchResult[] =>
  searchDocuments({ query: query || projectId, projectId, limit });
