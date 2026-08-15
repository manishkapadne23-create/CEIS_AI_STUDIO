import type { EngineeringUserLanguage } from "../ai/contextEngine/types";
import type { ExperienceLevel } from "../intelligence/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type PreferredUnits = "metric" | "imperial" | "mixed";
export type DateFormatPreference = "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd";
export type ThemePreference = "dark" | "light" | "system";

export type FavoriteResourceType =
  | "standard"
  | "calculator"
  | "document"
  | "template"
  | "conversation"
  | "report"
  | "tool"
  | "workflow"
  | "learning";

export interface EngineeringUserProfile {
  primaryDisciplineId: string | null;
  primaryDisciplineName: string | null;
  secondaryDisciplineId: string | null;
  secondaryDisciplineName: string | null;
  experienceLevel: ExperienceLevel;
  industry: string | null;
  organization: string | null;
  designation: string | null;
  country: string | null;
  language: EngineeringUserLanguage;
  preferredStandards: string[];
  preferredUnits: PreferredUnits;
  updatedAt: number;
}

export interface UserPreferences {
  theme: ThemePreference;
  language: EngineeringUserLanguage;
  units: PreferredUnits;
  dateFormat: DateFormatPreference;
  defaultDisciplineId: string | null;
  defaultWorkspace: WorkspaceCategoryId | null;
  notifications: {
    email: boolean;
    push: boolean;
    learning: boolean;
    standards: boolean;
    tasks: boolean;
  };
  updatedAt: number;
}

export interface DisciplineMemory {
  lastDisciplineId: string | null;
  lastDisciplineName: string | null;
  lastModuleId: WorkspaceCategoryId | null;
  recentSearch: string | null;
  recentCalculatorId: string | null;
  recentStandardId: string | null;
  recentWorkspace: string | null;
  updatedAt: number;
}

export interface FavoriteItem {
  id: string;
  type: FavoriteResourceType;
  title: string;
  resourceId: string;
  disciplineId: string | null;
  createdAt: number;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  folder: string | null;
  bookmarkIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ActivityRecord {
  id: string;
  type:
    | "chat"
    | "search"
    | "standard"
    | "document"
    | "calculator"
    | "learning"
    | "template"
    | "workflow"
    | "tool";
  title: string;
  resourceId: string | null;
  disciplineId: string | null;
  timestamp: number;
}

export interface PersonalizedItem {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  route?: string;
  icon?: string;
}

export interface SmartRecommendations {
  standards: PersonalizedItem[];
  calculators: PersonalizedItem[];
  tools: PersonalizedItem[];
  templates: PersonalizedItem[];
  learning: PersonalizedItem[];
  aiExperts: PersonalizedItem[];
  documents: PersonalizedItem[];
}

export interface PersonalizedHomeBundle {
  recentConversations: PersonalizedItem[];
  frequentStandards: PersonalizedItem[];
  frequentCalculators: PersonalizedItem[];
  frequentTools: PersonalizedItem[];
  recommendedLearning: PersonalizedItem[];
  recentDocuments: PersonalizedItem[];
  savedTemplates: PersonalizedItem[];
  recentReports: PersonalizedItem[];
  smartRecommendations: SmartRecommendations;
  recentActivity: ActivityRecord[];
  productivity: PersonalizedItem[];
}

export interface PersonalizationSearchContext {
  disciplineId: string | null;
  favoriteResourceIds: Set<string>;
  recentResourceIds: Set<string>;
  frequentResourceIds: Set<string>;
}

/** Future-ready extension flags */
export interface PersonalizationCapabilities {
  behavioralLearning: boolean;
  institutionProfiles: boolean;
  organizationProfiles: boolean;
  teamPreferences: boolean;
  pmisUserProfiles: boolean;
}

export const PERSONALIZATION_CAPABILITIES: PersonalizationCapabilities = {
  behavioralLearning: false,
  institutionProfiles: false,
  organizationProfiles: false,
  teamPreferences: false,
  pmisUserProfiles: false,
};
