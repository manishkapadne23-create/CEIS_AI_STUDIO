import type { Prisma } from "@prisma/client";

import { getEdmDocumentTypeById } from "../edm/loadEdmConfig.js";
import type {
  CreateEdmEntryInput,
  EdmAuditContext,
  ListEdmEntriesFilter,
  UpdateEdmEntryInput,
} from "../edm/types.js";
import { prisma } from "../prisma/prisma.js";
import { recordEdmAudit } from "./edmAudit.service.js";
import { registerEdmEmbedding } from "./edmEmbedding.service.js";
import { upsertEdmSearchIndex } from "./edmSearch.service.js";

const entryInclude = {
  discipline: true,
  specialization: true,
  category: true,
  documentAssets: true,
  outgoingRelations: {
    orderBy: { displayOrder: "asc" },
  },
  incomingRelations: true,
  searchIndex: true,
  embedding: true,
} satisfies Prisma.EdmMemoryEntryInclude;

const parseDate = (value?: Date | string | null) => {
  if (!value) {
    return null;
  }
  return value instanceof Date ? value : new Date(value);
};

const validateDocumentAssets = (
  assets: CreateEdmEntryInput["documentAssets"] | UpdateEdmEntryInput["documentAssets"]
) => {
  if (!assets?.length) {
    return;
  }

  for (const asset of assets) {
    if (!getEdmDocumentTypeById(asset.documentTypeId)) {
      throw new Error(`Unsupported document type: ${asset.documentTypeId}`);
    }
  }
};

const syncRelations = async (
  entryId: string,
  relations: CreateEdmEntryInput["relations"]
) => {
  if (!relations) {
    return;
  }

  await prisma.edmMemoryRelation.deleteMany({
    where: { sourceEntryId: entryId },
  });

  if (relations.length === 0) {
    return;
  }

  await prisma.edmMemoryRelation.createMany({
    data: relations.map((relation, index) => ({
      sourceEntryId: entryId,
      relationType: relation.relationType,
      targetEntryId: relation.targetEntryId ?? null,
      externalRef: relation.externalRef ?? null,
      label: relation.label ?? null,
      metadata: relation.metadata ?? undefined,
      displayOrder: relation.displayOrder ?? index,
    })),
  });
};

const syncDocumentAssets = async (
  entryId: string,
  assets: CreateEdmEntryInput["documentAssets"]
) => {
  if (!assets) {
    return;
  }

  await prisma.edmDocumentAsset.deleteMany({
    where: { memoryEntryId: entryId },
  });

  if (assets.length === 0) {
    return;
  }

  for (const asset of assets) {
    await prisma.edmDocumentAsset.create({
      data: {
        memoryEntryId: entryId,
        documentTypeId: asset.documentTypeId,
        fileName: asset.fileName ?? null,
        mimeType: asset.mimeType ?? null,
        storageUri: asset.storageUri ?? null,
        fileSizeBytes:
          asset.fileSizeBytes !== undefined && asset.fileSizeBytes !== null
            ? BigInt(asset.fileSizeBytes)
            : null,
        checksum: asset.checksum ?? null,
        metadata: asset.metadata ?? undefined,
        status: asset.status ?? "registered",
      },
    });
  }
};

const groupRelations = (
  relations: Array<{
    relationType: string;
    targetEntryId: string | null;
    externalRef: string | null;
    label: string | null;
    metadata: unknown;
    displayOrder: number;
  }>
) => ({
  relatedDocuments: relations
    .filter((relation) => relation.relationType === "DOCUMENT")
    .map((relation) => ({
      targetEntryId: relation.targetEntryId,
      externalRef: relation.externalRef,
      label: relation.label,
      metadata: relation.metadata,
      displayOrder: relation.displayOrder,
    })),
  relatedCalculators: relations
    .filter((relation) => relation.relationType === "CALCULATOR")
    .map((relation) => ({
      externalRef: relation.externalRef,
      label: relation.label,
      metadata: relation.metadata,
      displayOrder: relation.displayOrder,
    })),
  relatedStandards: relations
    .filter((relation) => relation.relationType === "STANDARD")
    .map((relation) => ({
      externalRef: relation.externalRef,
      label: relation.label,
      metadata: relation.metadata,
      displayOrder: relation.displayOrder,
    })),
  relatedProjects: relations
    .filter((relation) => relation.relationType === "PROJECT")
    .map((relation) => ({
      externalRef: relation.externalRef,
      label: relation.label,
      metadata: relation.metadata,
      displayOrder: relation.displayOrder,
    })),
});

export const formatEdmEntryResponse = (
  entry: Prisma.EdmMemoryEntryGetPayload<{ include: typeof entryInclude }>
) => {
  const { outgoingRelations, documentAssets, ...rest } = entry;
  return {
    ...rest,
    documentAssets: documentAssets.map((asset) => ({
      ...asset,
      fileSizeBytes:
        asset.fileSizeBytes !== null ? asset.fileSizeBytes.toString() : null,
    })),
    ...groupRelations(outgoingRelations),
  };
};

export const listEdmEntries = async (filter: ListEdmEntriesFilter = {}) => {
  const entries = await prisma.edmMemoryEntry.findMany({
    where: {
      ...(filter.disciplineId ? { disciplineId: filter.disciplineId } : {}),
      ...(filter.specializationId
        ? { specializationId: filter.specializationId }
        : {}),
      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
      ...(filter.author
        ? { author: { contains: filter.author, mode: "insensitive" } }
        : {}),
      ...(filter.projectType ? { projectType: filter.projectType } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.tags?.length ? { tags: { hasSome: filter.tags } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    skip: filter.skip,
    take: filter.take ?? 50,
    include: entryInclude,
  });

  return entries.map(formatEdmEntryResponse);
};

export const getEdmEntryById = async (id: string) => {
  const entry = await prisma.edmMemoryEntry.findUnique({
    where: { id },
    include: entryInclude,
  });

  return entry ? formatEdmEntryResponse(entry) : null;
};

export const createEdmEntry = async (
  input: CreateEdmEntryInput,
  audit?: EdmAuditContext
) => {
  validateDocumentAssets(input.documentAssets);

  const entry = await prisma.edmMemoryEntry.create({
    data: {
      title: input.title.trim(),
      disciplineId: input.disciplineId,
      specializationId: input.specializationId ?? null,
      categoryId: input.categoryId,
      keywords: input.keywords ?? [],
      tags: input.tags ?? [],
      summary: input.summary ?? null,
      author: input.author ?? null,
      organization: input.organization ?? null,
      version: input.version ?? "1.0.0",
      source: input.source ?? null,
      documentDate: parseDate(input.documentDate),
      language: input.language ?? "en",
      aiGeneratedSummary: input.aiGeneratedSummary ?? null,
      projectType: input.projectType ?? null,
      standardNumbers: input.standardNumbers ?? [],
      status: input.status ?? "DRAFT",
      createdById: input.createdById ?? audit?.actorId ?? null,
    },
    include: entryInclude,
  });

  await syncRelations(entry.id, input.relations);
  await syncDocumentAssets(entry.id, input.documentAssets);
  await upsertEdmSearchIndex(entry.id);
  await registerEdmEmbedding(
    { memoryEntryId: entry.id },
    { actorId: audit?.actorId ?? undefined, actorEmail: audit?.actorEmail ?? undefined }
  );

  await recordEdmAudit({
    memoryEntryId: entry.id,
    action: "CREATE",
    actorId: audit?.actorId,
    actorEmail: audit?.actorEmail,
    ipAddress: audit?.ipAddress,
    userAgent: audit?.userAgent,
    metadata: { title: entry.title },
  });

  const refreshed = await getEdmEntryById(entry.id);
  return refreshed!;
};

export const updateEdmEntry = async (
  id: string,
  input: UpdateEdmEntryInput,
  audit?: EdmAuditContext
) => {
  validateDocumentAssets(input.documentAssets);

  const existing = await prisma.edmMemoryEntry.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("EDM memory entry not found.");
  }

  await prisma.edmMemoryEntry.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.specializationId !== undefined
        ? { specializationId: input.specializationId }
        : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.keywords !== undefined ? { keywords: input.keywords } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.summary !== undefined ? { summary: input.summary } : {}),
      ...(input.author !== undefined ? { author: input.author } : {}),
      ...(input.organization !== undefined
        ? { organization: input.organization }
        : {}),
      ...(input.version !== undefined ? { version: input.version } : {}),
      ...(input.source !== undefined ? { source: input.source } : {}),
      ...(input.documentDate !== undefined
        ? { documentDate: parseDate(input.documentDate) }
        : {}),
      ...(input.language !== undefined ? { language: input.language } : {}),
      ...(input.aiGeneratedSummary !== undefined
        ? { aiGeneratedSummary: input.aiGeneratedSummary }
        : {}),
      ...(input.projectType !== undefined ? { projectType: input.projectType } : {}),
      ...(input.standardNumbers !== undefined
        ? { standardNumbers: input.standardNumbers }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
  });

  if (input.relations !== undefined) {
    await syncRelations(id, input.relations);
  }

  if (input.documentAssets !== undefined) {
    await syncDocumentAssets(id, input.documentAssets);
  }

  await upsertEdmSearchIndex(id);

  await recordEdmAudit({
    memoryEntryId: id,
    action: "UPDATE",
    actorId: audit?.actorId,
    actorEmail: audit?.actorEmail,
    ipAddress: audit?.ipAddress,
    userAgent: audit?.userAgent,
    metadata: { fields: Object.keys(input) },
  });

  const refreshed = await getEdmEntryById(id);
  return refreshed!;
};

export const deleteEdmEntry = async (id: string, audit?: EdmAuditContext) => {
  const existing = await prisma.edmMemoryEntry.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("EDM memory entry not found.");
  }

  await prisma.edmMemoryEntry.delete({ where: { id } });

  await recordEdmAudit({
    memoryEntryId: id,
    action: "DELETE",
    actorId: audit?.actorId,
    actorEmail: audit?.actorEmail,
    ipAddress: audit?.ipAddress,
    userAgent: audit?.userAgent,
    metadata: { title: existing.title },
  });

  return { success: true, message: "EDM memory entry deleted successfully." };
};
