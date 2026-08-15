export type ResearchDisciplineId =
  | "civil-engineering"
  | "mechanical-engineering"
  | "electrical-engineering"
  | "computer-engineering"
  | "electronics-telecommunication-engineering"
  | "chemical-engineering"
  | "environmental-engineering"
  | "mining-engineering"
  | "marine-engineering"
  | "railway-engineering"
  | "aerospace-engineering"
  | "industrial-engineering"
  | "automation-robotics"
  | "renewable-energy"
  | "architecture-planning"
  | "agricultural-engineering"
  | "oil-gas-engineering"
  | "biomedical-engineering";

export type ResearchCategory =
  | "fundamental"
  | "applied"
  | "experimental"
  | "computational"
  | "review"
  | "innovation"
  | "technology-assessment";

export interface ResearchTopic {
  id: string;
  title: string;
  disciplineId: ResearchDisciplineId;
  disciplineName: string;
  category: ResearchCategory;
  description: string;
  keywords: string[];
  relatedTopics: string[];
}

export interface ResearchWorkspace {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  conversationId: string | null;
  topic: string;
  problemStatement: string;
  objectives: string[];
  researchGaps: string[];
  innovationIdeas: string[];
  methodology: string[];
  limitations: string[];
  futureScope: string[];
  keywords: string[];
  literatureNotes: string[];
  technologyComparisons: string[];
  status: "exploring" | "defined" | "in-progress" | "completed";
  createdAt: number;
  updatedAt: number;
}

export interface TechnologyReview {
  technology: string;
  overview: string;
  advantages: string[];
  limitations: string[];
  applications: string[];
  emergingTrends: string[];
  researchOpportunities: string[];
  readinessLevel: string;
}

export interface InnovationAssessment {
  idea: string;
  feasibility: "low" | "medium" | "high";
  trl: string;
  engineeringApplications: string[];
  comparisonNotes: string[];
  validationSteps: string[];
}

export interface ResearchReport {
  title: string;
  researchBrief: string;
  technologyReview: string;
  innovationSummary: string;
  researchOutline: string;
  presentationSummary: string;
  discussionNotes: string;
  futureDirections: string;
  generatedAt: number;
}

export interface ResearchEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
}

export interface ResearchEngineResult {
  active: boolean;
  activeWorkspace: ResearchWorkspace | null;
  researchAction: string | null;
  reportAction: string | null;
  technologyReview: TechnologyReview | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface ResearchExtensionHooks {
  academicDatabaseId?: string | null;
  patentSearchId?: string | null;
  researchCollaborationId?: string | null;
  institutionPortalId?: string | null;
  pmisKnowledgeTransferId?: string | null;
}
