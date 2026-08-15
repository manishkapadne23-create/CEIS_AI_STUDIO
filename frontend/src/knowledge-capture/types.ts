export type LessonDisciplineId =
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

export type LessonCategory =
  | "design"
  | "construction"
  | "manufacturing"
  | "maintenance"
  | "qa-qc"
  | "safety"
  | "tender"
  | "contracts"
  | "claims"
  | "planning"
  | "cost"
  | "technology"
  | "materials"
  | "equipment";

export type ProjectType =
  | "infrastructure"
  | "industrial"
  | "commercial"
  | "residential"
  | "energy"
  | "transport"
  | "water"
  | "general";

export interface KnowledgeCaptureFields {
  problem: string;
  rootCause: string;
  solution: string;
  engineeringDecision: string;
  engineeringAssumption: string;
  bestPractice: string;
  innovation: string;
  mistakeAvoided: string;
  recommendation: string;
  referenceDocuments: string[];
}

export interface LessonEntry {
  id: string;
  title: string;
  category: LessonCategory;
  disciplineId: string | null;
  disciplineName: string | null;
  projectType: ProjectType;
  standard: string | null;
  material: string | null;
  technology: string | null;
  keywords: string[];
  capture: KnowledgeCaptureFields;
  createdAt: number;
  updatedAt: number;
}

export interface BestPractice {
  id: string;
  title: string;
  category: LessonCategory;
  disciplineId: LessonDisciplineId | "general";
  description: string;
  applicability: string;
  sourceLessonIds: string[];
}

export interface PreventiveAction {
  id: string;
  issue: string;
  preventiveAction: string;
  category: LessonCategory;
  priority: "low" | "medium" | "high";
}

export interface LessonsLearnedWorkspace {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  conversationId: string | null;
  projectName: string | null;
  projectType: ProjectType;
  lessons: LessonEntry[];
  bestPractices: BestPractice[];
  preventiveActions: PreventiveAction[];
  recommendations: string[];
  status: "active" | "archived";
  createdAt: number;
  updatedAt: number;
}

export interface LessonsLearnedReport {
  title: string;
  executiveSummary: string;
  lessonsSummary: string;
  bestPracticesGuide: string;
  preventiveActions: string;
  recommendationRegister: string;
  knowledgeSummary: string;
  generatedAt: number;
}

export interface LessonEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName?: string | null;
}

export interface LessonEngineResult {
  active: boolean;
  activeWorkspace: LessonsLearnedWorkspace | null;
  lessonAction: string | null;
  reportAction: string | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface LessonExtensionHooks {
  enterpriseKnowledgeBaseId?: string | null;
  corporateKnowledgePortalId?: string | null;
  pmisKnowledgeManagementId?: string | null;
  crossProjectLearningId?: string | null;
  aiKnowledgeMiningId?: string | null;
}

export const LESSON_CATEGORIES: { id: LessonCategory; label: string }[] = [
  { id: "design", label: "Design" },
  { id: "construction", label: "Construction" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "maintenance", label: "Maintenance" },
  { id: "qa-qc", label: "QA/QC" },
  { id: "safety", label: "Safety" },
  { id: "tender", label: "Tender" },
  { id: "contracts", label: "Contracts" },
  { id: "claims", label: "Claims" },
  { id: "planning", label: "Planning" },
  { id: "cost", label: "Cost" },
  { id: "technology", label: "Technology" },
  { id: "materials", label: "Materials" },
  { id: "equipment", label: "Equipment" },
];
