import { getEngineeringProfile } from "../personalization/profileEngine";
import { getUserPreferences } from "../personalization/preferencesManager";
import { readSubscriptionPlan } from "../ai/contextEngine/userPreferences";
import { getUnifiedFavorites } from "../personalization/favoritesManager";
import { readFavouriteCalculatorIds } from "../config/calculators/calculatorsPersistence";
import { loadContextMemory } from "./contextMemory";
import { buildEngineeringMemorySnapshot } from "./engineeringMemory";
import {
  clearUserMemory,
  deleteMemoryKey,
  listMemoryKeys,
  memoryStorageKeys,
  readMemoryJson,
  writeMemoryJson,
} from "./memoryStorage";
import type { MemoryExportBundle, UserMemorySnapshot } from "./types";

export const buildUserMemorySnapshot = (): UserMemorySnapshot => {
  const profile = getEngineeringProfile();
  const preferences = getUserPreferences();
  const favorites = getUnifiedFavorites();

  return {
    primaryDisciplineId: profile.primaryDisciplineId,
    primaryDisciplineName: profile.primaryDisciplineName,
    secondaryDisciplineId: profile.secondaryDisciplineId,
    secondaryDisciplineName: profile.secondaryDisciplineName,
    preferredStandards: profile.preferredStandards,
    preferredUnits: profile.preferredUnits,
    favouriteTools: favorites
      .filter((item) => item.type === "tool")
      .map((item) => item.title),
    frequentlyUsedCalculators: profile.primaryDisciplineId
      ? readFavouriteCalculatorIds(profile.primaryDisciplineId)
      : [],
    preferredLanguage: preferences.language,
    subscriptionPlan: readSubscriptionPlan(),
  };
};

export const viewMemoryBundle = (disciplineId?: string | null) => ({
  user: buildUserMemorySnapshot(),
  context: loadContextMemory(),
  engineering: buildEngineeringMemorySnapshot(disciplineId),
  keys: listMemoryKeys(),
});

export const updateUserMemoryField = (
  field: keyof UserMemorySnapshot,
  value: UserMemorySnapshot[keyof UserMemorySnapshot]
): UserMemorySnapshot => {
  const current = readMemoryJson<UserMemorySnapshot>(
    memoryStorageKeys.preferences(),
    buildUserMemorySnapshot()
  );
  const next = { ...current, [field]: value };
  writeMemoryJson(memoryStorageKeys.preferences(), next);
  return next;
};

export const deleteMemoryEntry = (key: string): void => {
  deleteMemoryKey(key);
};

export const clearSessionMemory = (): void => {
  deleteMemoryKey(memoryStorageKeys.context());
};

export const clearAllEngineeringMemory = (): void => {
  clearUserMemory();
};

export const exportMemoryBundle = (): MemoryExportBundle => ({
  exportedAt: Date.now(),
  userId: memoryStorageKeys.context().split(".")[2] ?? "anonymous",
  userMemory: buildUserMemorySnapshot(),
  contextMemory: loadContextMemory(),
  engineeringMemory: buildEngineeringMemorySnapshot(),
  version: "1.0.0",
});

export const downloadMemoryExport = (): void => {
  const bundle = exportMemoryBundle();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sarathi-engineering-memory-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};
