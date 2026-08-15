import type {
  DisciplineCalculatorsCatalog,
  EngineeringCalculatorMetadata,
  EngineeringCalculatorStatus,
} from "./types";

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export interface CreateCalculatorEntryInput {
  name: string;
  description: string;
  category: string;
  status?: EngineeringCalculatorStatus;
  isPopular?: boolean;
}

export const createCalculatorEntry = (
  disciplineId: string,
  disciplineName: string,
  entry: CreateCalculatorEntryInput
): EngineeringCalculatorMetadata => ({
  id: `${disciplineId}-${slugify(entry.name)}`,
  disciplineId,
  disciplineName,
  status: entry.status ?? "coming-soon",
  ...entry,
});

export const createDisciplineCalculatorsCatalog = (
  disciplineId: string,
  disciplineName: string,
  entries: CreateCalculatorEntryInput[]
): DisciplineCalculatorsCatalog => ({
  disciplineId,
  disciplineName,
  calculators: entries.map((entry) =>
    createCalculatorEntry(disciplineId, disciplineName, entry)
  ),
});
