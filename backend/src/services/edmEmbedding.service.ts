import type { EdmMemoryEntry } from "@prisma/client";

import { loadEdmModuleConfig } from "../edm/loadEdmConfig.js";
import type { RegisterEdmEmbeddingInput } from "../edm/types.js";
import { prisma } from "../prisma/prisma.js";
import { recordEdmAudit } from "./edmAudit.service.js";

export const registerEdmEmbedding = async (
  input: RegisterEdmEmbeddingInput,
  audit?: { actorId?: string; actorEmail?: string }
) => {
  const entry = await prisma.edmMemoryEntry.findUnique({
    where: { id: input.memoryEntryId },
  });

  if (!entry) {
    throw new Error("EDM memory entry not found.");
  }

  const moduleConfig = loadEdmModuleConfig();
  const dimensions =
    input.dimensions ??
    (input.vector ? input.vector.length : moduleConfig.embedding.defaultDimensions);

  const embedding = await prisma.edmEmbedding.upsert({
    where: { memoryEntryId: input.memoryEntryId },
    update: {
      modelId: input.modelId ?? moduleConfig.embedding.defaultModelId,
      modelVersion: input.modelVersion ?? null,
      dimensions,
      vector: input.vector ?? undefined,
      status: input.status ?? (input.vector ? "READY" : "PENDING"),
      errorMessage: null,
    },
    create: {
      memoryEntryId: input.memoryEntryId,
      modelId: input.modelId ?? moduleConfig.embedding.defaultModelId,
      modelVersion: input.modelVersion ?? null,
      dimensions,
      vector: input.vector ?? undefined,
      status: input.status ?? (input.vector ? "READY" : "PENDING"),
    },
  });

  await recordEdmAudit({
    memoryEntryId: input.memoryEntryId,
    action: "EMBEDDING_REGISTER",
    actorId: audit?.actorId,
    actorEmail: audit?.actorEmail,
    metadata: {
      embeddingId: embedding.id,
      status: embedding.status,
      dimensions,
    },
  });

  return embedding;
};

export const getEdmEmbeddingByEntryId = async (memoryEntryId: string) =>
  prisma.edmEmbedding.findUnique({
    where: { memoryEntryId },
  });

const cosineSimilarity = (left: number[], right: number[]): number => {
  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return 0;
  }

  let dot = 0;
  let normLeft = 0;
  let normRight = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    normLeft += left[index] * left[index];
    normRight += right[index] * right[index];
  }

  if (normLeft === 0 || normRight === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normLeft) * Math.sqrt(normRight));
};

export const semanticSearchEdmEntries = async (
  queryEmbedding: number[],
  filter: {
    disciplineId?: string;
    categoryId?: string;
    projectType?: string;
    author?: string;
    tags?: string[];
    language?: string;
    status?: EdmMemoryEntry["status"];
    limit?: number;
  } = {}
) => {
  if (queryEmbedding.length === 0) {
    return [];
  }

  const limit = filter.limit ?? loadEdmModuleConfig().search.defaultLimit;

  const embeddings = await prisma.edmEmbedding.findMany({
    where: {
      status: "READY",
      memoryEntry: {
        ...(filter.disciplineId ? { disciplineId: filter.disciplineId } : {}),
        ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
        ...(filter.projectType ? { projectType: filter.projectType } : {}),
        ...(filter.author ? { author: { contains: filter.author, mode: "insensitive" } } : {}),
        ...(filter.language ? { language: filter.language } : {}),
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.tags?.length ? { tags: { hasSome: filter.tags } } : {}),
      },
    },
    include: {
      memoryEntry: {
        include: {
          discipline: true,
          specialization: true,
          category: true,
        },
      },
    },
    take: Math.max(limit * 10, 100),
  });

  return embeddings
    .map((entry) => {
      if (!Array.isArray(entry.vector)) {
        return null;
      }

      const vector = entry.vector.filter(
        (value): value is number => typeof value === "number"
      );
      const score = cosineSimilarity(queryEmbedding, vector);

      if (score <= 0) {
        return null;
      }

      return {
        entry: entry.memoryEntry,
        score,
        matchType: "semantic" as const,
      };
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
};
