import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { getCapabilityRegistry } from "../../knowledge/capabilities/capabilityRegistry";
import { resolveStandardsWithKnowledge } from "../../knowledge/utils/resolveStandardsWithKnowledge";
import { DISCIPLINE_DEFINITIONS } from "../../knowledge/data/disciplineManifest";
import {
  engineeringKnowledgeSchemaRegistry,
  getSpecializationKnowledge,
} from "../../knowledge/data/schemas";
import { disciplineKnowledgeSchemas } from "../../knowledge/data/schemas/disciplineSchemaRegistry";
import type { EngineeringSpecializationKnowledge } from "../../knowledge/types/EngineeringKnowledgeSchema";
import { getDisciplineIdByName } from "../../knowledge/utils/resolveKnowledgeModule";
import type { EngineeringAIExpertProfile } from "../types/EngineeringAIExpertProfile";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const extractEngineeringTerminology = (
  knowledge: EngineeringSpecializationKnowledge
): string[] => {
  const items = [
    ...knowledge.designStandards.map(
      (standard) => standard.code ?? standard.title
    ),
    ...knowledge.designModules.map((module) => module.title),
    ...knowledge.designSoftware.map((software) => software.title),
    ...knowledge.aiEngineeringAgents.map((agent) => agent.title),
    ...knowledge.scope,
  ];

  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
};

export const buildExpertResponseStyle = (
  discipline: string,
  specialization: string,
  country: string,
  codes: string[]
): string => {
  const codesList =
    codes.length > 0
      ? codes.join(", ")
      : "applicable national and international codes";

  return [
    `You are a senior ${specialization} expert within ${discipline}.`,
    `Provide technically precise, standards-aligned guidance for ${country} engineering practice.`,
    `Reference governing standards (${codesList}) where relevant.`,
    "Use professional engineering terminology and clearly state assumptions, methodology, governing references, and actionable recommendations.",
    "When calculations are required, show formulas, inputs, units, and verification steps.",
    "Flag safety-critical considerations and compliance risks explicitly.",
  ].join(" ");
};

const createSyntheticSpecializationKnowledge = (
  disciplineId: string,
  disciplineName: string,
  specializationTitle: string,
  workspace: EngineeringWorkspace
): EngineeringSpecializationKnowledge => ({
  id: slugify(`${disciplineId}-${specializationTitle}`),
  title: specializationTitle,
  disciplineId,
  overview: `${specializationTitle} within ${disciplineName}. Provide expert guidance aligned with ${workspace.country} practice and standards: ${workspace.codes.join(", ")}.`,
  scope: [
    `${specializationTitle} planning and design`,
    `${specializationTitle} analysis and verification`,
    `${specializationTitle} standards compliance and professional practice`,
  ],
  designStandards: workspace.codes.map((code, index) => ({
    id: `code-${index}`,
    title: code,
    code,
  })),
  designModules: [],
  designSoftware: [],
  aiEngineeringAgents: [],
  engineeringCalculators: [],
  templates: [],
  learningResources: [],
});

export const resolveSpecializationKnowledgeForExpert = (
  disciplineId: string,
  disciplineName: string,
  workspace: EngineeringWorkspace
): EngineeringSpecializationKnowledge => {
  const candidates = [
    workspace.specialization,
    workspace.branch,
    disciplineName,
  ].filter((value): value is string => Boolean(value?.trim()));

  for (const title of candidates) {
    const knowledge = getSpecializationKnowledge(disciplineId, title);

    if (knowledge) {
      return knowledge;
    }
  }

  const disciplineSchema =
    engineeringKnowledgeSchemaRegistry.getDiscipline(disciplineId);
  const firstSpecialization = disciplineSchema
    ? Object.values(disciplineSchema.specializations)[0]
    : undefined;

  if (firstSpecialization) {
    return firstSpecialization;
  }

  const fallbackTitle =
    workspace.specialization ??
    workspace.branch ??
    disciplineName ??
    "General Engineering";

  return createSyntheticSpecializationKnowledge(
    disciplineId,
    disciplineName,
    fallbackTitle,
    workspace
  );
};

export const buildExpertProfileFromKnowledge = (
  workspace: EngineeringWorkspace,
  disciplineId: string | null,
  disciplineName: string | null,
  specializationKnowledge: EngineeringSpecializationKnowledge
): EngineeringAIExpertProfile => {
  const capabilityRegistry = disciplineId
    ? getCapabilityRegistry(disciplineId)
    : undefined;

  const enabledCapabilities =
    capabilityRegistry?.capabilities
      .filter((capability) => capability.enabled)
      .map((capability) => ({
        key: capability.key,
        label: capability.label,
        status: capability.status,
      })) ?? [];

  const discipline = disciplineName ?? workspace.domain ?? "Engineering";
  const specialization =
    workspace.specialization ?? specializationKnowledge.title;

  const resolvedStandards = resolveStandardsWithKnowledge(workspace);

  return {
    id: `${disciplineId ?? "general"}:${specializationKnowledge.id}`,
    discipline,
    branch: workspace.branch,
    specialization,
    scope: specializationKnowledge.scope,
    standards: resolvedStandards.standards.map((standard) =>
      `${standard.code} — ${standard.title}`
    ),
    terminology: extractEngineeringTerminology(specializationKnowledge),
    responseStyle: buildExpertResponseStyle(
      discipline,
      specialization,
      workspace.country,
      workspace.codes
    ),
    availableCapabilities: enabledCapabilities,
  };
};

export const resolveEngineeringAIExpertProfile = (
  workspace: EngineeringWorkspace
): EngineeringAIExpertProfile => {
  const disciplineId = getDisciplineIdByName(workspace.domain);
  const disciplineName = workspace.domain;

  if (!disciplineId || !disciplineName) {
    const fallbackTitle =
      workspace.specialization ?? workspace.branch ?? "General Engineering";
    const syntheticKnowledge = createSyntheticSpecializationKnowledge(
      "general",
      "Engineering",
      fallbackTitle,
      workspace
    );

    return buildExpertProfileFromKnowledge(
      workspace,
      null,
      null,
      syntheticKnowledge
    );
  }

  const specializationKnowledge = resolveSpecializationKnowledgeForExpert(
    disciplineId,
    disciplineName,
    workspace
  );

  return buildExpertProfileFromKnowledge(
    workspace,
    disciplineId,
    disciplineName,
    specializationKnowledge
  );
};

export const listAllExpertProfileIds = (): string[] =>
  disciplineKnowledgeSchemas.flatMap((schema) =>
    Object.values(schema.specializations).map(
      (specialization) => `${schema.disciplineId}:${specialization.id}`
    )
  );

export const getExpertProfileForSpecialization = (
  disciplineId: string,
  specializationTitle: string,
  workspaceOverrides?: Partial<EngineeringWorkspace>
): EngineeringAIExpertProfile | undefined => {
  const knowledge = getSpecializationKnowledge(
    disciplineId,
    specializationTitle
  );

  if (!knowledge) {
    return undefined;
  }

  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  const workspace: EngineeringWorkspace = {
    domain: discipline?.name ?? null,
    branch: workspaceOverrides?.branch ?? null,
    specialization: specializationTitle,
    country: workspaceOverrides?.country ?? "India",
    codes: workspaceOverrides?.codes ?? ["IRC", "MORTH", "IS"],
    activeModule: workspaceOverrides?.activeModule ?? null,
  };

  return buildExpertProfileFromKnowledge(
    workspace,
    disciplineId,
    discipline?.name ?? null,
    knowledge
  );
};
