import type { EssaeScenarioType } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";
import {
  buildDefaultScenario,
  buildSimulationReport,
  formatSimulationReportMarkdown,
  generateWorkspaceSlug,
  getEssaePublicConfig,
  getSimulationEngineConfig,
  normalizeScenarioOptions,
  runSimulationEngine,
  runSimulationAssistant,
  type EssaeScenarioInput,
  type EssaeWorkspaceInput,
} from "../simulation/index.js";

const scenarioFromRecord = (record: {
  title: string;
  scenarioType: EssaeScenarioType;
  disciplineId: string | null;
  disciplineName: string | null;
  description: string | null;
  assumptions: unknown;
  parameters: unknown;
  options: unknown;
}): EssaeScenarioInput => ({
  title: record.title,
  scenarioType: record.scenarioType,
  disciplineId: record.disciplineId,
  disciplineName: record.disciplineName,
  description: record.description,
  assumptions: Array.isArray(record.assumptions)
    ? (record.assumptions as string[])
    : [],
  parameters: (record.parameters as Record<string, string | number | boolean | null>) ?? {},
  options: normalizeScenarioOptions(
    (record.options as EssaeScenarioInput["options"]) ?? []
  ),
});

export const getEssaeConfig = () => getEssaePublicConfig();

export const listSimulationWorkspaces = async (userId: string) =>
  prisma.essaeSimulationWorkspace.findMany({
    where: { userId, status: { not: "deleted" } },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { scenarios: true } } },
  });

export const createSimulationWorkspace = async (
  userId: string,
  input: EssaeWorkspaceInput
) => {
  const slug = generateWorkspaceSlug(input.name, userId);
  return prisma.essaeSimulationWorkspace.create({
    data: {
      userId,
      name: input.name,
      slug,
      description: input.description ?? null,
      disciplineId: input.disciplineId ?? null,
      disciplineName: input.disciplineName ?? null,
      specializationId: input.specializationId ?? null,
      specializationName: input.specializationName ?? null,
      projectId: input.projectId ?? null,
      projectName: input.projectName ?? null,
    },
  });
};

export const getSimulationWorkspace = async (userId: string, workspaceId: string) =>
  prisma.essaeSimulationWorkspace.findFirst({
    where: { id: workspaceId, userId },
    include: {
      scenarios: { orderBy: { updatedAt: "desc" } },
    },
  });

export const updateSimulationWorkspace = async (
  userId: string,
  workspaceId: string,
  updates: Partial<EssaeWorkspaceInput & { status?: string }>
) =>
  prisma.essaeSimulationWorkspace.updateMany({
    where: { id: workspaceId, userId },
    data: {
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.description !== undefined
        ? { description: updates.description }
        : {}),
      ...(updates.disciplineId !== undefined
        ? { disciplineId: updates.disciplineId }
        : {}),
      ...(updates.disciplineName !== undefined
        ? { disciplineName: updates.disciplineName }
        : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
    },
  });

export const createScenario = async (
  userId: string,
  workspaceId: string,
  scenario: EssaeScenarioInput
) => {
  const workspace = await prisma.essaeSimulationWorkspace.findFirst({
    where: { id: workspaceId, userId },
  });
  if (!workspace) {
    throw new Error("Simulation workspace not found.");
  }

  const normalized = {
    ...scenario,
    options: normalizeScenarioOptions(scenario.options),
  };

  return prisma.essaeScenario.create({
    data: {
      workspaceId,
      userId,
      title: normalized.title,
      scenarioType: normalized.scenarioType,
      disciplineId: normalized.disciplineId ?? workspace.disciplineId,
      disciplineName: normalized.disciplineName ?? workspace.disciplineName,
      description: normalized.description ?? null,
      assumptions: normalized.assumptions ?? [],
      parameters: normalized.parameters ?? {},
      options: normalized.options,
    },
  });
};

export const getScenario = async (userId: string, scenarioId: string) =>
  prisma.essaeScenario.findFirst({
    where: { id: scenarioId, userId },
  });

export const updateScenario = async (
  userId: string,
  scenarioId: string,
  updates: Partial<EssaeScenarioInput>
) => {
  const existing = await getScenario(userId, scenarioId);
  if (!existing) {
    throw new Error("Scenario not found.");
  }

  return prisma.essaeScenario.update({
    where: { id: scenarioId },
    data: {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.scenarioType !== undefined
        ? { scenarioType: updates.scenarioType }
        : {}),
      ...(updates.description !== undefined
        ? { description: updates.description }
        : {}),
      ...(updates.assumptions !== undefined
        ? { assumptions: updates.assumptions }
        : {}),
      ...(updates.parameters !== undefined ? { parameters: updates.parameters } : {}),
      ...(updates.options !== undefined
        ? { options: normalizeScenarioOptions(updates.options) }
        : {}),
      version: existing.version + 1,
    },
  });
};

export const duplicateScenario = async (userId: string, scenarioId: string) => {
  const existing = await getScenario(userId, scenarioId);
  if (!existing) {
    throw new Error("Scenario not found.");
  }

  return prisma.essaeScenario.create({
    data: {
      workspaceId: existing.workspaceId,
      userId,
      title: `${existing.title} (Copy)`,
      scenarioType: existing.scenarioType,
      disciplineId: existing.disciplineId,
      disciplineName: existing.disciplineName,
      description: existing.description,
      assumptions: existing.assumptions ?? undefined,
      parameters: existing.parameters ?? undefined,
      options: existing.options as object,
      parentScenarioId: existing.id,
      version: 1,
    },
  });
};

export const runScenarioSimulation = async (
  userId: string,
  scenarioId: string,
  saveResults = true
) => {
  const record = await getScenario(userId, scenarioId);
  if (!record) {
    throw new Error("Scenario not found.");
  }

  const scenario = scenarioFromRecord(record);
  const pkg = runSimulationEngine(scenario);

  if (saveResults && pkg.validation.valid) {
    await prisma.essaeScenario.update({
      where: { id: scenarioId },
      data: {
        results: pkg.results,
        status: "COMPARED",
      },
    });
  }

  return pkg;
};

export const runAdHocSimulation = (scenario: EssaeScenarioInput) =>
  runSimulationEngine(scenario);

export const compareScenarios = async (
  userId: string,
  input: {
    title: string;
    scenarioIds: string[];
    workspaceId?: string | null;
  }
) => {
  const scenarios = await prisma.essaeScenario.findMany({
    where: { id: { in: input.scenarioIds }, userId },
  });

  if (scenarios.length < 2) {
    throw new Error("At least two scenarios required for historical comparison.");
  }

  const packages = scenarios.map((record: (typeof scenarios)[number]) =>
    runSimulationEngine(scenarioFromRecord(record))
  );

  const comparisonMatrix = {
    scenarios: packages.map((pkg: ReturnType<typeof runSimulationEngine>, index: number) => ({
      scenarioId: scenarios[index]?.id ?? null,
      title: pkg.scenario.title,
      scenarioType: pkg.scenario.scenarioType,
      recommendedOptionId: pkg.results.recommendedOptionId,
      executiveSummary: pkg.results.executiveSummary,
      comparisonMatrix: pkg.results.comparisonMatrix,
      optionComparisons: pkg.results.optionComparisons,
    })),
  };

  const results = {
    historicalComparison: true,
    scenarioCount: packages.length,
    simulationSummary: packages.map(
      (pkg: ReturnType<typeof runSimulationEngine>) => pkg.results.simulationSummary
    ),
    summaries: packages.map(
      (pkg: ReturnType<typeof runSimulationEngine>) => pkg.results.executiveSummary
    ),
    decisionSupportNotes: packages.flatMap(
      (pkg: ReturnType<typeof runSimulationEngine>) => pkg.results.decisionSupportNotes
    ),
    riskAssessment: packages.flatMap(
      (pkg: ReturnType<typeof runSimulationEngine>) => pkg.results.riskAssessment
    ),
    recommendations: packages
      .flatMap((pkg: ReturnType<typeof runSimulationEngine>) => pkg.results.engineeringRecommendations)
      .slice(0, 12),
  };

  return prisma.essaeScenarioComparison.create({
    data: {
      userId,
      workspaceId: input.workspaceId ?? scenarios[0]?.workspaceId ?? null,
      title: input.title,
      scenarioIds: input.scenarioIds,
      comparisonMatrix,
      results,
    },
  });
};

export const listScenarioComparisons = async (userId: string, workspaceId?: string) =>
  prisma.essaeScenarioComparison.findMany({
    where: {
      userId,
      ...(workspaceId ? { workspaceId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

export const getScenarioComparison = async (userId: string, comparisonId: string) =>
  prisma.essaeScenarioComparison.findFirst({
    where: { id: comparisonId, userId },
  });

export const analyzeSimulationFromChat = (input: {
  message: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  projectContext?: string | null;
  primaryIntent?: string | null;
  moduleId?: string | null;
}) => runSimulationAssistant(input);

export const exportScenarioResults = async (userId: string, scenarioId: string) => {
  const record = await getScenario(userId, scenarioId);
  if (!record) {
    throw new Error("Scenario not found.");
  }

  const scenario = scenarioFromRecord(record);
  const pkg = runSimulationEngine(scenario);
  const results =
    record.results && typeof record.results === "object"
      ? (record.results as typeof pkg.results)
      : pkg.results;

  const workspace = await prisma.essaeSimulationWorkspace.findUnique({
    where: { id: record.workspaceId },
  });

  const report = buildSimulationReport({
    scenario,
    results,
    workspaceName: workspace?.name ?? null,
  });

  return {
    json: report,
    markdown: formatSimulationReportMarkdown(report),
  };
};

export const createDefaultScenario = (
  scenarioType: EssaeScenarioInput["scenarioType"],
  disciplineName?: string | null
) => buildDefaultScenario(scenarioType, disciplineName);

export const getEssaeEngineConfig = () => getSimulationEngineConfig();
