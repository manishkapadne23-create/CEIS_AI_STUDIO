import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { engineeringKnowledgeEngine } from "../knowledge/engine";
import { buildExpertSystemPrompt } from "./expert/buildExpertSystemPrompt";
import { resolveEngineeringAIExpertProfile } from "./expert/resolveExpertProfile";import { getCapabilityRegistry } from "../knowledge/capabilities/capabilityRegistry";
import { resolveModuleContent } from "../knowledge/data/content/resolveModuleContent";
import { getKnowledgeModule } from "../knowledge/data/registry";
import { getSpecializationKnowledge } from "../knowledge/data/schemas";
import { resolveStandardsWithKnowledge } from "../knowledge/utils/resolveStandardsWithKnowledge";
import { getDisciplineIdByName } from "../knowledge/utils/resolveKnowledgeModule";
import type { EngineeringAIContext } from "./types/EngineeringAIContext";

const formatValue = (value: string | null): string =>
  value?.trim() ? value : "Not selected";

export const resolveEngineeringAIContext = (
  workspace: EngineeringWorkspace,
  userPrompt: string,
  options?: {
    activeDisciplineId?: string | null;
    activeModuleId?: WorkspaceCategoryId | null;
    selectedStandard?: import("../config/standards").EngineeringStandardMetadata | null;
  }
): EngineeringAIContext => {
  const disciplineId = getDisciplineIdByName(workspace.domain);
  const knowledgeModule = disciplineId
    ? getKnowledgeModule(disciplineId) ?? null
    : null;
  const capabilityRegistry = disciplineId
    ? getCapabilityRegistry(disciplineId) ?? null
    : null;

  const specializationKnowledge =
    disciplineId && workspace.specialization
      ? getSpecializationKnowledge(
          disciplineId,
          workspace.specialization
        ) ?? null
      : null;

  const moduleContent = resolveModuleContent(
    knowledgeModule,
    workspace.specialization,
    workspace.codes
  );

  const overviewSection = moduleContent?.sections.find(
    (section) => section.id === "overview"
  );

  const overview =
    overviewSection?.type === "text"
      ? overviewSection.text
      : specializationKnowledge?.overview ??
        knowledgeModule?.metadata?.description ??
        null;

  const expert = resolveEngineeringAIExpertProfile(workspace);
  const resolvedStandards = resolveStandardsWithKnowledge(workspace);
  const aiKnowledgeContext = engineeringKnowledgeEngine.resolveAIContext({
    workspace,
    activeDisciplineId: options?.activeDisciplineId ?? disciplineId,
    activeDisciplineName: workspace.domain,
    activeModuleId: options?.activeModuleId ?? null,
    userQuery: userPrompt,
    selectedStandard: options?.selectedStandard ?? null,
  });

  return {
    workspace,
    discipline: {
      id: disciplineId,
      name: workspace.domain,
    },
    knowledge: {
      moduleId: knowledgeModule?.id ?? null,
      moduleName: knowledgeModule?.disciplineName ?? null,
      specialization: workspace.specialization,
      overview,
    },
    capabilities:
      capabilityRegistry?.capabilities.map((capability) => ({
        id: capability.id,
        key: capability.key,
        label: capability.label,
        status: capability.status,
        enabled: capability.enabled,
      })) ?? [],
    standards: resolvedStandards.standards.map((standard) => ({
      id: standard.id,
      code: standard.code,
      title: standard.title,
      family: standard.familyLabel,
      status: standard.status,
      fromKnowledgeRepository: standard.fromKnowledgeRepository,
    })),
    expert,
    userPrompt: userPrompt.trim(),
    aiKnowledgeContext,
  };
};

export const formatEngineeringAIContext = (
  context: EngineeringAIContext
): string => {
  const enabledCapabilities = context.capabilities.filter(
    (capability) => capability.enabled
  );

  const capabilityLines =
    enabledCapabilities.length > 0
      ? enabledCapabilities.map(
          (capability) =>
            `- ${capability.label} (${capability.status})`
        )
      : ["- No enabled capabilities resolved"];

  const standardsLines =
    context.standards.length > 0
      ? context.standards.map(
          (standard) =>
            `- ${standard.code} — ${standard.title} [${standard.family}]${standard.fromKnowledgeRepository ? " (Knowledge Repository)" : ""}`
        )
      : ["- No standards resolved"];

  const knowledgeOverview = context.knowledge.overview
    ? context.knowledge.overview
    : "No specialization knowledge overview available.";

  const engineContextLines = context.aiKnowledgeContext
    ? [
        "",
        "Engineering Knowledge Engine",
        `Category Highlights: ${
          context.aiKnowledgeContext.categoryHighlights
            .slice(0, 5)
            .map((item) => item.title)
            .join("; ") || "None"
        }`,
        `Matched Calculators: ${context.aiKnowledgeContext.applicableCalculators.join("; ") || "None"}`,
      ]
    : [];

  return [
    "----------------------------------------",
    "",
    "Universal Engineering AI Context",
    "",
    "Engineering Selection",
    `Domain: ${formatValue(context.workspace.domain)}`,
    `Branch: ${formatValue(context.workspace.branch)}`,
    `Specialization: ${formatValue(context.workspace.specialization)}`,
    `Country: ${context.workspace.country}`,
    `Codes: ${context.workspace.codes.join(", ")}`,
    `Active Module: ${formatValue(context.workspace.activeModule)}`,
    "",
    "Resolved Discipline",
    `Discipline ID: ${formatValue(context.discipline.id)}`,
    `Discipline Name: ${formatValue(context.discipline.name)}`,
    "",
    "Knowledge Repository",
    `Module: ${formatValue(context.knowledge.moduleName)}`,
    `Specialization: ${formatValue(context.knowledge.specialization)}`,
    `Overview: ${knowledgeOverview}`,
    "",
    "Standards & Codes Registry",
    ...standardsLines,
    "",
    "Capability Registry",
    ...capabilityLines,
    "",
    "User Question:",
    context.userPrompt,
    "",
    ...engineContextLines,
    "----------------------------------------",
  ].join("\n");
};

export const buildAIRequestMessage = (
  workspace: EngineeringWorkspace,
  userPrompt: string
): string => {
  const context = resolveEngineeringAIContext(workspace, userPrompt);
  const systemPrompt = buildExpertSystemPrompt(context.expert, context);

  return `${systemPrompt}\n\n${userPrompt.trim()}`;
};
