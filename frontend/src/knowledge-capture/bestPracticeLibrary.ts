import type { BestPractice, LessonCategory, LessonDisciplineId, LessonEntry } from "./types";

const SEED_BEST_PRACTICES: BestPractice[] = [
  { id: "bp-design-1", title: "Design Review Gate Process", category: "design", disciplineId: "general", description: "Conduct structured design reviews at 30%, 60%, and 90% completion with independent checker.", applicability: "All engineering design projects", sourceLessonIds: [] },
  { id: "bp-safety-1", title: "Pre-Task Safety Briefing", category: "safety", disciplineId: "general", description: "Mandatory toolbox talk before high-risk activities with documented hazard identification.", applicability: "Construction and site operations", sourceLessonIds: [] },
  { id: "bp-qa-1", title: "Hold Point Inspection Protocol", category: "qa-qc", disciplineId: "civil-engineering", description: "Define and enforce QA hold points for critical structural elements before concealment.", applicability: "Civil and structural construction", sourceLessonIds: [] },
  { id: "bp-cost-1", title: "Contingency Allocation by Risk", category: "cost", disciplineId: "general", description: "Allocate project contingency based on risk register severity, not flat percentage.", applicability: "Cost estimation and project controls", sourceLessonIds: [] },
  { id: "bp-tender-1", title: "Bid Clarification Log", category: "tender", disciplineId: "general", description: "Maintain formal log of all pre-bid clarifications and incorporate into pricing assumptions.", applicability: "Tender and bidding activities", sourceLessonIds: [] },
  { id: "bp-contract-1", title: "Clause Risk Matrix", category: "contracts", disciplineId: "general", description: "Map contract clauses to risk ownership and mitigation before signing.", applicability: "Contract review and negotiation", sourceLessonIds: [] },
  { id: "bp-materials-1", title: "Material Test Certificate Traceability", category: "materials", disciplineId: "civil-engineering", description: "Link every batch of structural materials to mill test certificates and delivery notes.", applicability: "Materials procurement and QA", sourceLessonIds: [] },
  { id: "bp-tech-1", title: "BIM Model Validation Checklist", category: "technology", disciplineId: "architecture-planning", description: "Run clash detection and model validation before issuing construction documents.", applicability: "BIM-enabled projects", sourceLessonIds: [] },
  { id: "bp-maint-1", title: "Predictive Maintenance Scheduling", category: "maintenance", disciplineId: "mechanical-engineering", description: "Use condition monitoring data to schedule maintenance before failure thresholds.", applicability: "Plant and equipment maintenance", sourceLessonIds: [] },
  { id: "bp-plan-1", title: "Critical Path Buffer Management", category: "planning", disciplineId: "general", description: "Protect critical path activities with time buffers at merge points.", applicability: "Project scheduling", sourceLessonIds: [] },
];

export const getSeedBestPractices = (): BestPractice[] => SEED_BEST_PRACTICES;

export const extractBestPracticesFromLessons = (lessons: LessonEntry[]): BestPractice[] => {
  const extracted: BestPractice[] = [];
  for (const lesson of lessons) {
    if (lesson.capture.bestPractice) {
      extracted.push({
        id: `bp-${lesson.id}`,
        title: lesson.title.slice(0, 60),
        category: lesson.category,
        disciplineId: (lesson.disciplineId as LessonDisciplineId) ?? "general",
        description: lesson.capture.bestPractice,
        applicability: `${lesson.category} — ${lesson.disciplineName ?? "engineering"}`,
        sourceLessonIds: [lesson.id],
      });
    }
    if (lesson.capture.solution && lesson.capture.recommendation) {
      extracted.push({
        id: `bp-sol-${lesson.id}`,
        title: `Solution: ${lesson.title.slice(0, 40)}`,
        category: lesson.category,
        disciplineId: (lesson.disciplineId as LessonDisciplineId) ?? "general",
        description: `${lesson.capture.solution}. ${lesson.capture.recommendation}`,
        applicability: lesson.projectType,
        sourceLessonIds: [lesson.id],
      });
    }
  }
  return extracted;
};

export const mergeBestPractices = (
  lessons: LessonEntry[],
  existing: BestPractice[]
): BestPractice[] => {
  const extracted = extractBestPracticesFromLessons(lessons);
  const seen = new Set(existing.map((b) => b.description));
  const merged = [...existing];
  for (const bp of extracted) {
    if (!seen.has(bp.description)) {
      merged.push(bp);
      seen.add(bp.description);
    }
  }
  return merged.slice(0, 100);
};

export const formatBestPracticeGuide = (practices: BestPractice[]): string =>
  [
    "BEST PRACTICE GUIDE",
    `Total practices: ${practices.length}`,
    "",
    ...practices.map(
      (bp, i) =>
        [
          `${i + 1}. ${bp.title} [${bp.category}]`,
          `   ${bp.description}`,
          `   Applicability: ${bp.applicability}`,
        ].join("\n")
    ),
  ].join("\n\n");

export const getBestPracticesByCategory = (
  practices: BestPractice[],
  category: LessonCategory
): BestPractice[] => practices.filter((bp) => bp.category === category);

export const getBestPracticesByDiscipline = (
  practices: BestPractice[],
  disciplineId: string | null
): BestPractice[] =>
  practices.filter(
    (bp) => bp.disciplineId === disciplineId || bp.disciplineId === "general"
  );

export const BEST_PRACTICE_LIBRARY_SIZE = SEED_BEST_PRACTICES.length;
