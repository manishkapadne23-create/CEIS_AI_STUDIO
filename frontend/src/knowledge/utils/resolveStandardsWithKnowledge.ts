import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { getSpecializationKnowledge } from "../data/schemas";
import { getStandardsRegistry } from "../standards/standardsRegistry";
import type {
  ResolvedEngineeringStandard,
  ResolvedEngineeringStandards,
} from "../types/EngineeringStandard";
import {
  ENGINEERING_STANDARD_FAMILY_LABELS,
} from "../types/EngineeringStandard";
import { getDisciplineIdByName } from "./resolveKnowledgeModule";

const normalizeCode = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, "");

export const resolveStandardsWithKnowledge = (
  workspace: EngineeringWorkspace
): ResolvedEngineeringStandards => {
  const disciplineId = getDisciplineIdByName(workspace.domain);
  const disciplineName = workspace.domain;
  const standardsRegistry = disciplineId
    ? getStandardsRegistry(disciplineId)
    : undefined;

  const specializationKnowledge = (() => {
    if (!disciplineId) {
      return null;
    }

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

    return null;
  })();

  const knowledgeCodes = new Set(
    (specializationKnowledge?.designStandards ?? []).map((standard) =>
      normalizeCode(standard.code ?? standard.title)
    )
  );

  const resolvedStandards: ResolvedEngineeringStandard[] =
    standardsRegistry?.documents.map((document) => ({
      id: document.id,
      code: document.code,
      title: document.title,
      description: document.description,
      family: document.family,
      familyLabel: ENGINEERING_STANDARD_FAMILY_LABELS[document.family],
      status: document.status,
      fromKnowledgeRepository: knowledgeCodes.has(
        normalizeCode(document.code)
      ),
    })) ?? [];

  specializationKnowledge?.designStandards.forEach((knowledgeStandard) => {
    const normalizedCode = normalizeCode(
      knowledgeStandard.code ?? knowledgeStandard.title
    );
    const alreadyIncluded = resolvedStandards.some(
      (standard) => normalizeCode(standard.code) === normalizedCode
    );

    if (!alreadyIncluded) {
      resolvedStandards.push({
        id: knowledgeStandard.id,
        code: knowledgeStandard.code ?? knowledgeStandard.title,
        title: knowledgeStandard.title,
        description: knowledgeStandard.description,
        family: "general",
        familyLabel: ENGINEERING_STANDARD_FAMILY_LABELS.general,
        status: "reference",
        fromKnowledgeRepository: true,
      });
    }
  });

  const families = [
    ...new Set(resolvedStandards.map((standard) => standard.family)),
  ];

  return {
    disciplineId,
    disciplineName,
    specialization: workspace.specialization,
    families,
    standards: resolvedStandards,
  };
};
