import {
  buildCategoryKnowledgePath,
  buildDisciplineKnowledgePath,
} from "./buildKnowledgePaths";
import {
  getFrameworkDisciplineById,
  getFrameworkSpecialization,
  loadKnowledgeFrameworkConfig,
} from "./loadFrameworkConfig";
import type {
  KnowledgeFrameworkCategoryFolder,
  KnowledgeFrameworkDisciplineTree,
  KnowledgeFrameworkSpecializationWorkspace,
} from "./types";

const buildCategoryFolders = (
  disciplineId: string,
  specializationId: string
): KnowledgeFrameworkCategoryFolder[] =>
  loadKnowledgeFrameworkConfig().categories.map((category) => ({
    id: category.id,
    label: category.label,
    description: category.description,
    icon: category.icon,
    type: "category",
    path: buildCategoryKnowledgePath(disciplineId, specializationId, category.id),
    documentCount: 0,
  }));

export class KnowledgeFrameworkEngine {
  private static instance: KnowledgeFrameworkEngine | null = null;

  static getInstance(): KnowledgeFrameworkEngine {
    if (!this.instance) {
      this.instance = new KnowledgeFrameworkEngine();
    }
    return this.instance;
  }

  getConfig() {
    return loadKnowledgeFrameworkConfig();
  }

  listDisciplines() {
    return this.getConfig().disciplines;
  }

  listCategories() {
    return this.getConfig().categories;
  }

  getDisciplineTree(disciplineId: string): KnowledgeFrameworkDisciplineTree | null {
    const discipline = getFrameworkDisciplineById(disciplineId);
    if (!discipline) {
      return null;
    }

    return {
      discipline,
      disciplineCategories: buildCategoryFolders(disciplineId, "_discipline"),
    };
  }

  getSpecializationWorkspace(
    disciplineId: string,
    specializationId: string
  ): KnowledgeFrameworkSpecializationWorkspace | null {
    const discipline = getFrameworkDisciplineById(disciplineId);
    const specialization = getFrameworkSpecialization(
      disciplineId,
      specializationId
    );

    if (!discipline || !specialization) {
      return null;
    }

    return {
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      specializationId: specialization.id,
      specializationName: specialization.label,
      path: specialization.path,
      categories: buildCategoryFolders(disciplineId, specializationId),
    };
  }

  /** Returns the full virtual folder tree for a discipline (specializations + shared categories). */
  getDisciplineFolderTree(disciplineId: string): string[] {
    const tree = this.getDisciplineTree(disciplineId);
    if (!tree) {
      return [];
    }

    const paths: string[] = [buildDisciplineKnowledgePath(disciplineId)];

    for (const category of tree.disciplineCategories) {
      paths.push(category.path);
    }

    for (const specialization of tree.discipline.specializations) {
      paths.push(specialization.path);
      for (const category of buildCategoryFolders(
        disciplineId,
        specialization.id
      )) {
        paths.push(category.path);
      }
    }

    return paths;
  }
}

export const knowledgeFrameworkEngine = KnowledgeFrameworkEngine.getInstance();
