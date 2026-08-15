import { Prisma } from "@prisma/client";

import { loadEdmModuleConfig } from "../edm/loadEdmConfig.js";
import type { EdmGlobalSearchFilter } from "../edm/types.js";
import { prisma } from "../prisma/prisma.js";
import { recordEdmAudit } from "./edmAudit.service.js";

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const buildSearchText = (entry: {
  title: string;
  summary: string | null;
  author: string | null;
  organization: string | null;
  source: string | null;
  aiGeneratedSummary: string | null;
  keywords: string[];
  tags: string[];
  standardNumbers: string[];
  projectType: string | null;
  discipline?: { name: string } | null;
  specialization?: { name: string } | null;
  category?: { name: string } | null;
}): string =>
  [
    entry.title,
    entry.summary,
    entry.author,
    entry.organization,
    entry.source,
    entry.aiGeneratedSummary,
    entry.projectType,
    entry.discipline?.name,
    entry.specialization?.name,
    entry.category?.name,
    ...entry.keywords,
    ...entry.tags,
    ...entry.standardNumbers,
  ]
    .filter(Boolean)
    .join(" ");

export const upsertEdmSearchIndex = async (memoryEntryId: string) => {
  const entry = await prisma.edmMemoryEntry.findUnique({
    where: { id: memoryEntryId },
    include: {
      discipline: true,
      specialization: true,
      category: true,
    },
  });

  if (!entry) {
    throw new Error("EDM memory entry not found.");
  }

  const searchText = buildSearchText(entry);
  const keywordTokens = Array.from(
    new Set([
      ...tokenize(searchText),
      ...entry.keywords.map((value) => value.toLowerCase()),
      ...entry.tags.map((value) => value.toLowerCase()),
      ...entry.standardNumbers.map((value) => value.toLowerCase()),
    ])
  );

  return prisma.edmSearchIndex.upsert({
    where: { memoryEntryId },
    update: {
      searchText,
      keywordTokens,
    },
    create: {
      memoryEntryId,
      searchText,
      keywordTokens,
    },
  });
};

export const globalSearchEdm = async (
  filter: EdmGlobalSearchFilter,
  audit?: { actorId?: string; actorEmail?: string; ipAddress?: string; userAgent?: string }
) => {
  const moduleConfig = loadEdmModuleConfig();
  const limit = Math.min(
    filter.limit ?? moduleConfig.search.defaultLimit,
    moduleConfig.search.maxLimit
  );

  const normalizedTags = filter.tags?.map((value) => value.trim()).filter(Boolean);

  if (filter.q?.trim()) {
    const trimmed = filter.q.trim();
    const filters: Prisma.Sql[] = [
      Prisma.sql`to_tsvector('english', idx."searchText") @@ plainto_tsquery('english', ${trimmed})`,
    ];

    if (filter.disciplineId) {
      filters.push(Prisma.sql`entry."disciplineId" = ${filter.disciplineId}`);
    }
    if (filter.categoryId) {
      filters.push(Prisma.sql`entry."categoryId" = ${filter.categoryId}`);
    }
    if (filter.projectType) {
      filters.push(Prisma.sql`entry."projectType" = ${filter.projectType}`);
    }
    if (filter.author) {
      filters.push(
        Prisma.sql`entry."author" ILIKE ${`%${filter.author}%`}`
      );
    }
    if (filter.standardNumber) {
      filters.push(
        Prisma.sql`${filter.standardNumber} = ANY(entry."standardNumbers")`
      );
    }
    if (filter.language) {
      filters.push(Prisma.sql`entry."language" = ${filter.language}`);
    }
    if (filter.status) {
      filters.push(Prisma.sql`entry."status" = ${filter.status}::"EdmMemoryEntryStatus"`);
    }

    const whereClause = Prisma.join(filters, " AND ");

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        disciplineId: string;
        specializationId: string | null;
        categoryId: string;
        rank: number;
      }>
    >`
      SELECT
        entry."id",
        entry."title",
        entry."disciplineId",
        entry."specializationId",
        entry."categoryId",
        ts_rank(
          to_tsvector('english', idx."searchText"),
          plainto_tsquery('english', ${trimmed})
        ) AS rank
      FROM "edm_search_index" idx
      INNER JOIN "edm_memory_entries" entry
        ON entry."id" = idx."memoryEntryId"
      WHERE ${whereClause}
      ORDER BY rank DESC
      LIMIT ${limit}
    `;

    const entryIds = rows.map((row) => row.id);
    const entries = await prisma.edmMemoryEntry.findMany({
      where: { id: { in: entryIds } },
      include: {
        discipline: true,
        specialization: true,
        category: true,
        documentAssets: true,
        outgoingRelations: true,
      },
    });

    const entryMap = new Map(entries.map((entry) => [entry.id, entry]));

    const results = rows
      .map((row) => {
        const entry = entryMap.get(row.id);
        if (!entry) {
          return null;
        }
        return {
          entry,
          rank: Number(row.rank),
          matchType: "keyword" as const,
        };
      })
      .filter((result): result is NonNullable<typeof result> => result !== null);

    await recordEdmAudit({
      action: "SEARCH",
      actorId: audit?.actorId,
      actorEmail: audit?.actorEmail,
      ipAddress: audit?.ipAddress,
      userAgent: audit?.userAgent,
      metadata: {
        mode: "keyword",
        query: trimmed,
        resultCount: results.length,
        filters: JSON.parse(JSON.stringify(filter)),
      },
    });

    return results;
  }

  const entries = await prisma.edmMemoryEntry.findMany({
    where: {
      ...(filter.disciplineId ? { disciplineId: filter.disciplineId } : {}),
      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
      ...(filter.projectType ? { projectType: filter.projectType } : {}),
      ...(filter.author
        ? { author: { contains: filter.author, mode: "insensitive" } }
        : {}),
      ...(filter.standardNumber
        ? { standardNumbers: { has: filter.standardNumber } }
        : {}),
      ...(filter.language ? { language: filter.language } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(normalizedTags?.length ? { tags: { hasSome: normalizedTags } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      discipline: true,
      specialization: true,
      category: true,
      documentAssets: true,
      outgoingRelations: true,
    },
  });

  await recordEdmAudit({
    action: "SEARCH",
    actorId: audit?.actorId,
    actorEmail: audit?.actorEmail,
    ipAddress: audit?.ipAddress,
    userAgent: audit?.userAgent,
    metadata: {
      mode: "facet",
      resultCount: entries.length,
      filters: JSON.parse(JSON.stringify(filter)),
    },
  });

  return entries.map((entry, index) => ({
    entry,
    rank: entries.length - index,
    matchType: "keyword" as const,
  }));
};

export const rebuildAllEdmSearchIndexes = async () => {
  const entries = await prisma.edmMemoryEntry.findMany({ select: { id: true } });

  for (const entry of entries) {
    await upsertEdmSearchIndex(entry.id);
  }

  return entries.length;
};
