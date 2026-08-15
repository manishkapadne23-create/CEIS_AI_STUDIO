export type EdProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type EdExpertiseDomainId =
  | "design"
  | "construction"
  | "planning"
  | "contracts"
  | "qa-qc"
  | "safety"
  | "research"
  | "project-controls";

export interface EdWorkingStyle {
  frequentlyUsedStandards: string[];
  frequentlyUsedCalculators: string[];
  frequentlyUsedTemplates: string[];
  frequentlyUsedReports: string[];
  frequentlyAskedTopics: string[];
  preferredAgents: string[];
  preferredWorkflows: string[];
}

export interface EdExpertiseModel {
  [key: string]: EdProficiencyLevel;
}

export interface EdPersonalLibrary {
  favouriteStandards: string[];
  favouriteClauses: string[];
  favouriteDocuments: string[];
  favouriteCalculators: string[];
  favouriteTemplates: string[];
  favouriteReports: string[];
}

export interface EdDigitalEngineerProfile {
  userId: string;
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
  workingStyle: EdWorkingStyle;
  expertise: EdExpertiseModel;
  personalLibrary: EdPersonalLibrary;
  learningEnabled: boolean;
  lastActivityAt: string;
  updatedAt: string;
}

export interface EdSkillDevelopment {
  knowledgeGaps: string[];
  recommendedCourses: string[];
  suggestedCertifications: string[];
  emergingTechnologies: string[];
  professionalDevelopmentGoals: string[];
}

export interface EdEngineeringInsight {
  type: "weekly-summary" | "monthly-learning" | "skill-growth" | "activity-report";
  title: string;
  summary: string;
  highlights: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface EdAdaptationContext {
  experienceLevel: EdProficiencyLevel;
  disciplineId: string | null;
  disciplineName: string | null;
  specializationId: string | null;
  specializationName: string | null;
  currentWorkspaceId: string | null;
  currentProjectId: string | null;
  currentProjectName: string | null;
  previousDecisions: string[];
}

export interface EdDigitalEngineerPackage {
  engine: "Engineering Digital Engineer";
  version: string;
  enabled: boolean;
  profile: EdDigitalEngineerProfile;
  adaptation: EdAdaptationContext;
  skillDevelopment: EdSkillDevelopment;
  insights: EdEngineeringInsight[];
  promptAugmentation: string;
  generatedAt: string;
}

export interface EdProfileUpdateInput {
  primaryDisciplineId?: string | null;
  primaryDisciplineName?: string | null;
  secondaryDisciplineId?: string | null;
  secondaryDisciplineName?: string | null;
  specializationIds?: string[];
  specializationNames?: string[];
  yearsOfExperience?: number | null;
  industry?: string | null;
  preferredStandards?: string[];
  preferredDesignMethods?: string[];
  preferredUnits?: string;
  preferredSoftware?: string[];
  languagePreferences?: string[];
  expertise?: EdExpertiseModel;
  learningEnabled?: boolean;
}

export interface EdActivitySignalInput {
  signalType:
    | "STANDARD"
    | "CALCULATOR"
    | "TEMPLATE"
    | "REPORT"
    | "TOPIC"
    | "AGENT"
    | "WORKFLOW"
    | "DOCUMENT"
    | "CLAUSE";
  resourceId?: string | null;
  resourceLabel?: string | null;
  disciplineId?: string | null;
}

export interface EdEngineContextInput {
  userId: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  workspaceId?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  message?: string | null;
  standards?: string[];
  agents?: string[];
}
