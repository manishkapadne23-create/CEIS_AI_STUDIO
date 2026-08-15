import type { EmaceCollaborationEventType } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";
import type { EmaceCollaborationPackage } from "./types.js";

export const recordEmaceAuditEvent = async (input: {
  userId?: string | null;
  conversationId?: string | null;
  eventType: EmaceCollaborationEventType;
  agentId?: string | null;
  summary?: string | null;
  payload?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}) =>
  prisma.emaceCollaborationAuditLog.create({
    data: {
      userId: input.userId ?? null,
      conversationId: input.conversationId ?? null,
      eventType: input.eventType,
      agentId: input.agentId ?? null,
      summary: input.summary ?? null,
      payload: input.payload ? (input.payload as object) : undefined,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });

export const logCollaborationSession = async (
  userId: string | null | undefined,
  conversationId: string | null | undefined,
  pkg: EmaceCollaborationPackage,
  auditContext?: { ipAddress?: string; userAgent?: string }
): Promise<void> => {
  if (!pkg.enabled) {
    return;
  }

  await recordEmaceAuditEvent({
    userId,
    conversationId,
    eventType: "REQUEST_ANALYZED",
    summary: pkg.analysis.analysisSummary,
    payload: { analysis: pkg.analysis },
    ...auditContext,
  });

  for (const output of pkg.agentOutputs.filter(
    (entry) => entry.status === "executed"
  )) {
    await recordEmaceAuditEvent({
      userId,
      conversationId,
      eventType: "AGENT_EXECUTED",
      agentId: output.agentId,
      summary: `${output.agentName} executed`,
      payload: output,
      ...auditContext,
    });
  }

  if (pkg.collaborations.length > 0) {
    await recordEmaceAuditEvent({
      userId,
      conversationId,
      eventType: "AGENT_COLLABORATION",
      summary: `${pkg.collaborations.length} collaboration events`,
      payload: pkg.collaborations,
      ...auditContext,
    });
  }

  if (pkg.conflicts.length > 0) {
    await recordEmaceAuditEvent({
      userId,
      conversationId,
      eventType: "CONFLICT_DETECTED",
      summary: `${pkg.conflicts.length} conflicts detected`,
      payload: pkg.conflicts,
      ...auditContext,
    });
  }

  await recordEmaceAuditEvent({
    userId,
    conversationId,
    eventType: "RESPONSE_COMPOSED",
    summary: pkg.composedResponse.executiveSummary.slice(0, 200),
    payload: pkg.composedResponse,
    ...auditContext,
  });
};

export const listEmaceAuditLogs = async (input: {
  userId?: string;
  conversationId?: string;
  skip?: number;
  take?: number;
}) =>
  prisma.emaceCollaborationAuditLog.findMany({
    where: {
      ...(input.userId ? { userId: input.userId } : {}),
      ...(input.conversationId ? { conversationId: input.conversationId } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: input.skip ?? 0,
    take: Math.min(input.take ?? 50, 100),
  });
