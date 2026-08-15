import type { SecurityAuditCategory } from "@prisma/client";

import { auditLogger } from "../infrastructure/logger/index.js";
import { prisma } from "../prisma/prisma.js";
import { hashValue } from "./encryptionService.js";
import type { SecurityAuditCategoryId, SecurityAuditInput } from "./types.js";

export const logSecurityAudit = async (input: SecurityAuditInput): Promise<void> => {
  const integrityPayload = {
    category: input.category,
    eventType: input.eventType,
    userId: input.userId ?? null,
    tenantId: input.tenantId ?? null,
    actorId: input.actorId ?? null,
    resource: input.resource ?? null,
    resourceId: input.resourceId ?? null,
    status: input.status ?? "success",
    metadata: input.metadata ?? {},
    recordedAt: new Date().toISOString(),
  };

  const integrityHash = hashValue(JSON.stringify(integrityPayload));

  auditLogger.info(input.eventType, {
    category: input.category,
    userId: input.userId,
    tenantId: input.tenantId,
    actorId: input.actorId,
    resource: input.resource,
    resourceId: input.resourceId,
    status: input.status ?? "success",
    integrityHash,
    ...(input.metadata ?? {}),
  });

  try {
    await prisma.securityAuditLog.create({
      data: {
        category: input.category as SecurityAuditCategory,
        eventType: input.eventType,
        userId: input.userId ?? null,
        tenantId: input.tenantId ?? null,
        actorId: input.actorId ?? null,
        resource: input.resource ?? null,
        resourceId: input.resourceId ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        status: input.status ?? "success",
        metadata: input.metadata ?? undefined,
        integrityHash,
      },
    });
  } catch {
    // Audit must not break request flow — file log is fallback.
  }
};

export const listSecurityAuditLogs = async (input: {
  userId?: string;
  category?: SecurityAuditCategoryId;
  limit?: number;
}) =>
  prisma.securityAuditLog.findMany({
    where: {
      ...(input.userId ? { userId: input.userId } : {}),
      ...(input.category ? { category: input.category as SecurityAuditCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: input.limit ?? 100,
  });

export const verifyAuditIntegrity = (
  log: { integrityHash: string | null } & Record<string, unknown>
): boolean => {
  if (!log.integrityHash) {
    return false;
  }

  const integrityPayload = {
    category: log.category,
    eventType: log.eventType,
    userId: log.userId ?? null,
    tenantId: log.tenantId ?? null,
    actorId: log.actorId ?? null,
    resource: log.resource ?? null,
    resourceId: log.resourceId ?? null,
    status: log.status ?? "success",
    metadata: log.metadata ?? {},
    recordedAt: null,
  };

  return log.integrityHash === hashValue(JSON.stringify(integrityPayload));
};
