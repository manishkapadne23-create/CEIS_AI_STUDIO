export type KnowledgeFrameworkNodeType =
  | "root"
  | "discipline"
  | "specialization"
  | "category";

/**
 * Canonical storage path for future document indexing.
 * Format: ekf/{disciplineId}/{specializationId}/{categoryId}
 */
export type KnowledgeFrameworkPath = string;

export interface KnowledgeFrameworkCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export interface KnowledgeFrameworkSpecialization {
  id: string;
  label: string;
  disciplineId: string;
  path: KnowledgeFrameworkPath;
}

export interface KnowledgeFrameworkDiscipline {
  id: string;
  name: string;
  path: KnowledgeFrameworkPath;
  specializations: KnowledgeFrameworkSpecialization[];
}

export interface KnowledgeFrameworkCategoryFolder {
  id: string;
  label: string;
  description: string;
  icon: string;
  type: "category";
  path: KnowledgeFrameworkPath;
  documentCount: number;
}

export interface KnowledgeFrameworkSpecializationWorkspace {
  disciplineId: string;
  disciplineName: string;
  specializationId: string;
  specializationName: string;
  path: KnowledgeFrameworkPath;
  categories: KnowledgeFrameworkCategoryFolder[];
}

export interface KnowledgeFrameworkDisciplineTree {
  discipline: KnowledgeFrameworkDiscipline;
  /** Shared categories at discipline level (same taxonomy as specializations). */
  disciplineCategories: KnowledgeFrameworkCategoryFolder[];
}

export interface KnowledgeFrameworkConfig {
  version: string;
  schema: string;
  categories: KnowledgeFrameworkCategory[];
  disciplines: KnowledgeFrameworkDiscipline[];
}
