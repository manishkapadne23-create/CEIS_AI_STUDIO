import { analyzeBehavior } from "./behaviorAnalyzer.js";
import { getPredictivePublicConfig } from "./loadPredictiveConfig.js";
import {
  generateCoachInsights,
  generateLearningPredictions,
  generateProjectInsights,
  generateReminders,
} from "./notificationEngine.js";
import { generateRecommendations } from "./recommendationEngine.js";
import { predictRisks } from "./riskPredictor.js";
import { buildSmartTimeline } from "./timelineEngine.js";
import type {
  PredictiveContextInput,
  PredictiveIntelligencePackage,
  PredictiveUserPreferencesSnapshot,
} from "./types.js";

const ENGINE_VERSION = "1.0.0";

const emptyPackage = (
  preferences: PredictiveUserPreferencesSnapshot
): PredictiveIntelligencePackage => ({
  engine: "Engineering Predictive Intelligence Engine",
  version: ENGINE_VERSION,
  enabled: false,
  preferences,
  behaviorSummary: {
    disciplineId: null,
    specializationId: null,
    dominantActivity: null,
    signalCount: 0,
  },
  recommendations: [],
  timeline: [],
  reminders: [],
  risks: [],
  learning: [],
  projectInsights: [],
  coach: [],
  promptAugmentation: "",
  generatedAt: new Date().toISOString(),
});

export const buildPredictivePromptAugmentation = (
  pkg: PredictiveIntelligencePackage
): string => {
  if (!pkg.enabled) {
    return "";
  }

  const sections: string[] = [
    "## Predictive Engineering Context",
    "Use the following proactive intelligence to anticipate engineering needs. Do not repeat this block verbatim.",
  ];

  if (pkg.recommendations.length > 0) {
    sections.push(
      "### Suggested Next Actions",
      ...pkg.recommendations.slice(0, 4).map(
        (entry) =>
          `- ${entry.title} (${Math.round(entry.confidence * 100)}% confidence): ${entry.reason}`
      )
    );
  }

  if (pkg.timeline.length > 0) {
    sections.push(
      "### Predicted Timeline",
      ...pkg.timeline.slice(0, 3).map(
        (entry) => `- ${entry.label}: ${entry.predictedAction}`
      )
    );
  }

  if (pkg.risks.length > 0) {
    sections.push(
      "### Risk Alerts",
      ...pkg.risks.slice(0, 3).map(
        (entry) => `- [${entry.severity}] ${entry.label}: ${entry.mitigation}`
      )
    );
  }

  return sections.join("\n");
};

export const runPredictiveIntelligenceEngine = (
  input: PredictiveContextInput,
  preferences: PredictiveUserPreferencesSnapshot
): PredictiveIntelligencePackage => {
  if (!preferences.predictiveEnabled) {
    return emptyPackage(preferences);
  }

  const behavior = analyzeBehavior(input);

  const recommendations = preferences.recommendationsEnabled
    ? generateRecommendations(input, behavior)
    : [];

  const timeline = preferences.timelineEnabled
    ? buildSmartTimeline(input, behavior)
    : [];

  const reminders = preferences.remindersEnabled
    ? generateReminders(input, behavior)
    : [];

  const risks = preferences.riskPredictionEnabled
    ? predictRisks(input, behavior)
    : [];

  const learning = preferences.learningPredictionEnabled
    ? generateLearningPredictions(input, behavior)
    : [];

  const projectInsights =
    preferences.projectAwarenessEnabled && (input.projectId || input.projectName)
      ? generateProjectInsights(input, behavior)
      : [];

  const coach = preferences.aiCoachEnabled
    ? generateCoachInsights(input, behavior)
    : [];

  const pkg: PredictiveIntelligencePackage = {
    engine: "Engineering Predictive Intelligence Engine",
    version: ENGINE_VERSION,
    enabled: true,
    preferences,
    behaviorSummary: {
      disciplineId: behavior.disciplineId,
      specializationId: behavior.specializationId,
      dominantActivity: behavior.dominantActivity,
      signalCount: behavior.signalCount,
    },
    recommendations,
    timeline,
    reminders,
    risks,
    learning,
    projectInsights,
    coach,
    promptAugmentation: "",
    generatedAt: new Date().toISOString(),
  };

  pkg.promptAugmentation = buildPredictivePromptAugmentation(pkg);
  return pkg;
};

export const getPredictiveEngineConfig = () => ({
  ...getPredictivePublicConfig(),
  futureReady: [
    "digital-twin-prediction",
    "construction-progress-prediction",
    "resource-prediction",
    "pmis-predictive-analytics",
    "ai-executive-advisor",
  ],
});
