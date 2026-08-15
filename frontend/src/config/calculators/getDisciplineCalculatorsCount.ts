import { getCalculatorsCatalogByDisciplineId } from "./index";

export const getDisciplineCalculatorsCount = (
  disciplineId: string | null | undefined
): number =>
  getCalculatorsCatalogByDisciplineId(disciplineId)?.calculators.length ?? 0;
