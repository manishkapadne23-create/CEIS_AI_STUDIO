import type { LearningPlan, LearningPlanDuration } from "./types";

export const parseLearningDuration = (message: string): LearningPlanDuration => {
  if (/1\s*year|one\s*year|annual/i.test(message)) return "1-year";
  if (/6\s*month|half\s*year/i.test(message)) return "6-month";
  if (/90\s*day|three\s*month|quarter/i.test(message)) return "90-day";
  return "30-day";
};

export const buildLearningPlan = (
  duration: LearningPlanDuration,
  disciplineName: string | null,
  focusArea: string
): LearningPlan => {
  const discipline = disciplineName ?? "engineering";
  const plans: Record<LearningPlanDuration, Omit<LearningPlan, "duration">> = {
    "30-day": {
      title: `30-Day ${discipline} Sprint — ${focusArea}`,
      goals: [
        `Complete foundational review of ${focusArea}`,
        "Complete 2 hands-on exercises or mini-projects",
        "Read 3 industry articles or standards summaries",
        "Schedule one mentor or peer review session",
      ],
      weeklyMilestones: [
        "Week 1: Assess current level and set daily study targets",
        "Week 2: Core concepts and tool practice",
        "Week 3: Applied problem solving and case review",
        "Week 4: Consolidation, self-assessment, and next-step planning",
      ],
      resources: [
        "NPTEL / Coursera discipline-specific courses",
        "Official software tutorials and documentation",
        "Professional society webinars",
        "Engineering handbooks and code summaries",
      ],
      assessments: [
        "Weekly self-quiz on key concepts",
        "Submit one practice design or analysis deliverable",
        "Peer or mentor feedback session",
      ],
    },
    "90-day": {
      title: `90-Day ${discipline} Development Plan — ${focusArea}`,
      goals: [
        `Achieve working proficiency in ${focusArea}`,
        "Complete one substantial project or portfolio piece",
        "Obtain at least one micro-certification or course certificate",
        "Present learnings to team or study group",
      ],
      weeklyMilestones: [
        "Month 1: Foundations, tools setup, and baseline assessment",
        "Month 2: Intermediate topics, project work, and standards study",
        "Month 3: Advanced application, certification prep, and portfolio",
      ],
      resources: [
        "Structured online specialization programs",
        "Industry case study repositories",
        "Professional mentor or coach sessions",
        "Technical books and standard references",
      ],
      assessments: [
        "Monthly progress review against skill matrix",
        "Project milestone deliverables",
        "Mock technical interview on focus area",
      ],
    },
    "6-month": {
      title: `6-Month ${discipline} Growth Plan — ${focusArea}`,
      goals: [
        `Become team-ready specialist in ${focusArea}`,
        "Lead or co-lead one engineering initiative",
        "Pursue relevant professional certification",
        "Build visible portfolio and professional network",
      ],
      weeklyMilestones: [
        "Months 1–2: Deep fundamentals and tool mastery",
        "Months 3–4: Real-world projects and cross-team collaboration",
        "Months 5–6: Certification, leadership exposure, and career positioning",
      ],
      resources: [
        "Professional certification preparation materials",
        "Conference attendance or virtual symposiums",
        "Internal project assignments for stretch goals",
        "Professional body membership benefits",
      ],
      assessments: [
        "Bi-monthly skill matrix review",
        "Certification mock exams",
        "360° feedback from peers and supervisors",
      ],
    },
    "1-year": {
      title: `1-Year ${discipline} Career Development Plan — ${focusArea}`,
      goals: [
        `Establish recognized expertise in ${focusArea}`,
        "Achieve promotion readiness or role transition",
        "Obtain major certification (PE, PMP, domain-specific)",
        "Mentor others and contribute to organizational knowledge",
      ],
      weeklyMilestones: [
        "Q1: Skill audit, learning plan, and certification roadmap",
        "Q2: Project leadership and specialization depth",
        "Q3: Certification exams and industry engagement",
        "Q4: Career review, portfolio polish, and next-year strategy",
      ],
      resources: [
        "Executive and leadership development programs",
        "Professional certification full preparation courses",
        "Industry conferences and technical committees",
        "Long-term mentor relationship",
      ],
      assessments: [
        "Quarterly career review with manager or mentor",
        "Certification achievement milestones",
        "Portfolio and publication record",
        "Promotion or role transition readiness checklist",
      ],
    },
  };

  return { duration, ...plans[duration] };
};

export const formatLearningPlan = (plan: LearningPlan): string =>
  [
    plan.title,
    `Duration: ${plan.duration}`,
    "",
    "Goals:",
    ...plan.goals.map((g) => `- ${g}`),
    "",
    "Milestones:",
    ...plan.weeklyMilestones.map((m) => `- ${m}`),
    "",
    "Resources:",
    ...plan.resources.map((r) => `- ${r}`),
    "",
    "Assessments:",
    ...plan.assessments.map((a) => `- ${a}`),
  ].join("\n");
