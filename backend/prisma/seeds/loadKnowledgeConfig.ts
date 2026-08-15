import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "..", "config");

export const loadJsonConfig = <T>(fileName: string): T => {
  const filePath = join(configDir, fileName);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
};

export interface DisciplineConfigEntry {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  color?: string;
  active: boolean;
  displayOrder: number;
}

export interface CategoryConfigEntry {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface SpecializationConfigEntry {
  id: string;
  disciplineId: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
}

export interface SampleKnowledgeItemConfig {
  disciplineId: string;
  categoryId: string;
  titleTemplate: string;
  keywords: string[];
  tags: string[];
  language: string;
  version: string;
  source: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  contentTemplate: string;
}

export const loadDisciplinesConfig = () =>
  loadJsonConfig<{ disciplines: DisciplineConfigEntry[] }>("disciplines.json");

export const loadCategoriesConfig = () =>
  loadJsonConfig<{ categories: CategoryConfigEntry[] }>("categories.json");

export const loadSpecializationsConfig = () =>
  loadJsonConfig<{ specializations: SpecializationConfigEntry[] }>(
    "specializations.json"
  );

export const loadSampleItemsConfig = () =>
  loadJsonConfig<{ items: SampleKnowledgeItemConfig[] }>("sampleKnowledgeItems.json");
