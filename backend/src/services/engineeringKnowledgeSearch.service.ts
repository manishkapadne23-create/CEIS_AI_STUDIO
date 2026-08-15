import { Prisma } from "@prisma/client";
import type { EngineeringKnowledgeItem } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";

export interface KnowledgeSearchOptions {
  disciplineId?: string;
  specializationId?: string;
  categoryId?: string;
  language?: string;
  limit?: number;
}

export interface KnowledgeSearchResult {
  knowledgeItemId: string;
  title: string;
  disciplineId: string;
  specializationId: string | null;
  categoryId: string;
  rank: number;
  matchType: "keyword" | "semantic";
}

const tokenizeQuery = (query: string): string[] =>
  query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const buildSearchText = (item: {
  title: string;
  content: string | null;
  keywords: string[];
  tags: string[];
  discipline?: { name: string } | null;
  specialization?: { name: string } | null;
  category?: { name: string } | null;
}): string =>
  [
    item.title,
    item.content,
    item.discipline?.name,
    item.specialization?.name,
    item.category?.name,
    ...item.keywords,
    ...item.tags,
  ]
    .filter(Boolean)
    .join(" ");

export const upsertKnowledgeSearchIndex = async (
  knowledgeItemId: string
): Promise<void> => {
  const item = await prisma.engineeringKnowledgeItem.findUnique({
    where: { id: knowledgeItemId },
    include: {
      discipline: true,
      specialization: true,
      category: true,
      searchIndex: true,
    },
  });

  if (!item) {
    throw new Error("Knowledge item not found.");
  }

  const searchText = buildSearchText(item);
  const keywordTokens = Array.from(
    new Set([
      ...tokenizeQuery(searchText),
      ...item.keywords.map((value) => value.toLowerCase()),
      ...item.tags.map((value) => value.toLowerCase()),
    ])
  );

  await prisma.engineeringKnowledgeSearchIndex.upsert({
    where: { knowledgeItemId: item.id },
    update: {
      searchText,
      keywordTokens,
    },
    create: {
      knowledgeItemId: item.id,
      searchText,
      keywordTokens,
    },
  });
};

export const indexKnowledgeItemEmbeddings = async (
  knowledgeItemId: string,
  embedding: number[],
  embeddingModel: string
): Promise<void> => {
  await upsertKnowledgeSearchIndex(knowledgeItemId);

  await prisma.engineeringKnowledgeSearchIndex.update({
    where: { knowledgeItemId },
    data: {
      embedding,
      embeddingModel,
    },
  });
};

export const searchEngineeringKnowledgeByKeyword = async (
  query: string,
  options: KnowledgeSearchOptions = {}
): Promise<KnowledgeSearchResult[]> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const limit = options.limit ?? 20;
  const tokens = tokenizeQuery(trimmed);

  const filters: Prisma.Sql[] = [
    Prisma.sql`to_tsvector('english', idx."searchText") @@ plainto_tsquery('english', ${trimmed})`,
  ];

  if (options.disciplineId) {
    filters.push(Prisma.sql`item."disciplineId" = ${options.disciplineId}`);
  }
  if (options.specializationId) {
    filters.push(Prisma.sql`item."specializationId" = ${options.specializationId}`);
  }
  if (options.categoryId) {
    filters.push(Prisma.sql`item."categoryId" = ${options.categoryId}`);
  }
  if (options.language) {
    filters.push(Prisma.sql`item."language" = ${options.language}`);
  }

  const whereClause = Prisma.join(filters, " AND ");

  const rows = await prisma.$queryRaw<
    Array<{
      knowledgeItemId: string;
      title: string;
      disciplineId: string;
      specializationId: string | null;
      categoryId: string;
      rank: number;
    }>
  >`
    SELECT
      item."id" AS "knowledgeItemId",
      item."title",
      item."disciplineId",
      item."specializationId",
      item."categoryId",
      ts_rank(
        to_tsvector('english', idx."searchText"),
        plainto_tsquery('english', ${trimmed})
      ) AS rank
    FROM "engineering_knowledge_search_index" idx
    INNER JOIN "engineering_knowledge_items" item
      ON item."id" = idx."knowledgeItemId"
    WHERE ${whereClause}
    ORDER BY rank DESC
    LIMIT ${limit}
  `;

  if (rows.length > 0) {
    return rows.map((row) => ({
      ...row,
      rank: Number(row.rank),
      matchType: "keyword" as const,
    }));
  }

  if (tokens.length === 0) {
    return [];
  }

  const fallback = await prisma.engineeringKnowledgeSearchIndex.findMany({
    where: {
      keywordTokens: { hasSome: tokens },
      knowledgeItem: {
        ...(options.disciplineId ? { disciplineId: options.disciplineId } : {}),
        ...(options.specializationId
          ? { specializationId: options.specializationId }
          : {}),
        ...(options.categoryId ? { categoryId: options.categoryId } : {}),
        ...(options.language ? { language: options.language } : {}),
      },
    },
    take: limit,
    include: {
      knowledgeItem: true,
    },
  });

  return fallback.map((entry, index) => ({
    knowledgeItemId: entry.knowledgeItemId,
    title: entry.knowledgeItem.title,
    disciplineId: entry.knowledgeItem.disciplineId,
    specializationId: entry.knowledgeItem.specializationId,
    categoryId: entry.knowledgeItem.categoryId,
    rank: fallback.length - index,
    matchType: "keyword" as const,
  }));
};

const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const searchEngineeringKnowledgeBySemantic = async (
  queryEmbedding: number[],
  options: KnowledgeSearchOptions = {}
): Promise<KnowledgeSearchResult[]> => {
  if (queryEmbedding.length === 0) {
    return [];
  }

  const limit = options.limit ?? 20;

  const indexed = await prisma.engineeringKnowledgeSearchIndex.findMany({
    where: {
      embeddingModel: { not: null },
      knowledgeItem: {
        ...(options.disciplineId ? { disciplineId: options.disciplineId } : {}),
        ...(options.specializationId
          ? { specializationId: options.specializationId }
          : {}),
        ...(options.categoryId ? { categoryId: options.categoryId } : {}),
        ...(options.language ? { language: options.language } : {}),
      },
    },
    include: { knowledgeItem: true },
    take: Math.max(limit * 10, 100),
  });

  const scored: KnowledgeSearchResult[] = [];

  for (const entry of indexed) {
    if (!Array.isArray(entry.embedding)) {
      continue;
    }

    const vector = entry.embedding.filter(
      (value): value is number => typeof value === "number"
    );

    const rank = cosineSimilarity(queryEmbedding, vector);
    if (rank <= 0) {
      continue;
    }

    scored.push({
      knowledgeItemId: entry.knowledgeItemId,
      title: entry.knowledgeItem.title,
      disciplineId: entry.knowledgeItem.disciplineId,
      specializationId: entry.knowledgeItem.specializationId,
      categoryId: entry.knowledgeItem.categoryId,
      rank,
      matchType: "semantic",
    });
  }

  return scored.sort((left, right) => right.rank - left.rank).slice(0, limit);
};

export const searchEngineeringKnowledge = async (input: {
  query?: string;
  queryEmbedding?: number[];
  options?: KnowledgeSearchOptions;
}): Promise<KnowledgeSearchResult[]> => {
  const keywordResults = input.query
    ? await searchEngineeringKnowledgeByKeyword(input.query, input.options)
    : [];

  const semanticResults = input.queryEmbedding
    ? await searchEngineeringKnowledgeBySemantic(
        input.queryEmbedding,
        input.options
      )
    : [];

  const merged = new Map<string, KnowledgeSearchResult>();

  for (const result of [...semanticResults, ...keywordResults]) {
    const existing = merged.get(result.knowledgeItemId);
    if (!existing || result.rank > existing.rank) {
      merged.set(result.knowledgeItemId, result);
    }
  }

  return Array.from(merged.values()).sort((left, right) => right.rank - left.rank);
};

export const rebuildAllKnowledgeSearchIndexes = async (): Promise<number> => {
  const items = await prisma.engineeringKnowledgeItem.findMany({
    select: { id: true },
  });

  for (const item of items) {
    await upsertKnowledgeSearchIndex(item.id);
  }

  return items.length;
};

export type { EngineeringKnowledgeItem };
