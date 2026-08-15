import type { LessonCategory, LessonEntry, PreventiveAction } from "./types";

export const identifyRepeatedIssues = (lessons: LessonEntry[]): string[] => {
  const issueMap = new Map<string, { count: number; category: LessonCategory }>();

  for (const lesson of lessons) {
    const key = (
      lesson.capture.rootCause ||
      lesson.capture.problem ||
      lesson.title
    ).toLowerCase().slice(0, 60);
    const existing = issueMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      issueMap.set(key, { count: 1, category: lesson.category });
    }
  }

  return Array.from(issueMap.entries())
    .filter(([, v]) => v.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .map(
      ([issue, v]) =>
        `[${v.category}] "${issue}" — occurred ${v.count} time(s)`
    );
};

export const suggestPreventiveActions = (lessons: LessonEntry[]): PreventiveAction[] => {
  const actions: PreventiveAction[] = [];
  const repeated = identifyRepeatedIssues(lessons);

  for (const issue of repeated) {
    const related = lessons.find(
      (l) =>
        (l.capture.rootCause ?? l.capture.problem ?? l.title)
          .toLowerCase()
          .includes(issue.slice(issue.indexOf('"') + 1, issue.lastIndexOf('"')))
    );
    actions.push({
      id: crypto.randomUUID(),
      issue,
      preventiveAction: related?.capture.recommendation
        ? `Implement: ${related.capture.recommendation}`
        : `Establish checklist and review gate to prevent recurrence of: ${issue}`,
      category: related?.category ?? "design",
      priority: "high",
    });
  }

  for (const lesson of lessons) {
    if (lesson.capture.mistakeAvoided && lesson.capture.recommendation) {
      actions.push({
        id: crypto.randomUUID(),
        issue: lesson.capture.mistakeAvoided,
        preventiveAction: lesson.capture.recommendation,
        category: lesson.category,
        priority: "medium",
      });
    }
  }

  const seen = new Set<string>();
  return actions.filter((a) => {
    if (seen.has(a.issue)) return false;
    seen.add(a.issue);
    return true;
  }).slice(0, 20);
};

export const buildRecommendationRegister = (lessons: LessonEntry[]): string[] => {
  const recs: string[] = [];
  for (const lesson of lessons) {
    if (lesson.capture.recommendation) {
      recs.push(`[${lesson.category}] ${lesson.capture.recommendation}`);
    }
    if (lesson.capture.bestPractice) {
      recs.push(`[${lesson.category}] Adopt: ${lesson.capture.bestPractice}`);
    }
  }
  return [...new Set(recs)].slice(0, 30);
};

export const formatPreventiveActionReport = (actions: PreventiveAction[]): string =>
  [
    "PREVENTIVE ACTION REPORT",
    `Total actions: ${actions.length}`,
    "",
    ...actions.map(
      (a, i) =>
        [
          `${i + 1}. [${a.priority.toUpperCase()}] ${a.category}`,
          `   Issue: ${a.issue}`,
          `   Action: ${a.preventiveAction}`,
        ].join("\n")
    ),
  ].join("\n\n");

export const formatRecommendationRegister = (recommendations: string[]): string =>
  [
    "RECOMMENDATION REGISTER",
    `Total recommendations: ${recommendations.length}`,
    "",
    ...recommendations.map((r, i) => `${i + 1}. ${r}`),
  ].join("\n");

export const formatRepeatedIssues = (issues: string[]): string =>
  issues.length > 0
    ? ["REPEATED ISSUES:", ...issues.map((i) => `- ${i}`)].join("\n")
    : "No repeated issues identified across captured lessons.";
