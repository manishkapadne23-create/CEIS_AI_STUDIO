import { useMemo } from "react";
import { knowledgeModuleRegistry } from "../data";
import { useKnowledgeModuleContext } from "../components/KnowledgeModuleProvider";
import type {
  KnowledgeModule,
  KnowledgeModuleSummary,
  KnowledgeNode,
} from "../types";

export interface UseKnowledgeModuleResult {
  disciplineId: string | null;
  specialization: string | null;
  specializationNode: KnowledgeNode | null;
  module: KnowledgeModule | null;
  summaries: KnowledgeModuleSummary[];
  isAvailable: boolean;
}

export const useKnowledgeModule = (): UseKnowledgeModuleResult => {
  const {
    disciplineId,
    specialization,
    specializationNode,
    module,
    isAvailable,
  } = useKnowledgeModuleContext();

  const summaries = useMemo(
    () => knowledgeModuleRegistry.listDisciplines(),
    []
  );

  return {
    disciplineId,
    specialization,
    specializationNode,
    module,
    summaries,
    isAvailable,
  };
};
