import type { CareerReport, MentorWorkspace } from "./types";
import { formatCertificationRoadmap, recommendCertifications } from "./certificationAdvisor";
import { formatInterviewPrep, buildInterviewPrep } from "./interviewCoach";
import { formatLearningPlan } from "./learningPlanner";
import { formatSkillGapReport, formatSkillMatrix } from "./skillAnalyzer";

export const buildCareerReport = (workspace: MentorWorkspace): CareerReport => {
  const certs = recommendCertifications(
    workspace.disciplineId,
    workspace.disciplineName,
    workspace.focusArea
  );
  const interview = buildInterviewPrep(workspace.focusArea, workspace.disciplineName);

  return {
    title: `Career Report — ${workspace.title}`,
    careerSummary: `Engineering mentor workspace for ${workspace.disciplineName ?? "engineering"} at ${workspace.careerStage} stage, focused on ${workspace.focusArea}.`,
    skillGaps: workspace.skillGaps,
    learningPlan: workspace.learningPlans[0]
      ? formatLearningPlan(workspace.learningPlans[0])
      : "Generate a learning roadmap to create a plan.",
    certificationRoadmap: formatCertificationRoadmap(certs, workspace.disciplineName),
    interviewPrep: formatInterviewPrep(interview),
    professionalDevelopment: workspace.professionalDevelopment.join("\n"),
    generatedAt: Date.now(),
  };
};

export const formatCareerReportForPrompt = (report: CareerReport): string =>
  [
    report.title,
    report.careerSummary,
    "",
    "Skill Gaps:",
    ...report.skillGaps.map((g) => `- ${g}`),
    "",
    report.learningPlan,
    "",
    report.certificationRoadmap,
    "",
    "Interview Preparation:",
    report.interviewPrep,
    "",
    "Professional Development:",
    report.professionalDevelopment,
  ].join("\n");

export const formatSkillReport = (workspace: MentorWorkspace): string =>
  [
    `SKILL REPORT — ${workspace.title}`,
    "",
    formatSkillMatrix(workspace.skillMatrix),
    "",
    formatSkillGapReport(workspace.skillGaps),
  ].join("\n\n");
