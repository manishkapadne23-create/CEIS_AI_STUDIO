import { countKnowledgeNodes } from "../utils/knowledgeModuleUtils";
import type {
  KnowledgeModule,
  KnowledgeModuleRegistry,
  KnowledgeModuleSummary,
} from "../types";
import { disciplineKnowledgeModules } from "./disciplines";

const modules = disciplineKnowledgeModules.reduce<
  Record<string, KnowledgeModule>
>((accumulator, module) => {
  accumulator[module.disciplineId] = module;
  return accumulator;
}, {});

export const knowledgeModuleRegistry: KnowledgeModuleRegistry = {
  modules,
  getModule(disciplineId: string) {
    return modules[disciplineId];
  },
  listDisciplines(): KnowledgeModuleSummary[] {
    return disciplineKnowledgeModules.map((module) => ({
      id: module.id,
      disciplineId: module.disciplineId,
      disciplineName: module.disciplineName,
      nodeCount: countKnowledgeNodes(module.rootNodes),
      isAvailable: module.rootNodes.length > 0,
      version: module.version,
    }));
  },
};

export const getKnowledgeModule = (
  disciplineId: string
): KnowledgeModule | undefined =>
  knowledgeModuleRegistry.getModule(disciplineId);
