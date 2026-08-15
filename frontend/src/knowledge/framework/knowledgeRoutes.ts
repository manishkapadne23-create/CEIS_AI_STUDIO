import { disciplineIdToSlug } from "../../navigation/disciplineSlugs";

export const buildKnowledgeDisciplinePath = (disciplineId: string): string =>
  `/knowledge/${disciplineIdToSlug(disciplineId)}`;

export const buildKnowledgeWorkspacePath = (
  disciplineId: string,
  specializationId: string
): string =>
  `/knowledge/${disciplineIdToSlug(disciplineId)}/${encodeURIComponent(specializationId)}`;

export const buildKnowledgeCategoryPath = (
  disciplineId: string,
  specializationId: string,
  categoryId: string
): string =>
  `${buildKnowledgeWorkspacePath(disciplineId, specializationId)}/${encodeURIComponent(categoryId)}`;
