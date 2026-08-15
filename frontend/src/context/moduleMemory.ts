import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import {
  createEmptyModuleSnapshot,
  type ModuleSessionSnapshot,
} from "./memoryTypes";
import {
  ensureDisciplineSnapshot,
  getDisciplineModuleSnapshot,
  saveDisciplineContext,
} from "./disciplineMemory";

export const getModuleSnapshot = (
  disciplineId: string | null,
  moduleId: WorkspaceCategoryId | null
): ModuleSessionSnapshot | null => {
  if (!disciplineId || !moduleId) return null;
  return getDisciplineModuleSnapshot(disciplineId, moduleId);
};

export interface UpdateModuleMemoryInput {
  disciplineId: string;
  disciplineName: string;
  moduleId: WorkspaceCategoryId;
  searchQuery?: string;
  selectedStandardCode?: string | null;
  activeCalculatorId?: string | null;
  activeDocumentIds?: string[];
  recentQuery?: string;
}

export const updateModuleMemory = (
  input: UpdateModuleMemoryInput
): ModuleSessionSnapshot => {
  const discipline = ensureDisciplineSnapshot(
    input.disciplineId,
    input.disciplineName
  );

  const existing =
    discipline.moduleSnapshots[input.moduleId] ??
    createEmptyModuleSnapshot(input.moduleId);

  const recentQueries = input.recentQuery
    ? [input.recentQuery, ...existing.recentQueries.filter((q) => q !== input.recentQuery)].slice(0, 8)
    : existing.recentQueries;

  const updated: ModuleSessionSnapshot = {
    ...existing,
    searchQuery: input.searchQuery ?? existing.searchQuery,
    selectedStandardCode:
      input.selectedStandardCode !== undefined
        ? input.selectedStandardCode
        : existing.selectedStandardCode,
    activeCalculatorId:
      input.activeCalculatorId !== undefined
        ? input.activeCalculatorId
        : existing.activeCalculatorId,
    activeDocumentIds:
      input.activeDocumentIds ?? existing.activeDocumentIds,
    recentQueries,
    lastActiveAt: Date.now(),
  };

  saveDisciplineContext({
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    topic: discipline.topic,
    conversationId: discipline.conversationId,
    projectContext: discipline.projectContext,
    moduleSnapshots: {
      ...discipline.moduleSnapshots,
      [input.moduleId]: updated,
    },
  });

  return updated;
};

export const clearModuleMemory = (
  disciplineId: string,
  disciplineName: string,
  moduleId: WorkspaceCategoryId
): void => {
  const discipline = ensureDisciplineSnapshot(disciplineId, disciplineName);
  const { [moduleId]: _removed, ...remaining } = discipline.moduleSnapshots;

  saveDisciplineContext({
    disciplineId,
    disciplineName,
    topic: discipline.topic,
    conversationId: discipline.conversationId,
    projectContext: discipline.projectContext,
    moduleSnapshots: remaining,
  });
};
