export type MentorDisciplineId =
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

export type SkillCategory =
  | "technical"
  | "software"
  | "management"
  | "communication"
  | "leadership";

export type LearningPlanDuration = "30-day" | "90-day" | "6-month" | "1-year";

export type CareerStage =
  | "student"
  | "graduate"
  | "junior"
  | "mid-level"
  | "senior"
  | "leadership";

export interface SkillEntry {
  name: string;
  category: SkillCategory;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  priority: "low" | "medium" | "high";
}

export interface SkillMatrix {
  technical: SkillEntry[];
  software: SkillEntry[];
  management: SkillEntry[];
  communication: SkillEntry[];
  leadership: SkillEntry[];
}

export interface Certification {
  id: string;
  name: string;
  type: "engineering" | "software" | "government" | "membership" | "training";
  disciplineId: MentorDisciplineId | "general";
  provider: string;
  description: string;
  relevance: string;
}

export interface LearningPlan {
  duration: LearningPlanDuration;
  title: string;
  goals: string[];
  weeklyMilestones: string[];
  resources: string[];
  assessments: string[];
}

export interface InterviewPrep {
  topic: string;
  technicalQuestions: string[];
  hrQuestions: string[];
  scenarioQuestions: string[];
  caseStudies: string[];
  discussionTips: string[];
}

export interface CareerReport {
  title: string;
  careerSummary: string;
  skillGaps: string[];
  learningPlan: string;
  certificationRoadmap: string;
  interviewPrep: string;
  professionalDevelopment: string;
  generatedAt: number;
}

export interface MentorWorkspace {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  conversationId: string | null;
  careerStage: CareerStage;
  focusArea: string;
  careerGoals: string[];
  skillMatrix: SkillMatrix;
  skillGaps: string[];
  learningPlans: LearningPlan[];
  certifications: Certification[];
  industryTrends: string[];
  professionalDevelopment: string[];
  status: "active" | "paused" | "completed";
  createdAt: number;
  updatedAt: number;
}

export interface MentorEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
}

export interface MentorEngineResult {
  active: boolean;
  activeWorkspace: MentorWorkspace | null;
  mentorAction: string | null;
  reportAction: string | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface MentorExtensionHooks {
  institutionIntegrationId?: string | null;
  corporateLearningId?: string | null;
  enterpriseTrainingId?: string | null;
  pmisCompetencyModuleId?: string | null;
}
