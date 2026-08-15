/**
 * Canonical path builder for the Engineering Knowledge Framework (EKF).
 * Designed for scalable document storage — paths are stable identifiers.
 */

export const EKF_ROOT = "ekf";

export const buildDisciplineKnowledgePath = (disciplineId: string): string =>
  `${EKF_ROOT}/${disciplineId}`;

export const buildSpecializationKnowledgePath = (
  disciplineId: string,
  specializationId: string
): string => `${EKF_ROOT}/${disciplineId}/${specializationId}`;

export const buildCategoryKnowledgePath = (
  disciplineId: string,
  specializationId: string,
  categoryId: string
): string => `${EKF_ROOT}/${disciplineId}/${specializationId}/${categoryId}`;

export const parseKnowledgeFrameworkPath = (
  path: string
): {
  disciplineId: string | null;
  specializationId: string | null;
  categoryId: string | null;
} => {
  const segments = path.replace(/^ekf\/?/, "").split("/").filter(Boolean);

  return {
    disciplineId: segments[0] ?? null,
    specializationId: segments[1] ?? null,
    categoryId: segments[2] ?? null,
  };
};
