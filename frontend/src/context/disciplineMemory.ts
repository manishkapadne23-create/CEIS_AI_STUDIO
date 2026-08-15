import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import {
  createEmptyProjectContext,
  type DisciplineSessionSnapshot,
  type EngineeringProjectContext,
} from "./memoryTypes";

const disciplineStore = new Map<string, DisciplineSessionSnapshot>();

export const getDisciplineSnapshot = (
  disciplineId: string
): DisciplineSessionSnapshot | null => disciplineStore.get(disciplineId) ?? null;

export const ensureDisciplineSnapshot = (
  disciplineId: string,
  disciplineName: string
): DisciplineSessionSnapshot => {
  const existing = disciplineStore.get(disciplineId);
  if (existing) return existing;

  const created: DisciplineSessionSnapshot = {
    disciplineId,
    disciplineName,
    topic: null,
    projectContext: createEmptyProjectContext(),
    moduleSnapshots: {},
    conversationId: null,
    lastActiveAt: Date.now(),
  };
  disciplineStore.set(disciplineId, created);
  return created;
};

export interface SaveDisciplineContextInput {
  disciplineId: string;
  disciplineName: string;
  topic: string | null;
  conversationId: string | null;
  projectContext: EngineeringProjectContext;
  moduleSnapshots: DisciplineSessionSnapshot["moduleSnapshots"];
}

export const saveDisciplineContext = (
  input: SaveDisciplineContextInput
): DisciplineSessionSnapshot => {
  const snapshot: DisciplineSessionSnapshot = {
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    topic: input.topic,
    projectContext: input.projectContext,
    moduleSnapshots: input.moduleSnapshots,
    conversationId: input.conversationId,
    lastActiveAt: Date.now(),
  };
  disciplineStore.set(input.disciplineId, snapshot);
  return snapshot;
};

export const restoreDisciplineContext = (
  disciplineId: string
): DisciplineSessionSnapshot | null => {
  const snapshot = disciplineStore.get(disciplineId);
  if (!snapshot) return null;

  disciplineStore.set(disciplineId, {
    ...snapshot,
    lastActiveAt: Date.now(),
  });
  return snapshot;
};

export const updateDisciplineTopic = (
  disciplineId: string,
  topic: string | null
): void => {
  const snapshot = disciplineStore.get(disciplineId);
  if (!snapshot) return;

  disciplineStore.set(disciplineId, {
    ...snapshot,
    topic,
    lastActiveAt: Date.now(),
  });
};

export const updateDisciplineProjectContext = (
  disciplineId: string,
  updater: (context: EngineeringProjectContext) => EngineeringProjectContext
): void => {
  const snapshot = disciplineStore.get(disciplineId);
  if (!snapshot) return;

  disciplineStore.set(disciplineId, {
    ...snapshot,
    projectContext: updater(snapshot.projectContext),
    lastActiveAt: Date.now(),
  });
};

export const getDisciplineModuleSnapshot = (
  disciplineId: string,
  moduleId: WorkspaceCategoryId
) => disciplineStore.get(disciplineId)?.moduleSnapshots[moduleId] ?? null;

export const listDisciplineSnapshots = (): DisciplineSessionSnapshot[] =>
  Array.from(disciplineStore.values());

export const resetDisciplineMemoryStore = (): void => {
  disciplineStore.clear();
};
