import { prisma } from "../prisma/prisma.js";
import type { EngineeringEvidencePackage } from "./types.js";

export const recordEvidenceAudit = async (input: {
  conversationId?: string | null;
  userMessage?: string | null;
  aiProvider?: string | null;
  aiModel?: string | null;
  evidence: EngineeringEvidencePackage;
  actorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}) => {
  const trustEnumMap: Record<string, string> = {
    verified: "VERIFIED",
    "high-confidence": "HIGH_CONFIDENCE",
    "medium-confidence": "MEDIUM_CONFIDENCE",
    "low-confidence": "LOW_CONFIDENCE",
    "insufficient-evidence": "INSUFFICIENT_EVIDENCE",
  };

  return prisma.evidenceAuditLog.create({
    data: {
      conversationId: input.conversationId ?? null,
      userMessage: input.userMessage ?? null,
      aiProvider: input.aiProvider ?? null,
      aiModel: input.aiModel ?? null,
      trustLevel: trustEnumMap[input.evidence.trust.level] as
        | "VERIFIED"
        | "HIGH_CONFIDENCE"
        | "MEDIUM_CONFIDENCE"
        | "LOW_CONFIDENCE"
        | "INSUFFICIENT_EVIDENCE",
      confidenceScore: input.evidence.trust.score,
      evidenceCount: input.evidence.structuredResponse.evidence.length,
      citationCount: input.evidence.citations.length,
      knowledgeSources: [
        ...new Set(
          input.evidence.citations.map((citation) => citation.sourceId)
        ),
      ],
      evidenceUsed: input.evidence.structuredResponse,
      actorId: input.actorId ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      metadata: {
        conflicts: input.evidence.conflicts.length,
        trustRationale: input.evidence.trust.rationale,
      },
    },
  });
};

export const listEvidenceAuditLogs = async (filter: {
  conversationId?: string;
  actorId?: string;
  skip?: number;
  take?: number;
}) =>
  prisma.evidenceAuditLog.findMany({
    where: {
      ...(filter.conversationId ? { conversationId: filter.conversationId } : {}),
      ...(filter.actorId ? { actorId: filter.actorId } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: filter.skip,
    take: filter.take ?? 50,
  });
