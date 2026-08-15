import { readUserLanguage } from "../ai/contextEngine";
import type { EngineeringUserLanguage } from "../ai/contextEngine/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { getFrequentByType } from "./learningEngine";
import type { ExperienceLevel, UserLearningProfile } from "./types";

const STORAGE_KEY = "sarathi.intelligence.profile";

const DEFAULT_PROFILE = (): UserLearningProfile => ({
  disciplineId: null,
  disciplineName: null,
  specialization: null,
  experienceLevel: "mid",
  favouriteModules: [],
  preferredStandards: [],
  frequentlyUsedTools: [],
  preferredLanguage: readUserLanguage(),
  recentActivities: [],
  updatedAt: Date.now(),
});

let profileCache: UserLearningProfile | null = null;

const hydrate = (): UserLearningProfile => {
  if (profileCache) return profileCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    profileCache = raw
      ? { ...DEFAULT_PROFILE(), ...(JSON.parse(raw) as UserLearningProfile) }
      : DEFAULT_PROFILE();
  } catch {
    profileCache = DEFAULT_PROFILE();
  }
  return profileCache;
};

const persist = (profile: UserLearningProfile): void => {
  profileCache = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const getUserLearningProfile = (): UserLearningProfile => hydrate();

export const updateUserLearningProfile = (
  updates: Partial<UserLearningProfile>
): UserLearningProfile => {
  const profile = { ...hydrate(), ...updates, updatedAt: Date.now() };
  persist(profile);
  return profile;
};

export const syncProfileFromSession = (
  disciplineId: string | null,
  disciplineName: string | null,
  moduleId: WorkspaceCategoryId | null,
  activity: string,
  language?: EngineeringUserLanguage
): UserLearningProfile => {
  const profile = hydrate();

  if (disciplineId) {
    profile.disciplineId = disciplineId;
    profile.disciplineName = disciplineName;
  }

  if (moduleId && !profile.favouriteModules.includes(moduleId)) {
    const modules = getFrequentByType("module", 5).map((r) => r.resourceId as WorkspaceCategoryId);
    profile.favouriteModules = [
      ...new Set([...modules, ...(moduleId ? [moduleId] : [])]),
    ].slice(0, 6);
  }

  profile.preferredStandards = getFrequentByType("standard", 6).map((r) => r.label);
  profile.frequentlyUsedTools = getFrequentByType("professional-tool", 6).map(
    (r) => r.label
  );

  if (language) profile.preferredLanguage = language;

  profile.recentActivities = [
    activity,
    ...profile.recentActivities.filter((a) => a !== activity),
  ].slice(0, 12);

  persist(profile);
  return profile;
};

export const inferExperienceLevel = (message: string): ExperienceLevel | null => {
  if (/\b(student|university|exam)\b/i.test(message)) return "student";
  if (/\b(fresh|graduate|fresher)\b/i.test(message)) return "graduate";
  if (/\b(junior|entry[\s-]level)\b/i.test(message)) return "junior";
  if (/\b(senior|lead|principal)\b/i.test(message)) return "senior";
  if (/\b(expert|specialist|consultant)\b/i.test(message)) return "expert";
  return null;
};

export const formatProfileForPrompt = (profile: UserLearningProfile): string =>
  [
    `Discipline: ${profile.disciplineName ?? "not set"}`,
    `Specialization: ${profile.specialization ?? "general"}`,
    `Experience: ${profile.experienceLevel}`,
    `Language: ${profile.preferredLanguage}`,
    `Favourite modules: ${profile.favouriteModules.join(", ") || "none yet"}`,
    `Preferred standards: ${profile.preferredStandards.join(", ") || "none yet"}`,
    `Frequent tools: ${profile.frequentlyUsedTools.join(", ") || "none yet"}`,
    `Recent: ${profile.recentActivities.slice(0, 5).join("; ") || "none"}`,
  ].join("\n");
