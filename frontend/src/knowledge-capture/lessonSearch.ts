import type { LessonCategory, LessonEntry } from "./types";
import { LESSON_CATEGORIES } from "./types";

export interface LessonSearchFilters {
  query?: string;
  disciplineId?: string | null;
  category?: LessonCategory | null;
  projectType?: string | null;
  standard?: string | null;
  material?: string | null;
  technology?: string | null;
}

export const searchLessons = (
  lessons: LessonEntry[],
  filters: LessonSearchFilters
): LessonEntry[] => {
  let results = [...lessons];

  if (filters.disciplineId) {
    results = results.filter((l) => l.disciplineId === filters.disciplineId);
  }

  if (filters.category) {
    results = results.filter((l) => l.category === filters.category);
  }

  if (filters.projectType) {
    results = results.filter(
      (l) => l.projectType === filters.projectType
    );
  }

  if (filters.standard) {
    const s = filters.standard.toLowerCase();
    results = results.filter(
      (l) => l.standard?.toLowerCase().includes(s)
    );
  }

  if (filters.material) {
    const m = filters.material.toLowerCase();
    results = results.filter(
      (l) =>
        l.material?.toLowerCase().includes(m) ||
        l.capture.problem.toLowerCase().includes(m)
    );
  }

  if (filters.technology) {
    const t = filters.technology.toLowerCase();
    results = results.filter(
      (l) =>
        l.technology?.toLowerCase().includes(t) ||
        l.keywords.some((k) => k.includes(t))
    );
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.capture.problem.toLowerCase().includes(q) ||
        l.capture.solution.toLowerCase().includes(q) ||
        l.capture.rootCause.toLowerCase().includes(q) ||
        l.capture.recommendation.toLowerCase().includes(q) ||
        l.keywords.some((k) => k.includes(q))
    );
  }

  return results;
};

export const findSimilarLessons = (
  lessons: LessonEntry[],
  query: string,
  limit = 5
): LessonEntry[] => {
  const q = query.toLowerCase();
  const qWords = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = lessons.map((lesson) => {
    let score = 0;
    const text = [
      lesson.title,
      lesson.capture.problem,
      lesson.capture.rootCause,
      lesson.capture.solution,
      ...lesson.keywords,
    ]
      .join(" ")
      .toLowerCase();

    for (const word of qWords) {
      if (text.includes(word)) score += 1;
    }
    if (lesson.category.includes(q)) score += 2;
    if (lesson.material?.toLowerCase().includes(q)) score += 2;
    if (lesson.technology?.toLowerCase().includes(q)) score += 2;

    return { lesson, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.lesson);
};

export const resolveCategoryFromQuery = (query: string): LessonCategory | null => {
  const q = query.toLowerCase();
  for (const cat of LESSON_CATEGORIES) {
    if (q.includes(cat.id) || q.includes(cat.label.toLowerCase())) {
      return cat.id;
    }
  }
  return null;
};

export const formatSearchResults = (results: LessonEntry[]): string =>
  results.length === 0
    ? "No matching lessons found."
    : [
        `SEARCH RESULTS (${results.length}):`,
        ...results.map(
          (l, i) =>
            `${i + 1}. [${l.category}] ${l.title} — ${l.capture.problem.slice(0, 80)}`
        ),
      ].join("\n");

export const formatSimilarLessons = (lessons: LessonEntry[], query: string): string =>
  lessons.length === 0
    ? `No similar lessons found for "${query}".`
    : [
        `SIMILAR LESSONS for "${query}":`,
        ...lessons.map(
          (l, i) =>
            `${i + 1}. [${l.category}] ${l.title}\n   Problem: ${l.capture.problem.slice(0, 100)}`
        ),
      ].join("\n\n");
