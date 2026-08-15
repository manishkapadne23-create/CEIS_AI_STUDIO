import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import { getKnowledgeModule } from "../data/registry";
import type { KnowledgeModule, KnowledgeNode } from "../types";
import { findKnowledgeNodeByName } from "./knowledgeModuleUtils";

export const getDisciplineIdByName = (
  disciplineName: string | null
): string | null => {
  if (!disciplineName) {
    return null;
  }

  return (
    DISCIPLINE_DEFINITIONS.find(
      (discipline) => discipline.name === disciplineName
    )?.id ?? null
  );
};

export const resolveKnowledgeModuleFromWorkspace = (
  workspace: Pick<
    EngineeringWorkspace,
    "domain" | "specialization"
  >
): KnowledgeModule | null => {
  if (!workspace.specialization) {
    return null;
  }

  const disciplineId = getDisciplineIdByName(workspace.domain);

  if (!disciplineId) {
    return null;
  }

  return getKnowledgeModule(disciplineId) ?? null;
};

export const resolveSpecializationNode = (
  module: KnowledgeModule | null,
  specialization: string | null
): KnowledgeNode | null => {
  if (!module || !specialization) {
    return null;
  }

  return (
    findKnowledgeNodeByName(module.rootNodes, specialization)
      ?.node ?? null
  );
};
