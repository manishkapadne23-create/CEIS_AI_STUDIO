import { prisma } from "../prisma/prisma.js";
import { logSecurityAudit } from "./auditService.js";
import type { SecurityMonitorEvent } from "./types.js";

const failedLoginCounts = new Map<string, { count: number; resetAt: number }>();

export const recordFailedLogin = async (input: {
  email: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void> => {
  const key = `${input.email}:${input.ipAddress ?? "unknown"}`;
  const now = Date.now();
  const bucket = failedLoginCounts.get(key);

  const count =
    !bucket || now > bucket.resetAt ? 1 : bucket.count + 1;

  failedLoginCounts.set(key, { count, resetAt: now + 15 * 60_000 });

  await logSecurityAudit({
    category: "AUTH",
    eventType: "auth.login_failed",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    status: "failure",
    metadata: { email: input.email, attemptCount: count },
  });

  if (count >= 5) {
    await recordSecurityEvent({
      eventType: "security.brute_force",
      severity: "critical",
      sourceIp: input.ipAddress,
      description: `Brute force login attempts detected for ${input.email}`,
      metadata: { email: input.email, attemptCount: count },
    });
  }
};

export const recordSecurityEvent = async (
  event: SecurityMonitorEvent
): Promise<void> => {
  await logSecurityAudit({
    category: "SECURITY",
    eventType: event.eventType,
    userId: event.userId,
    ipAddress: event.sourceIp,
    status: event.severity === "critical" ? "failure" : "success",
    metadata: event.metadata,
  });

  try {
    await prisma.securityEvent.create({
      data: {
        eventType: event.eventType,
        severity: event.severity,
        sourceIp: event.sourceIp ?? null,
        userId: event.userId ?? null,
        description: event.description,
        metadata: event.metadata ?? undefined,
      },
    });
  } catch {
    // Monitoring must not break request flow.
  }
};

export const recordSuspiciousRequest = async (input: {
  reason: string;
  ipAddress?: string | null;
  userId?: string | null;
  path?: string;
}): Promise<void> => {
  await recordSecurityEvent({
    eventType: "api.abuse",
    severity: "warning",
    sourceIp: input.ipAddress,
    userId: input.userId,
    description: input.reason,
    metadata: { path: input.path },
  });
};

export const listSecurityEvents = async (input?: {
  severity?: string;
  resolved?: boolean;
  limit?: number;
}) =>
  prisma.securityEvent.findMany({
    where: {
      ...(input?.severity ? { severity: input.severity } : {}),
      ...(input?.resolved !== undefined ? { resolved: input.resolved } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: input?.limit ?? 100,
  });

export const getFailedLoginCount = (email: string, ipAddress?: string | null): number => {
  const key = `${email}:${ipAddress ?? "unknown"}`;
  const bucket = failedLoginCounts.get(key);
  if (!bucket || Date.now() > bucket.resetAt) {
    return 0;
  }
  return bucket.count;
};
