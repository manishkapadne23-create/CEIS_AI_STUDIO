import { Request } from "express";

import { getEdmPublicConfig } from "../edm/loadEdmConfig.js";
import type { EdmGlobalSearchFilter, EdmMemoryEntryStatus } from "../edm/types.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listEdmAuditLogs } from "../services/edmAudit.service.js";
import {
  createEdmEntry,
  deleteEdmEntry,
  getEdmEntryById,
  listEdmEntries,
  updateEdmEntry,
} from "../services/edmEntry.service.js";
import {
  getEdmEmbeddingByEntryId,
  registerEdmEmbedding,
  semanticSearchEdmEntries,
} from "../services/edmEmbedding.service.js";
import { globalSearchEdm } from "../services/edmSearch.service.js";

const getIdParam = (req: Request) => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

const getAuditContext = (req: Request) => ({
  actorId: req.user?.id,
  actorEmail: undefined,
  ipAddress: req.ip,
  userAgent: req.get("user-agent") ?? undefined,
});

const parseTags = (value: unknown): string[] | undefined => {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
};

const parseSearchFilter = (req: Request): EdmGlobalSearchFilter => ({
  q: typeof req.query.q === "string" ? req.query.q : undefined,
  standardNumber:
    typeof req.query.standardNumber === "string"
      ? req.query.standardNumber
      : undefined,
  projectType:
    typeof req.query.projectType === "string" ? req.query.projectType : undefined,
  disciplineId:
    typeof req.query.disciplineId === "string"
      ? req.query.disciplineId
      : undefined,
  categoryId:
    typeof req.query.categoryId === "string" ? req.query.categoryId : undefined,
  author: typeof req.query.author === "string" ? req.query.author : undefined,
  tags: parseTags(req.query.tags),
  language:
    typeof req.query.language === "string" ? req.query.language : undefined,
  status:
    typeof req.query.status === "string"
      ? (req.query.status as EdmMemoryEntryStatus)
      : undefined,
  limit:
    typeof req.query.limit === "string" ? Number.parseInt(req.query.limit, 10) : undefined,
});

export const getEdmConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEdmPublicConfig());
});

export const listEdmEntriesController = asyncHandler(async (req, res) => {
  const entries = await listEdmEntries({
    disciplineId:
      typeof req.query.disciplineId === "string"
        ? req.query.disciplineId
        : undefined,
    specializationId:
      typeof req.query.specializationId === "string"
        ? req.query.specializationId
        : undefined,
    categoryId:
      typeof req.query.categoryId === "string" ? req.query.categoryId : undefined,
    author: typeof req.query.author === "string" ? req.query.author : undefined,
    projectType:
      typeof req.query.projectType === "string" ? req.query.projectType : undefined,
    status:
      typeof req.query.status === "string"
        ? (req.query.status as EdmMemoryEntryStatus)
        : undefined,
    tags: parseTags(req.query.tags),
    skip:
      typeof req.query.skip === "string"
        ? Number.parseInt(req.query.skip, 10)
        : undefined,
    take:
      typeof req.query.take === "string"
        ? Number.parseInt(req.query.take, 10)
        : undefined,
  });

  sendSuccess(res, entries);
});

export const getEdmEntryController = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  if (!id) {
    return sendError(res, 400, "EDM_INVALID_ID", "Invalid EDM entry id.");
  }

  const entry = await getEdmEntryById(id);
  if (!entry) {
    return sendError(res, 404, "EDM_NOT_FOUND", "EDM memory entry not found.");
  }

  sendSuccess(res, entry);
});

export const createEdmEntryController = asyncHandler(async (req, res) => {
  const entry = await createEdmEntry(req.body, getAuditContext(req));
  sendSuccess(res, entry, { status: 201, message: "EDM memory entry created." });
});

export const updateEdmEntryController = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  if (!id) {
    return sendError(res, 400, "EDM_INVALID_ID", "Invalid EDM entry id.");
  }

  const entry = await updateEdmEntry(id, req.body, getAuditContext(req));
  sendSuccess(res, entry, { message: "EDM memory entry updated." });
});

export const deleteEdmEntryController = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  if (!id) {
    return sendError(res, 400, "EDM_INVALID_ID", "Invalid EDM entry id.");
  }

  const result = await deleteEdmEntry(id, getAuditContext(req));
  sendSuccess(res, result);
});

export const globalSearchEdmController = asyncHandler(async (req, res) => {
  const results = await globalSearchEdm(parseSearchFilter(req), getAuditContext(req));
  sendSuccess(res, results, {
    meta: {
      count: results.length,
      mode: typeof req.query.q === "string" && req.query.q.trim() ? "keyword" : "facet",
    },
  });
});

export const semanticSearchEdmController = asyncHandler(async (req, res) => {
  const queryEmbedding = Array.isArray(req.body?.queryEmbedding)
    ? req.body.queryEmbedding.filter((value: unknown) => typeof value === "number")
    : [];

  if (queryEmbedding.length === 0) {
    return sendError(
      res,
      400,
      "EDM_INVALID_EMBEDDING",
      "queryEmbedding must be a non-empty number array."
    );
  }

  const results = await semanticSearchEdmEntries(queryEmbedding, req.body?.filter ?? {});
  sendSuccess(res, results, {
    meta: { count: results.length, mode: "semantic" },
  });
});

export const registerEdmEmbeddingController = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  if (!id) {
    return sendError(res, 400, "EDM_INVALID_ID", "Invalid EDM entry id.");
  }

  const embedding = await registerEdmEmbedding(
    {
      memoryEntryId: id,
      modelId: req.body?.modelId,
      modelVersion: req.body?.modelVersion,
      dimensions: req.body?.dimensions,
      vector: Array.isArray(req.body?.vector) ? req.body.vector : undefined,
      status: req.body?.status,
    },
    { actorId: req.user?.id }
  );

  sendSuccess(res, embedding, { message: "EDM embedding registered." });
});

export const getEdmEmbeddingController = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  if (!id) {
    return sendError(res, 400, "EDM_INVALID_ID", "Invalid EDM entry id.");
  }

  const embedding = await getEdmEmbeddingByEntryId(id);
  if (!embedding) {
    return sendError(res, 404, "EDM_EMBEDDING_NOT_FOUND", "EDM embedding not found.");
  }

  sendSuccess(res, embedding);
});

export const listEdmAuditLogsController = asyncHandler(async (req, res) => {
  const logs = await listEdmAuditLogs({
    memoryEntryId:
      typeof req.query.memoryEntryId === "string"
        ? req.query.memoryEntryId
        : undefined,
    actorId:
      typeof req.query.actorId === "string" ? req.query.actorId : undefined,
    skip:
      typeof req.query.skip === "string"
        ? Number.parseInt(req.query.skip, 10)
        : undefined,
    take:
      typeof req.query.take === "string"
        ? Number.parseInt(req.query.take, 10)
        : undefined,
  });

  sendSuccess(res, logs);
});
