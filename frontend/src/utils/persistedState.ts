import { useCallback, useState } from "react";

export const PERSISTED_KEYS = {
  appSidebarCollapsed: "sarathi.panels.appSidebarCollapsed",
  modulePanelCollapsed: "sarathi.panels.modulePanelCollapsed",
  lastSidebarRoute: "sarathi.navigation.lastRoute",
  chatSessions: "sarathi.chat.sessions",
  currentChatId: "sarathi.chat.currentId",
  workspaceNavigation: "sarathi.navigation.workspace",
  searchHistory: "sarathi.search.history",
  engineeringProfile: "sarathi.personalization.profile",
  userPreferences: "sarathi.personalization.preferences",
  disciplineMemory: "sarathi.personalization.disciplineMemory",
  activityLog: "sarathi.personalization.activity",
  decisionWorkspace: "sarathi.decision.workspace",
  engineeringMemory: "sarathi.memory.context",
} as const;

export const readPersistedBoolean = (
  key: string,
  fallback: boolean
): boolean => {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return value === "true";
  } catch {
    return fallback;
  }
};

export const writePersistedBoolean = (
  key: string,
  value: boolean
): void => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Ignore storage failures in private browsing or restricted contexts.
  }
};

export const readPersistedString = (
  key: string,
  fallback: string | null = null
): string | null => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writePersistedString = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in private browsing or restricted contexts.
  }
};

export const usePersistedBoolean = (
  key: string,
  fallback: boolean
): [boolean, (value: boolean | ((previous: boolean) => boolean)) => void] => {
  const [value, setValue] = useState(() => readPersistedBoolean(key, fallback));

  const setPersistedValue = useCallback(
    (next: boolean | ((previous: boolean) => boolean)) => {
      setValue((previous) => {
        const resolved =
          typeof next === "function" ? next(previous) : next;

        writePersistedBoolean(key, resolved);

        return resolved;
      });
    },
    [key]
  );

  return [value, setPersistedValue];
};
