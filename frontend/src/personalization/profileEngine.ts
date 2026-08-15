import { readUserLanguage, writeUserLanguage } from "../ai/contextEngine/userPreferences";
import {
  getUserLearningProfile,
  updateUserLearningProfile,
} from "../intelligence/personalizationEngine";
import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { EngineeringUserProfile } from "./types";

const DEFAULT_PROFILE = (): EngineeringUserProfile => ({
  primaryDisciplineId:
    localStorage.getItem("selectedEngineeringDomainId") ?? null,
  primaryDisciplineName:
    localStorage.getItem("selectedEngineeringDomainName") ?? null,
  secondaryDisciplineId: null,
  secondaryDisciplineName: null,
  experienceLevel: "mid",
  industry: null,
  organization: null,
  designation: null,
  country: null,
  language: readUserLanguage(),
  preferredStandards: [],
  preferredUnits: "metric",
  updatedAt: Date.now(),
});

const loadProfile = (): EngineeringUserProfile => {
  const raw = readPersistedString(PERSISTED_KEYS.engineeringProfile);
  if (!raw) {
    const learning = getUserLearningProfile();
    return {
      ...DEFAULT_PROFILE(),
      primaryDisciplineId: learning.disciplineId ?? DEFAULT_PROFILE().primaryDisciplineId,
      primaryDisciplineName: learning.disciplineName ?? DEFAULT_PROFILE().primaryDisciplineName,
      experienceLevel: learning.experienceLevel,
      preferredStandards: learning.preferredStandards,
      language: learning.preferredLanguage,
    };
  }
  try {
    return { ...DEFAULT_PROFILE(), ...(JSON.parse(raw) as EngineeringUserProfile) };
  } catch {
    return DEFAULT_PROFILE();
  }
};

let profileCache: EngineeringUserProfile | null = null;

export const getEngineeringProfile = (): EngineeringUserProfile => {
  if (!profileCache) {
    profileCache = loadProfile();
  }
  return profileCache;
};

export const updateEngineeringProfile = (
  patch: Partial<EngineeringUserProfile>
): EngineeringUserProfile => {
  const next = { ...getEngineeringProfile(), ...patch, updatedAt: Date.now() };
  profileCache = next;
  writePersistedString(PERSISTED_KEYS.engineeringProfile, JSON.stringify(next));

  if (patch.primaryDisciplineId !== undefined) {
    if (patch.primaryDisciplineId) {
      localStorage.setItem("selectedEngineeringDomainId", patch.primaryDisciplineId);
    }
  }
  if (patch.primaryDisciplineName !== undefined && patch.primaryDisciplineName) {
    localStorage.setItem("selectedEngineeringDomainName", patch.primaryDisciplineName);
  }
  if (patch.language) {
    writeUserLanguage(patch.language);
  }

  updateUserLearningProfile({
    disciplineId: next.primaryDisciplineId,
    disciplineName: next.primaryDisciplineName,
    experienceLevel: next.experienceLevel,
    preferredStandards: next.preferredStandards,
    preferredLanguage: next.language,
  });

  return next;
};

export const syncProfileDiscipline = (
  disciplineId: string | null,
  disciplineName: string | null
): void => {
  if (!disciplineId || !disciplineName) {
    return;
  }
  updateEngineeringProfile({
    primaryDisciplineId: disciplineId,
    primaryDisciplineName: disciplineName,
  });
};

export const formatProfileSummary = (profile: EngineeringUserProfile): string =>
  [
    profile.primaryDisciplineName ?? "Discipline not set",
    profile.secondaryDisciplineName ? `+ ${profile.secondaryDisciplineName}` : null,
    profile.experienceLevel,
    profile.designation,
    profile.organization,
  ]
    .filter(Boolean)
    .join(" · ");
