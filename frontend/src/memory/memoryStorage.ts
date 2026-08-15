import { MEMORY_SECURITY_CONFIG } from "./types";

const MEMORY_NAMESPACE = "sarathi.memory";

const getUserScope = (): string => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "anonymous";
    const user = JSON.parse(raw) as { id?: string; email?: string };
    return user.id ?? user.email ?? "anonymous";
  } catch {
    return "anonymous";
  }
};

const scopedKey = (key: string): string =>
  `${MEMORY_NAMESPACE}.${getUserScope()}.${key}`;

const encodePayload = (value: string): string => {
  if (!MEMORY_SECURITY_CONFIG.encryptionEnabled) return value;
  try {
    return btoa(unescape(encodeURIComponent(value)));
  } catch {
    return value;
  }
};

const decodePayload = (value: string): string => {
  if (!MEMORY_SECURITY_CONFIG.encryptionEnabled) return value;
  try {
    return decodeURIComponent(escape(atob(value)));
  } catch {
    return value;
  }
};

export const memoryStorageKeys = {
  context: () => scopedKey("context"),
  engineering: () => scopedKey("engineering"),
  preferences: () => scopedKey("preferences"),
} as const;

export const readMemoryJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const decoded = decodePayload(raw);
    return JSON.parse(decoded) as T;
  } catch {
    return fallback;
  }
};

export const writeMemoryJson = (key: string, value: unknown): void => {
  try {
    const serialized = JSON.stringify(value);
    const encoded = encodePayload(serialized);
    localStorage.setItem(key, encoded);
  } catch {
    // Ignore storage failures.
  }
};

export const deleteMemoryKey = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
};

export const listMemoryKeys = (): string[] => {
  const prefix = `${MEMORY_NAMESPACE}.${getUserScope()}.`;
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(prefix)) {
      keys.push(key);
    }
  }
  return keys;
};

export const clearUserMemory = (): void => {
  for (const key of listMemoryKeys()) {
    deleteMemoryKey(key);
  }
};

export const getMemoryUserScope = getUserScope;
