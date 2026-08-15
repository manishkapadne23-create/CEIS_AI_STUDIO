import { readUserLanguage } from "../ai/contextEngine/userPreferences";
import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { UserPreferences } from "./types";

const DEFAULT_PREFERENCES = (): UserPreferences => ({
  theme: "dark",
  language: readUserLanguage(),
  units: "metric",
  dateFormat: "dd/mm/yyyy",
  defaultDisciplineId: localStorage.getItem("selectedEngineeringDomainId"),
  defaultWorkspace: null,
  notifications: {
    email: true,
    push: true,
    learning: true,
    standards: true,
    tasks: true,
  },
  updatedAt: Date.now(),
});

let preferencesCache: UserPreferences | null = null;

export const getUserPreferences = (): UserPreferences => {
  if (preferencesCache) {
    return preferencesCache;
  }
  const raw = readPersistedString(PERSISTED_KEYS.userPreferences);
  if (!raw) {
    preferencesCache = DEFAULT_PREFERENCES();
    return preferencesCache;
  }
  try {
    preferencesCache = { ...DEFAULT_PREFERENCES(), ...(JSON.parse(raw) as UserPreferences) };
    return preferencesCache;
  } catch {
    preferencesCache = DEFAULT_PREFERENCES();
    return preferencesCache;
  }
};

export const updateUserPreferences = (
  patch: Partial<UserPreferences>
): UserPreferences => {
  const next = { ...getUserPreferences(), ...patch, updatedAt: Date.now() };
  preferencesCache = next;
  writePersistedString(PERSISTED_KEYS.userPreferences, JSON.stringify(next));
  return next;
};

export const applyThemePreference = (theme: UserPreferences["theme"]): void => {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.remove("dark");
    return;
  }
  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", prefersDark);
};
