import type {
  EngineeringKnowledgeItem,
  EngineeringKnowledgeItemStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "../prisma/prisma.js";

export interface CreateKnowledgeItemInput {
  title: string;
  disciplineId: string;
  specializationId?: string | null;
  categoryId: string;
  keywords?: string[];
  tags?: string[];
  language?: string;
  version?: string;
  source?: string | null;
  status?: EngineeringKnowledgeItemStatus;
  content?: string | null;
}

export interface UpdateKnowledgeItemInput {
  title?: string;
  specializationId?: string | null;
  categoryId?: string;
  keywords?: string[];
  tags?: string[];
  language?: string;
  version?: string;
  source?: string | null;
  status?: EngineeringKnowledgeItemStatus;
  content?: string | null;
}

export interface ListKnowledgeItemsFilter {
  disciplineId?: string;
  specializationId?: string;
  categoryId?: string;
  status?: EngineeringKnowledgeItemStatus;
  language?: string;
  skip?: number;
  take?: number;
}

const knowledgeItemInclude = {
  discipline: true,
  specialization: true,
  category: true,
  searchIndex: true,
} satisfies Prisma.EngineeringKnowledgeItemInclude;

export const listEngineeringDisciplines = async () =>
  prisma.engineeringDiscipline.findMany({
    where: { active: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: {
      specializations: {
        where: { active: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      },
    },
  });

export const getEngineeringDisciplineById = async (id: string) =>
  prisma.engineeringDiscipline.findUnique({
    where: { id },
    include: {
      specializations: {
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      },
    },
  });

export const listEngineeringSpecializations = async (disciplineId?: string) =>
  prisma.engineeringSpecialization.findMany({
    where: {
      active: true,
      ...(disciplineId ? { disciplineId } : {}),
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { discipline: true },
  });

export const listEngineeringKnowledgeCategories = async () =>
  prisma.engineeringKnowledgeCategory.findMany({
    where: { active: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

export const listEngineeringKnowledgeItems = async (
  filter: ListKnowledgeItemsFilter = {}
) =>
  prisma.engineeringKnowledgeItem.findMany({
    where: {
      ...(filter.disciplineId ? { disciplineId: filter.disciplineId } : {}),
      ...(filter.specializationId
        ? { specializationId: filter.specializationId }
        : {}),
      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.language ? { language: filter.language } : {}),
    },
    orderBy: { updatedAt: "desc" },
    skip: filter.skip,
    take: filter.take ?? 50,
    include: knowledgeItemInclude,
  });

export const getEngineeringKnowledgeItemById = async (id: string) =>
  prisma.engineeringKnowledgeItem.findUnique({
    where: { id },
    include: knowledgeItemInclude,
  });

export const createEngineeringKnowledgeItem = async (
  input: CreateKnowledgeItemInput
): Promise<EngineeringKnowledgeItem> =>
  prisma.engineeringKnowledgeItem.create({
    data: {
      title: input.title.trim(),
      disciplineId: input.disciplineId,
      specializationId: input.specializationId ?? null,
      categoryId: input.categoryId,
      keywords: input.keywords ?? [],
      tags: input.tags ?? [],
      language: input.language ?? "en",
      version: input.version ?? "1.0.0",
      source: input.source ?? null,
      status: input.status ?? "DRAFT",
      content: input.content ?? null,
    },
  });

export const updateEngineeringKnowledgeItem = async (
  id: string,
  input: UpdateKnowledgeItemInput
) =>
  prisma.engineeringKnowledgeItem.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.specializationId !== undefined
        ? { specializationId: input.specializationId }
        : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.keywords !== undefined ? { keywords: input.keywords } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.language !== undefined ? { language: input.language } : {}),
      ...(input.version !== undefined ? { version: input.version } : {}),
      ...(input.source !== undefined ? { source: input.source } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
    },
    include: knowledgeItemInclude,
  });

export const deleteEngineeringKnowledgeItem = async (id: string) =>
  prisma.engineeringKnowledgeItem.delete({
    where: { id },
  });
