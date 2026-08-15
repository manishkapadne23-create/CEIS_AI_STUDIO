import { buildAdaptationContext, buildAdaptationPromptAugmentation } from "./adaptationEngine.js";
import { analyzeExperienceSummary } from "./experienceAnalyzer.js";
import { generateEngineeringInsights } from "./insightGenerator.js";
import { getEdePublicConfig } from "./loadEdeConfig.js";
import {
  applyActivityToWorkingStyle,
  buildPersonalLibraryFromSignals,
  mergePreferredStandards,
} from "./preferenceEngine.js";
import { buildDefaultProfile, mergeProfileFromRecord } from "./profileEngine.js";
import { estimateExpertiseFromActivity, analyzeSkillDevelopment } from "./skillAnalyzer.js";
import type {
  EdDigitalEngineerPackage,
  EdDigitalEngineerProfile,
  EdEngineContextInput,
} from "./types.js";

const ENGINE_VERSION = "1.0.0";

export const assembleDigitalEngineerPackage = (input: {
  profile: EdDigitalEngineerProfile;
  signals?: Array<{
    signalType: string;
    resourceLabel: string | null;
    usageCount: number;
  }>;
  context?: EdEngineContextInput;
}): EdDigitalEngineerPackage => {
  const { profile } = input;
  const signals = input.signals ?? [];

  const workingStyle = profile.learningEnabled
    ? applyActivityToWorkingStyle(profile.workingStyle, signals)
    : profile.workingStyle;

  const personalLibrary = profile.learningEnabled
    ? buildPersonalLibraryFromSignals(profile, signals)
    : profile.personalLibrary;

  const enrichedProfile: EdDigitalEngineerProfile = {
    ...profile,
    workingStyle,
    personalLibrary,
    preferredStandards: mergePreferredStandards(profile, workingStyle),
  };

  const expertise = profile.learningEnabled
    ? estimateExpertiseFromActivity(enrichedProfile, workingStyle)
    : enrichedProfile.expertise;

  const skillDevelopment = analyzeSkillDevelopment(enrichedProfile, expertise);
  const adaptation = buildAdaptationContext(enrichedProfile, input.context);
  const insights = generateEngineeringInsights(
    enrichedProfile,
    workingStyle,
    expertise,
    skillDevelopment
  );

  const pkg: EdDigitalEngineerPackage = {
    engine: "Engineering Digital Engineer",
    version: ENGINE_VERSION,
    enabled: true,
    profile: { ...enrichedProfile, expertise },
    adaptation,
    skillDevelopment,
    insights,
    promptAugmentation: "",
    generatedAt: new Date().toISOString(),
  };

  pkg.promptAugmentation = buildAdaptationPromptAugmentation(
    enrichedProfile,
    adaptation
  );

  void analyzeExperienceSummary(enrichedProfile);

  return pkg;
};

export const runDigitalEngineerEngine = (
  profile: EdDigitalEngineerProfile | null,
  userId: string,
  context?: EdEngineContextInput,
  signals?: Array<{
    signalType: string;
    resourceLabel: string | null;
    usageCount: number;
  }>
): EdDigitalEngineerPackage => {
  const resolvedProfile = profile ?? buildDefaultProfile(userId);

  if (!resolvedProfile.learningEnabled) {
    return {
      engine: "Engineering Digital Engineer",
      version: ENGINE_VERSION,
      enabled: false,
      profile: resolvedProfile,
      adaptation: buildAdaptationContext(resolvedProfile, context),
      skillDevelopment: {
        knowledgeGaps: [],
        recommendedCourses: [],
        suggestedCertifications: [],
        emergingTechnologies: [],
        professionalDevelopmentGoals: [],
      },
      insights: [],
      promptAugmentation: "",
      generatedAt: new Date().toISOString(),
    };
  }

  return assembleDigitalEngineerPackage({
    profile: resolvedProfile,
    signals,
    context,
  });
};

export const getDigitalEngineerEngineConfig = () => getEdePublicConfig();

export { mergeProfileFromRecord, buildDefaultProfile };
