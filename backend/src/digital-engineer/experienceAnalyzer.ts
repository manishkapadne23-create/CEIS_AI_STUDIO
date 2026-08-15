import { loadAdaptationRules } from "./loadEdeConfig.js";
import type { EdDigitalEngineerProfile, EdProficiencyLevel } from "./types.js";

export const estimateExperienceLevel = (
  profile: EdDigitalEngineerProfile
): EdProficiencyLevel => {
  const rules = loadAdaptationRules().experienceLevelMap;
  const years = profile.yearsOfExperience ?? 0;

  if (years <= 2) {
    return rules["0-2"] as EdProficiencyLevel;
  }
  if (years <= 5) {
    return rules["3-5"] as EdProficiencyLevel;
  }
  if (years <= 10) {
    return rules["6-10"] as EdProficiencyLevel;
  }
  return rules["11+"] as EdProficiencyLevel;
};

export const analyzeExperienceSummary = (profile: EdDigitalEngineerProfile) => {
  const level = estimateExperienceLevel(profile);
  const discipline = profile.primaryDisciplineName ?? "General Engineering";

  return {
    experienceLevel: level,
    yearsOfExperience: profile.yearsOfExperience,
    discipline,
    specializations: profile.specializationNames,
    industry: profile.industry,
    summary: `${level} level ${discipline} engineer${
      profile.yearsOfExperience ? ` with ${profile.yearsOfExperience} years experience` : ""
    }.`,
  };
};
