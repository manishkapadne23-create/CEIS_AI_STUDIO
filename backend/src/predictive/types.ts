export interface PredictiveBehaviorSignal {
  type:
    | "conversation"
    | "document"
    | "standard"
    | "calculation"
    | "workflow"
    | "learning"
    | "search"
    | "tool";
  title: string;
  resourceId?: string | null;
  disciplineId?: string | null;
  specializationId?: string | null;
  timestamp?: number;
}

export interface PredictiveContextInput {
  userId: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  recentConversations?: PredictiveBehaviorSignal[];
  recentDocuments?: PredictiveBehaviorSignal[];
  recentStandards?: PredictiveBehaviorSignal[];
  recentCalculations?: PredictiveBehaviorSignal[];
  recentWorkflows?: PredictiveBehaviorSignal[];
  learningProgress?: Array<{ topicId: string; progress: number }>;
  lastIntent?: string | null;
  lastTopic?: string | null;
}

export interface PredictiveRecommendation {
  id: string;
  categoryId: string;
  categoryLabel: string;
  title: string;
  description: string;
  moduleId: string;
  priority: number;
  confidence: number;
  reason: string;
}

export interface PredictiveTimelineItem {
  id: string;
  activityType: string;
  label: string;
  predictedAction: string;
  estimatedOrder: number;
  confidence: number;
}

export interface PredictiveReminder {
  id: string;
  type: string;
  label: string;
  message: string;
  priority: number;
}

export interface PredictiveRisk {
  id: string;
  categoryId: string;
  label: string;
  severity: string;
  description: string;
  mitigation: string;
  confidence: number;
}

export interface PredictiveLearningSuggestion {
  id: string;
  type: "next-topic" | "course" | "case-study" | "certification" | "best-practice";
  title: string;
  description: string;
  confidence: number;
}

export interface PredictiveProjectInsight {
  id: string;
  type:
    | "upcoming-deliverable"
    | "missing-input"
    | "pending-task"
    | "documentation-requirement"
    | "review-requirement";
  title: string;
  description: string;
  priority: number;
}

export interface PredictiveCoachInsight {
  mode: "daily" | "weekly" | "monthly";
  title: string;
  insights: string[];
  recommendations: string[];
}

export interface PredictiveUserPreferencesSnapshot {
  predictiveEnabled: boolean;
  recommendationsEnabled: boolean;
  timelineEnabled: boolean;
  remindersEnabled: boolean;
  riskPredictionEnabled: boolean;
  learningPredictionEnabled: boolean;
  projectAwarenessEnabled: boolean;
  aiCoachEnabled: boolean;
  shareBehaviorData: boolean;
}

export interface PredictiveIntelligencePackage {
  engine: "Engineering Predictive Intelligence Engine";
  version: string;
  enabled: boolean;
  preferences: PredictiveUserPreferencesSnapshot;
  behaviorSummary: {
    disciplineId: string | null;
    specializationId: string | null;
    dominantActivity: string | null;
    signalCount: number;
  };
  recommendations: PredictiveRecommendation[];
  timeline: PredictiveTimelineItem[];
  reminders: PredictiveReminder[];
  risks: PredictiveRisk[];
  learning: PredictiveLearningSuggestion[];
  projectInsights: PredictiveProjectInsight[];
  coach: PredictiveCoachInsight[];
  promptAugmentation: string;
  generatedAt: string;
}
