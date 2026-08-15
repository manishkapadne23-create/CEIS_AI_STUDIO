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

export const calculatorsPersistenceKeys = {
  recentlyUsed: (disciplineId: string) =>
    `sarathi.calculators.recentlyUsed.${disciplineId}`,
  favourites: (disciplineId: string) =>
    `sarathi.calculators.favourites.${disciplineId}`,
} as const;

export const readRecentlyUsedCalculatorIds = (disciplineId: string) =>
  readStringList(calculatorsPersistenceKeys.recentlyUsed(disciplineId));

export const readFavouriteCalculatorIds = (disciplineId: string) =>
  readStringList(calculatorsPersistenceKeys.favourites(disciplineId));

export const recordCalculatorOpen = (
  disciplineId: string,
  calculatorId: string
) => {
  writeStringList(
    calculatorsPersistenceKeys.recentlyUsed(disciplineId),
    pushUnique(readRecentlyUsedCalculatorIds(disciplineId), calculatorId)
  );
};

export const toggleFavouriteCalculator = (
  disciplineId: string,
  calculatorId: string
): string[] => {
  const current = readFavouriteCalculatorIds(disciplineId);
  const next = current.includes(calculatorId)
    ? current.filter((entry) => entry !== calculatorId)
    : [calculatorId, ...current];

  writeStringList(calculatorsPersistenceKeys.favourites(disciplineId), next);

  return next;
};
