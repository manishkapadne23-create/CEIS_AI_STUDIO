import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import type { DisciplineDefinition } from "../knowledge/data/disciplineManifest";

const normalize = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export const resolveDisciplineByName = (
  name: string
): DisciplineDefinition | null => {
  const normalized = normalize(name);

  const exact = DISCIPLINE_DEFINITIONS.find(
    (discipline) => normalize(discipline.name) === normalized
  );
  if (exact) return exact;

  const partial = DISCIPLINE_DEFINITIONS.find(
    (discipline) =>
      normalized.includes(normalize(discipline.name)) ||
      normalize(discipline.name).includes(normalized)
  );
  if (partial) return partial;

  const firstWord = normalized.split(" ")[0];
  return (
    DISCIPLINE_DEFINITIONS.find((discipline) =>
      normalize(discipline.name).startsWith(firstWord)
    ) ?? null
  );
};

export const resolveDisciplineFromDomain = (input: {
  name: string;
  slug?: string | null;
}): DisciplineDefinition | null => {
  const byName = resolveDisciplineByName(input.name);
  if (byName) return byName;

  if (input.slug) {
    const slug = input.slug.toLowerCase();
    return (
      DISCIPLINE_DEFINITIONS.find(
        (discipline) =>
          discipline.id === slug ||
          discipline.id.replace(/-engineering$/, "") === slug
      ) ?? null
    );
  }

  return null;
};
