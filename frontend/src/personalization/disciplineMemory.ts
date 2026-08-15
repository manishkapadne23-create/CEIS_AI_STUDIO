import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { DisciplineMemory } from "./types";

const DEFAULT_MEMORY = (): DisciplineMemory => ({
  lastDisciplineId: localStorage.getItem("selectedEngineeringDomainId"),
  lastDisciplineName: localStorage.getItem("selectedEngineeringDomainName"),
  lastModuleId: null,
  recentSearch: null,
  recentCalculatorId: null,
  recentStandardId: null,
  recentWorkspace: null,
  updatedAt: Date.now(),
});

let memoryCache: DisciplineMemory | null = null;

const loadMemory = (): DisciplineMemory => {
  const raw = readPersistedString(PERSISTED_KEYS.disciplineMemory);
  if (!raw) {
    return DEFAULT_MEMORY();
  }
  try {
    return { ...DEFAULT_MEMORY(), ...(JSON.parse(raw) as DisciplineMemory) };
  } catch {
    return DEFAULT_MEMORY();
  }
};

export const getDisciplineMemory = (): DisciplineMemory => {
  if (!memoryCache) {
    memoryCache = loadMemory();
  }
  return memoryCache;
};

export const updateDisciplineMemory = (
  patch: Partial<DisciplineMemory>
): DisciplineMemory => {
  const next = { ...getDisciplineMemory(), ...patch, updatedAt: Date.now() };
  memoryCache = next;
  writePersistedString(PERSISTED_KEYS.disciplineMemory, JSON.stringify(next));
  return next;
};

export const rememberDisciplineSelection = (
  disciplineId: string,
  disciplineName: string
): void => {
  updateDisciplineMemory({
    lastDisciplineId: disciplineId,
    lastDisciplineName: disciplineName,
  });
};

export const rememberModuleSelection = (moduleId: WorkspaceCategoryId): void => {
  updateDisciplineMemory({ lastModuleId: moduleId });
};

export const rememberRecentSearch = (query: string): void => {
  if (!query.trim()) {
    return;
  }
  updateDisciplineMemory({ recentSearch: query.trim() });
};

export const rememberRecentCalculator = (calculatorId: string): void => {
  updateDisciplineMemory({ recentCalculatorId: calculatorId });
};

export const rememberRecentStandard = (standardId: string): void => {
  updateDisciplineMemory({ recentStandardId: standardId });
};

export const rememberRecentWorkspace = (workspaceLabel: string): void => {
  updateDisciplineMemory({ recentWorkspace: workspaceLabel });
};
