const readStringList = (key: string): string[] => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
};

const writeStringList = (key: string, values: string[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Ignore storage failures.
  }
};

const pushUnique = (values: string[], id: string, limit = 12): string[] => {
  const next = [id, ...values.filter((entry) => entry !== id)];
  return next.slice(0, limit);
};

export const standardsPersistenceKeys = {
  recentlyViewed: (disciplineId: string) =>
    `sarathi.standards.recentlyViewed.${disciplineId}`,
  frequentlyUsed: (disciplineId: string) =>
    `sarathi.standards.frequentlyUsed.${disciplineId}`,
  favourites: (disciplineId: string) =>
    `sarathi.standards.favourites.${disciplineId}`,
} as const;

export const readRecentlyViewedStandardIds = (disciplineId: string) =>
  readStringList(standardsPersistenceKeys.recentlyViewed(disciplineId));

export const readFrequentlyUsedStandardIds = (disciplineId: string) =>
  readStringList(standardsPersistenceKeys.frequentlyUsed(disciplineId));

export const readFavouriteStandardIds = (disciplineId: string) =>
  readStringList(standardsPersistenceKeys.favourites(disciplineId));

export const recordStandardView = (disciplineId: string, standardId: string) => {
  writeStringList(
    standardsPersistenceKeys.recentlyViewed(disciplineId),
    pushUnique(readRecentlyViewedStandardIds(disciplineId), standardId)
  );
  writeStringList(
    standardsPersistenceKeys.frequentlyUsed(disciplineId),
    pushUnique(readFrequentlyUsedStandardIds(disciplineId), standardId, 8)
  );
};

export const toggleFavouriteStandard = (
  disciplineId: string,
  standardId: string
): string[] => {
  const current = readFavouriteStandardIds(disciplineId);
  const next = current.includes(standardId)
    ? current.filter((entry) => entry !== standardId)
    : [standardId, ...current];

  writeStringList(standardsPersistenceKeys.favourites(disciplineId), next);

  return next;
};
