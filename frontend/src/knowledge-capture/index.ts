export type {
  BestPractice,
  KnowledgeCaptureFields,
  LessonCategory,
  LessonDisciplineId,
  LessonEngineInput,
  LessonEngineResult,
  LessonEntry,
  LessonExtensionHooks,
  LessonsLearnedReport,
  LessonsLearnedWorkspace,
  PreventiveAction,
  ProjectType,
} from "./types";

export { LESSON_CATEGORIES } from "./types";

export {
  buildLessonEntry,
  extractKeywords,
  formatLessonEntry,
  generateKnowledgeNote,
  parseCaptureFromText,
  resolveLessonCategory,
  resolveProjectType,
  summarizeLessons,
} from "./knowledgeCapture";

export {
  BEST_PRACTICE_LIBRARY_SIZE,
  extractBestPracticesFromLessons,
  formatBestPracticeGuide,
  getBestPracticesByCategory,
  getBestPracticesByDiscipline,
  getSeedBestPractices,
  mergeBestPractices,
} from "./bestPracticeLibrary";

export {
  buildRecommendationRegister,
  formatPreventiveActionReport,
  formatRecommendationRegister,
  formatRepeatedIssues,
  identifyRepeatedIssues,
  suggestPreventiveActions,
} from "./recommendationEngine";

export type { LessonSearchFilters } from "./lessonSearch";
export {
  findSimilarLessons,
  formatSearchResults,
  formatSimilarLessons,
  resolveCategoryFromQuery,
  searchLessons,
} from "./lessonSearch";

export {
  buildLessonsLearnedReport,
  formatBestPracticeGuideFromWorkspace,
  formatKnowledgeSummary,
  formatLessonsLearnedReportForPrompt,
} from "./lessonReports";

export {
  formatLessonForPrompt,
  getActiveLessonsWorkspace,
  getLessonExtensionHooks,
  runLessonEngine,
  setLessonExtensionHooks,
} from "./lessonEngine";
