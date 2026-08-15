import type { EdEngineerActivitySignalType, EdEngineerInsightType } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";
import {
  buildDefaultProfile,
  getDigitalEngineerEngineConfig,
  mergeProfileFromRecord,
  profileToExportPayload,
  runDigitalEngineerEngine,
  type EdActivitySignalInput,
  type EdDigitalEngineerProfile,
  type EdEngineContextInput,
  type EdProfileUpdateInput,
} from "../digital-engineer/index.js";

const ensureProfile = async (userId: string) => {
  const existing = await prisma.edEngineerProfile.findUnique({ where: { userId } });
  if (existing) {
    return existing;
  }
  const defaults = buildDefaultProfile(userId);
  return prisma.edEngineerProfile.create({
    data: {
      userId,
      preferredUnits: defaults.preferredUnits,
      languagePreferences: defaults.languagePreferences,
      workingStyle: defaults.workingStyle,
      expertise: defaults.expertise,
      personalLibrary: defaults.personalLibrary,
    },
  });
};

const loadSignals = async (userId: string) =>
  prisma.edEngineerActivitySignal.findMany({
    where: { userId },
    orderBy: { lastUsedAt: "desc" },
    take: 100,
  });

export const getEdeConfig = () => getDigitalEngineerEngineConfig();

export const getDigitalEngineerProfile = async (
  userId: string,
  context?: EdEngineContextInput
) => {
  const record = await ensureProfile(userId);
  const profile = mergeProfileFromRecord(userId, record);
  const signals = await loadSignals(userId);

  return runDigitalEngineerEngine(
    profile,
    userId,
    context,
    signals.map((signal: { signalType: string; resourceLabel: string | null; usageCount: number }) => ({
      signalType: signal.signalType,
      resourceLabel: signal.resourceLabel,
      usageCount: signal.usageCount,
    }))
  );
};

export const updateDigitalEngineerProfile = async (
  userId: string,
  updates: EdProfileUpdateInput
) => {
  await ensureProfile(userId);

  const record = await prisma.edEngineerProfile.update({
    where: { userId },
    data: {
      ...(updates.primaryDisciplineId !== undefined
        ? { primaryDisciplineId: updates.primaryDisciplineId }
        : {}),
      ...(updates.primaryDisciplineName !== undefined
        ? { primaryDisciplineName: updates.primaryDisciplineName }
        : {}),
      ...(updates.secondaryDisciplineId !== undefined
        ? { secondaryDisciplineId: updates.secondaryDisciplineId }
        : {}),
      ...(updates.secondaryDisciplineName !== undefined
        ? { secondaryDisciplineName: updates.secondaryDisciplineName }
        : {}),
      ...(updates.specializationIds !== undefined
        ? { specializationIds: updates.specializationIds }
        : {}),
      ...(updates.specializationNames !== undefined
        ? { specializationNames: updates.specializationNames }
        : {}),
      ...(updates.yearsOfExperience !== undefined
        ? { yearsOfExperience: updates.yearsOfExperience }
        : {}),
      ...(updates.industry !== undefined ? { industry: updates.industry } : {}),
      ...(updates.preferredStandards !== undefined
        ? { preferredStandards: updates.preferredStandards }
        : {}),
      ...(updates.preferredDesignMethods !== undefined
        ? { preferredDesignMethods: updates.preferredDesignMethods }
        : {}),
      ...(updates.preferredUnits !== undefined
        ? { preferredUnits: updates.preferredUnits }
        : {}),
      ...(updates.preferredSoftware !== undefined
        ? { preferredSoftware: updates.preferredSoftware }
        : {}),
      ...(updates.languagePreferences !== undefined
        ? { languagePreferences: updates.languagePreferences }
        : {}),
      ...(updates.expertise !== undefined ? { expertise: updates.expertise } : {}),
      ...(updates.learningEnabled !== undefined
        ? { learningEnabled: updates.learningEnabled }
        : {}),
      lastActivityAt: new Date(),
    },
  });

  return mergeProfileFromRecord(userId, record);
};

export const resetDigitalEngineerProfile = async (userId: string) => {
  await prisma.edEngineerActivitySignal.deleteMany({ where: { userId } });
  await prisma.edEngineerInsightLog.deleteMany({ where: { userId } });

  const defaults = buildDefaultProfile(userId);
  const record = await prisma.edEngineerProfile.update({
    where: { userId },
    data: {
      primaryDisciplineId: null,
      primaryDisciplineName: null,
      secondaryDisciplineId: null,
      secondaryDisciplineName: null,
      specializationIds: [],
      specializationNames: [],
      yearsOfExperience: null,
      industry: null,
      preferredStandards: [],
      preferredDesignMethods: [],
      preferredUnits: defaults.preferredUnits,
      preferredSoftware: [],
      languagePreferences: defaults.languagePreferences,
      workingStyle: defaults.workingStyle,
      expertise: defaults.expertise,
      personalLibrary: defaults.personalLibrary,
      learningEnabled: true,
      lastActivityAt: new Date(),
    },
  });

  return mergeProfileFromRecord(userId, record);
};

export const exportDigitalEngineerProfile = async (userId: string) => {
  const pkg = await getDigitalEngineerProfile(userId);
  return profileToExportPayload(pkg.profile);
};

export const recordDigitalEngineerActivity = async (
  userId: string,
  signal: EdActivitySignalInput
) => {
  await ensureProfile(userId);

  const resourceId = signal.resourceId ?? signal.resourceLabel ?? "unknown";

  await prisma.edEngineerActivitySignal.upsert({
    where: {
      userId_signalType_resourceId: {
        userId,
        signalType: signal.signalType as EdEngineerActivitySignalType,
        resourceId,
      },
    },
    create: {
      userId,
      signalType: signal.signalType as EdEngineerActivitySignalType,
      resourceId,
      resourceLabel: signal.resourceLabel ?? null,
      disciplineId: signal.disciplineId ?? null,
    },
    update: {
      usageCount: { increment: 1 },
      resourceLabel: signal.resourceLabel ?? undefined,
      disciplineId: signal.disciplineId ?? undefined,
      lastUsedAt: new Date(),
    },
  });

  await prisma.edEngineerProfile.update({
    where: { userId },
    data: { lastActivityAt: new Date() },
  });
};

export const generateAndStoreInsights = async (userId: string) => {
  const pkg = await getDigitalEngineerProfile(userId);

  const insightTypeMap: Record<string, EdEngineerInsightType> = {
    "weekly-summary": "WEEKLY_SUMMARY",
    "monthly-learning": "MONTHLY_LEARNING",
    "skill-growth": "SKILL_GROWTH",
    "activity-report": "ACTIVITY_REPORT",
  };

  for (const insight of pkg.insights) {
    await prisma.edEngineerInsightLog.create({
      data: {
        userId,
        insightType: insightTypeMap[insight.type],
        title: insight.title,
        summary: insight.summary,
        payload: insight,
      },
    });
  }

  return pkg.insights;
};

export const listDigitalEngineerInsights = async (input: {
  userId: string;
  skip?: number;
  take?: number;
}) =>
  prisma.edEngineerInsightLog.findMany({
    where: { userId: input.userId },
    orderBy: { createdAt: "desc" },
    skip: input.skip ?? 0,
    take: Math.min(input.take ?? 20, 50),
  });

export const buildEdeContextFromChat = (input: {
  userId: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  workspaceId?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  message?: string | null;
}): EdEngineContextInput => ({
  userId: input.userId,
  disciplineId: input.disciplineId ?? null,
  disciplineName: input.disciplineName ?? null,
  specializationId: input.specializationId ?? null,
  specializationName: input.specializationName ?? null,
  workspaceId: input.workspaceId ?? null,
  projectId: input.projectId ?? null,
  projectName: input.projectName ?? null,
  message: input.message ?? null,
});

export const learnFromChatActivity = async (
  userId: string,
  input: {
    message?: string | null;
    disciplineId?: string | null;
    standards?: string[];
    agents?: string[];
  }
) => {
  const profile = await ensureProfile(userId);
  if (!profile.learningEnabled) {
    return;
  }

  if (input.message) {
    await recordDigitalEngineerActivity(userId, {
      signalType: "TOPIC",
      resourceId: input.message.slice(0, 80),
      resourceLabel: input.message.slice(0, 80),
      disciplineId: input.disciplineId,
    });
  }

  for (const standard of input.standards ?? []) {
    await recordDigitalEngineerActivity(userId, {
      signalType: "STANDARD",
      resourceId: standard,
      resourceLabel: standard,
      disciplineId: input.disciplineId,
    });
  }

  for (const agent of input.agents ?? []) {
    await recordDigitalEngineerActivity(userId, {
      signalType: "AGENT",
      resourceId: agent,
      resourceLabel: agent,
      disciplineId: input.disciplineId,
    });
  }
};
