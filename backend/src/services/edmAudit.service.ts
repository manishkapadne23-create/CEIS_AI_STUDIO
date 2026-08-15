import { prisma } from "../prisma/prisma.js";
import type { EdmAuditRecordInput } from "../edm/types.js";

export const recordEdmAudit = async (input: EdmAuditRecordInput) =>
  prisma.edmAuditLog.create({
    data: {
      memoryEntryId: input.memoryEntryId ?? null,
      action: input.action,
      actorId: input.actorId ?? null,
      actorEmail: input.actorEmail ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      metadata: input.metadata ?? undefined,
    },
  });

export const listEdmAuditLogs = async (filter: {
  memoryEntryId?: string;
  action?: EdmAuditRecordInput["action"];
  actorId?: string;
  skip?: number;
  take?: number;
}) =>
  prisma.edmAuditLog.findMany({
    where: {
      ...(filter.memoryEntryId ? { memoryEntryId: filter.memoryEntryId } : {}),
      ...(filter.action ? { action: filter.action } : {}),
      ...(filter.actorId ? { actorId: filter.actorId } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: filter.skip,
    take: filter.take ?? 50,
  });
