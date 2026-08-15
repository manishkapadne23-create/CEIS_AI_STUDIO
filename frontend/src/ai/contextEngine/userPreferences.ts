import type {
  EngineeringSubscriptionPlan,
  EngineeringUserLanguage,
} from "./types";

const STORAGE_KEYS = {
  subscriptionPlan: "sarathi.user.subscriptionPlan",
  language: "sarathi.user.language",
} as const;

export const DEFAULT_SUBSCRIPTION_PLAN: EngineeringSubscriptionPlan = "free";
export const DEFAULT_USER_LANGUAGE: EngineeringUserLanguage = "en";

const readStoredValue = <T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[]
): T => {
  try {
    const value = localStorage.getItem(key);

    if (value && allowed.includes(value as T)) {
      return value as T;
    }
  } catch {
    // Ignore storage failures.
  }

  return fallback;
};

export const readSubscriptionPlan = (): EngineeringSubscriptionPlan =>
  readStoredValue(
    STORAGE_KEYS.subscriptionPlan,
    DEFAULT_SUBSCRIPTION_PLAN,
    ["free", "professional", "enterprise"] as const
  );

export const readUserLanguage = (): EngineeringUserLanguage =>
  readStoredValue(STORAGE_KEYS.language, DEFAULT_USER_LANGUAGE, [
    "en",
    "hi",
    "ta",
    "te",
    "mr",
    "bn",
    "gu",
    "kn",
    "ml",
    "pa",
  ] as const);

export const writeSubscriptionPlan = (
  plan: EngineeringSubscriptionPlan
): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.subscriptionPlan, plan);
  } catch {
    // Ignore storage failures.
  }
};

export const writeUserLanguage = (language: EngineeringUserLanguage): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.language, language);
  } catch {
    // Ignore storage failures.
  }
};
