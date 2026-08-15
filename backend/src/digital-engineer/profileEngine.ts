import { loadExpertiseDomains } from "./loadEdeConfig.js";
import type {
  EdDigitalEngineerProfile,
  EdExpertiseModel,
  EdPersonalLibrary,
  EdProficiencyLevel,
  EdWorkingStyle,
} from "./types.js";

export const defaultWorkingStyle = (): EdWorkingStyle => ({
  frequentlyUsedStandards: [],
  frequentlyUsedCalculators: [],
  frequentlyUsedTemplates: [],
  frequentlyUsedReports: [],
  frequentlyAskedTopics: [],
  preferredAgents: [],
  preferredWorkflows: [],
});

export const defaultPersonalLibrary = (): EdPersonalLibrary => ({
  favouriteStandards: [],
  favouriteClauses: [],
  favouriteDocuments: [],
  favouriteCalculators: [],
  favouriteTemplates: [],
  favouriteReports: [],
});

export const defaultExpertise = (): EdExpertiseModel => {
  const domains = loadExpertiseDomains().domains;
  return Object.fromEntries(
    domains.map((domain) => [domain.id, "intermediate" as EdProficiencyLevel])
  );
};

export const buildDefaultProfile = (userId: string): EdDigitalEngineerProfile => ({
  userId,
  primaryDisciplineId: null,
  primaryDisciplineName: null,
  secondaryDisciplineId: null,
  secondaryDisciplineName: null,
  specializationIds: [],
  specializationNames: [],
  yearsOfExperience: null,
  industry: null,
  preferredStandards: [],
  preferredDesignMethods: [],
  preferredUnits: "metric",
  preferredSoftware: [],
  languagePreferences: ["en"],
  workingStyle: defaultWorkingStyle(),
  expertise: defaultExpertise(),
  personalLibrary: defaultPersonalLibrary(),
  learningEnabled: true,
  lastActivityAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const mergeProfileFromRecord = (
  userId: string,
  record: {
    primaryDisciplineId: string | null;
    primaryDisciplineName: string | null;
    secondaryDisciplineId: string | null;
    secondaryDisciplineName: string | null;
    specializationIds: string[];
    specializationNames: string[];
    yearsOfExperience: number | null;
    industry: string | null;
    preferredStandards: string[];
    preferredDesignMethods: string[];
    preferredUnits: string;
    preferredSoftware: string[];
    languagePreferences: string[];
    workingStyle: unknown;
    expertise: unknown;
    personalLibrary: unknown;
    learningEnabled: boolean;
    lastActivityAt: Date;
    updatedAt: Date;
  }
): EdDigitalEngineerProfile => ({
  userId,
  primaryDisciplineId: record.primaryDisciplineId,
  primaryDisciplineName: record.primaryDisciplineName,
  secondaryDisciplineId: record.secondaryDisciplineId,
  secondaryDisciplineName: record.secondaryDisciplineName,
  specializationIds: record.specializationIds,
  specializationNames: record.specializationNames,
  yearsOfExperience: record.yearsOfExperience,
  industry: record.industry,
  preferredStandards: record.preferredStandards,
  preferredDesignMethods: record.preferredDesignMethods,
  preferredUnits: record.preferredUnits,
  preferredSoftware: record.preferredSoftware,
  languagePreferences: record.languagePreferences,
  workingStyle: (record.workingStyle as EdWorkingStyle) ?? defaultWorkingStyle(),
  expertise: (record.expertise as EdExpertiseModel) ?? defaultExpertise(),
  personalLibrary:
    (record.personalLibrary as EdPersonalLibrary) ?? defaultPersonalLibrary(),
  learningEnabled: record.learningEnabled,
  lastActivityAt: record.lastActivityAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const profileToExportPayload = (profile: EdDigitalEngineerProfile) => ({
  exportedAt: new Date().toISOString(),
  engine: "Engineering Digital Engineer",
  version: "1.0.0",
  profile,
});
