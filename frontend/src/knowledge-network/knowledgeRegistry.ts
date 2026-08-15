import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import {
  getKnowledgeRepository,
  getRepositoryEntriesByCategory,
  getRepositoryEntriesByDiscipline,
} from "./knowledgeRepository";
import type {
  DisciplineKnowledgeIndex,
  EngineeringKnowledgeCategory,
  KnowledgeEntry,
} from "./types";

const entryIndex = new Map<string, KnowledgeEntry>();

const hydrateIndex = (): void => {
  if (entryIndex.size > 0) return;
  for (const entry of getKnowledgeRepository()) {
    entryIndex.set(entry.id, entry);
  }
};

export const registerKnowledgeEntry = (entry: KnowledgeEntry): void => {
  hydrateIndex();
  entryIndex.set(entry.id, entry);
};

export const getKnowledgeEntry = (entryId: string): KnowledgeEntry | null => {
  hydrateIndex();
  return entryIndex.get(entryId) ?? null;
};

export const listAllKnowledgeEntries = (): KnowledgeEntry[] => {
  hydrateIndex();
  return Array.from(entryIndex.values());
};

export const listDisciplineKnowledgeIndices = (): DisciplineKnowledgeIndex[] =>
  DISCIPLINE_DEFINITIONS.map((discipline) => {
    const entries = getRepositoryEntriesByDiscipline(discipline.id);
    const categories = [
      ...new Set(entries.map((entry) => entry.category)),
    ] as EngineeringKnowledgeCategory[];

    return {
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      entryCount: entries.length,
      categories,
    };
  });

export const getDisciplineKnowledgeIndex = (
  disciplineId: string
): DisciplineKnowledgeIndex | null =>
  listDisciplineKnowledgeIndices().find(
    (index) => index.disciplineId === disciplineId
  ) ?? null;

export const getRegistryStats = (): {
  totalEntries: number;
  disciplineCount: number;
  categoryCount: number;
} => {
  hydrateIndex();
  const categories = new Set(
    Array.from(entryIndex.values()).map((entry) => entry.category)
  );
  return {
    totalEntries: entryIndex.size,
    disciplineCount: DISCIPLINE_DEFINITIONS.length,
    categoryCount: categories.size,
  };
};

export const searchRegistryByCategory = (
  category: EngineeringKnowledgeCategory,
  disciplineId?: string | null
): KnowledgeEntry[] => {
  const entries = getRepositoryEntriesByCategory(category);
  if (!disciplineId) return entries;
  return entries.filter((entry) => entry.disciplineId === disciplineId);
};
