import { loadCoachModes, loadReminderTypes } from "./loadPredictiveConfig.js";
import type { BehaviorAnalysis } from "./behaviorAnalyzer.js";
import type {
  PredictiveCoachInsight,
  PredictiveContextInput,
  PredictiveLearningSuggestion,
  PredictiveProjectInsight,
  PredictiveReminder,
} from "./types.js";

export const generateReminders = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveReminder[] => {
  const types = loadReminderTypes();
  const reminders: PredictiveReminder[] = [];

  if (behavior.hasStandardsActivity) {
    const revision = types.find((entry) => entry.id === "code-revisions");
    if (revision) {
      reminders.push({
        id: "reminder-code-revisions",
        type: revision.id,
        label: revision.label,
        message: "Check for recent code revisions affecting your active standards.",
        priority: 8,
      });
    }
  }

  if (behavior.hasLearningActivity) {
    const training = types.find((entry) => entry.id === "training-programs");
    if (training) {
      reminders.push({
        id: "reminder-training",
        type: training.id,
        label: training.label,
        message: "New training programs may align with your recent learning activity.",
        priority: 6,
      });
    }
  }

  const webinar = types.find((entry) => entry.id === "upcoming-webinars");
  if (webinar) {
    reminders.push({
      id: "reminder-webinars",
      type: webinar.id,
      label: webinar.label,
      message: "Upcoming engineering webinars may be relevant to your discipline.",
      priority: 5,
    });
  }

  return reminders;
};

export const generateLearningPredictions = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveLearningSuggestion[] => {
  const topic = input.lastTopic ?? behavior.recentTopics[0] ?? "engineering fundamentals";
  const discipline = input.disciplineName ?? "Engineering";

  return [
    {
      id: "learn-next-topic",
      type: "next-topic",
      title: `Advanced ${topic}`,
      description: `Continue learning in ${discipline} based on recent activity.`,
      confidence: 0.78,
    },
    {
      id: "learn-case-study",
      type: "case-study",
      title: `${topic} Case Studies`,
      description: "Review real project case studies for practical application.",
      confidence: 0.72,
    },
    {
      id: "learn-certification",
      type: "certification",
      title: "Professional Certification Path",
      description: `Certification opportunities aligned with ${discipline}.`,
      confidence: 0.65,
    },
    {
      id: "learn-best-practice",
      type: "best-practice",
      title: "Industry Best Practices",
      description: "Latest best practices for your current engineering focus.",
      confidence: 0.7,
    },
  ];
};

export const generateProjectInsights = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveProjectInsight[] => {
  if (!input.projectId && !input.projectName) {
    return [];
  }

  const project = input.projectName ?? "Current Project";

  return [
    {
      id: "project-deliverable",
      type: "upcoming-deliverable",
      title: `Upcoming deliverable for ${project}`,
      description: "Review project schedule for the next engineering submission.",
      priority: 8,
    },
    {
      id: "project-missing-input",
      type: "missing-input",
      title: "Missing design inputs",
      description: "Verify survey, geotechnical, and loading data before final design.",
      priority: 7,
    },
    {
      id: "project-documentation",
      type: "documentation-requirement",
      title: "Documentation requirements",
      description: "Ensure drawings, calculations, and specifications are aligned.",
      priority: 7,
    },
    {
      id: "project-review",
      type: "review-requirement",
      title: "Design review pending",
      description: "Schedule interdisciplinary design review before issue.",
      priority: 6,
    },
  ];
};

export const generateCoachInsights = (
  input: PredictiveContextInput,
  behavior: BehaviorAnalysis
): PredictiveCoachInsight[] => {
  const modes = loadCoachModes();
  const discipline = input.disciplineName ?? "your discipline";

  return modes.map((mode) => ({
    mode: mode.id as PredictiveCoachInsight["mode"],
    title: mode.label,
    insights: [
      `Primary focus: ${behavior.dominantActivity ?? "general engineering"} in ${discipline}.`,
      `Recent topics: ${behavior.recentTopics.slice(0, 3).join(", ") || "none yet"}.`,
    ],
    recommendations: [
      "Review applicable standards before the next design iteration.",
      "Complete pending calculations and document assumptions.",
      "Schedule a QA/QC checkpoint for upcoming deliverables.",
    ],
  }));
};
