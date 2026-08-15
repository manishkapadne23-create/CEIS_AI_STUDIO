import { DISCIPLINE_STANDARDS_CATALOGS } from "./catalogRegistry";
import type { DisciplineStandardsCatalog } from "./types";

const catalogByDisciplineId = new Map(
  DISCIPLINE_STANDARDS_CATALOGS.map((catalog) => [catalog.disciplineId, catalog])
);

export const getStandardsCatalogByDisciplineId = (
  disciplineId: string | null | undefined
): DisciplineStandardsCatalog | null =>
  disciplineId ? catalogByDisciplineId.get(disciplineId) ?? null : null;

export const getDisciplineStandardsCount = (
  disciplineId: string | null | undefined
): number =>
  getStandardsCatalogByDisciplineId(disciplineId)?.standards.length ?? 0;
