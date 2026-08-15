import { prisma } from "../prisma/prisma.js";
import {
  getEmaceEngineConfig,
  listEmaceAuditLogs,
  listRegisteredAgents,
  logCollaborationSession,
  runEmaceCollaborationEngine,
  type EmaceCollaborationInput,
  type EmaceUserPreferencesSnapshot,
} from "../agents/index.js";

const toPreferencesSnapshot = (prefs: {
  multiAgentEnabled: boolean;
  manualMode: boolean;
  enabledAgentIds: string[];
  disabledAgentIds: string[];
  subscriptionPlan: string;
}): EmaceUserPreferencesSnapshot => ({
  multiAgentEnabled: prefs.multiAgentEnabled,
  manualMode: prefs.manualMode,
  enabledAgentIds: prefs.enabledAgentIds,
  disabledAgentIds: prefs.disabledAgentIds,
  subscriptionPlan: prefs.subscriptionPlan,
});

export const getOrCreateEmacePreferences = async (
  userId: string,
  subscriptionPlan?: string
) => {
  const prefs = await prisma.emaceUserPreferences.upsert({
    where: { userId },
    create: {
      userId,
      subscriptionPlan: subscriptionPlan ?? "free",
    },
    update: subscriptionPlan ? { subscriptionPlan } : {},
  });
  return toPreferencesSnapshot(prefs);
};

export const updateEmacePreferences = async (
  userId: string,
  updates: Partial<EmaceUserPreferencesSnapshot>
) => {
  const prefs = await prisma.emaceUserPreferences.upsert({
    where: { userId },
    create: { userId, ...updates },
    update: updates,
  });
  return toPreferencesSnapshot(prefs);
};

export const getEmaceConfig = () => getEmaceEngineConfig();

export const listEmaceAgents = () => listRegisteredAgents();

export const collaborateEngineeringRequest = async (
  input: EmaceCollaborationInput & {
    auditContext?: { ipAddress?: string; userAgent?: string };
  }
) => {
  let preferences = input.preferences;

  if (input.userId && !preferences) {
    preferences = await getOrCreateEmacePreferences(
      input.userId,
      input.subscriptionPlan ?? undefined
    );
  }

  const pkg = runEmaceCollaborationEngine({
    ...input,
    preferences,
  });

  if (input.userId && pkg.enabled) {
    await logCollaborationSession(
      input.userId,
      input.conversationId ?? null,
      pkg,
      input.auditContext
    );
  }

  return pkg;
};

export const getEmaceAuditLogs = listEmaceAuditLogs;

export const buildEmaceContextFromChat = (input: {
  userId?: string;
  conversationId?: string | null;
  message: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  primaryIntent?: string | null;
  subscriptionPlan?: string | null;
  manualAgentIds?: string[] | null;
}): EmaceCollaborationInput => ({
  userMessage: input.message,
  userId: input.userId ?? null,
  conversationId: input.conversationId ?? null,
  disciplineId: input.disciplineId ?? null,
  disciplineName: input.disciplineName ?? null,
  specializationId: input.specializationId ?? null,
  specializationName: input.specializationName ?? null,
  primaryIntent: input.primaryIntent ?? null,
  subscriptionPlan: input.subscriptionPlan ?? null,
  manualAgentIds: input.manualAgentIds ?? null,
});
