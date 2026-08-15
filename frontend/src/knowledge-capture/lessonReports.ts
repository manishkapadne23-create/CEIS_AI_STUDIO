import type { BestPractice, LessonsLearnedReport, LessonsLearnedWorkspace } from "./types";
import { formatBestPracticeGuide } from "./bestPracticeLibrary";
import { summarizeLessons } from "./knowledgeCapture";
import {
  buildRecommendationRegister,
  formatPreventiveActionReport,
  formatRecommendationRegister,
  formatRepeatedIssues,
  identifyRepeatedIssues,
} from "./recommendationEngine";

export const buildLessonsLearnedReport = (
  workspace: LessonsLearnedWorkspace
): LessonsLearnedReport => {
  const repeated = identifyRepeatedIssues(workspace.lessons);
  const recommendations = buildRecommendationRegister(workspace.lessons);

  return {
    title: `Lessons Learned Report — ${workspace.title}`,
    executiveSummary: `Knowledge capture workspace for ${workspace.disciplineName ?? "engineering"} project "${workspace.projectName ?? workspace.title}" with ${workspace.lessons.length} lesson(s) recorded across ${new Set(workspace.lessons.map((l) => l.category)).size} categories.`,
    lessonsSummary: summarizeLessons(workspace.lessons),
    bestPracticesGuide: formatBestPracticeGuide(workspace.bestPractices),
    preventiveActions: formatPreventiveActionReport(workspace.preventiveActions),
    recommendationRegister: formatRecommendationRegister(recommendations),
    knowledgeSummary: [
      summarizeLessons(workspace.lessons),
      "",
      formatRepeatedIssues(repeated),
      "",
      `Best practices catalogued: ${workspace.bestPractices.length}`,
      `Preventive actions defined: ${workspace.preventiveActions.length}`,
    ].join("\n"),
    generatedAt: Date.now(),
  };
};

export const formatLessonsLearnedReportForPrompt = (
  report: LessonsLearnedReport
): string =>
  [
    report.title,
    report.executiveSummary,
    "",
    "=== Lessons Summary ===",
    report.lessonsSummary,
    "",
    "=== Best Practices ===",
    report.bestPracticesGuide,
    "",
    "=== Preventive Actions ===",
    report.preventiveActions,
    "",
    "=== Recommendations ===",
    report.recommendationRegister,
  ].join("\n");

export const formatKnowledgeSummary = (workspace: LessonsLearnedWorkspace): string =>
  buildLessonsLearnedReport(workspace).knowledgeSummary;

export const formatBestPracticeGuideFromWorkspace = (
  practices: BestPractice[]
): string => formatBestPracticeGuide(practices);
