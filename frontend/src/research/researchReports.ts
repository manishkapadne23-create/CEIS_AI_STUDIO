import { formatInnovationAssessment } from "./innovationEngine";
import { formatLiteratureSummary } from "./literatureOrganizer";
import { formatTechnologyReview } from "./technologyReview";
import type { InnovationAssessment, ResearchReport, ResearchWorkspace, TechnologyReview } from "./types";

export const buildResearchReport = (
  workspace: ResearchWorkspace,
  techReview: TechnologyReview | null,
  innovation: InnovationAssessment | null
): ResearchReport => ({
  title: `Research Report — ${workspace.title}`,
  researchBrief: [
    `Topic: ${workspace.topic}`,
    `Discipline: ${workspace.disciplineName ?? "Engineering"}`,
    `Problem: ${workspace.problemStatement}`,
    "",
    "Objectives:",
    ...workspace.objectives.map((o) => `- ${o}`),
    "",
    "Research Gaps:",
    ...workspace.researchGaps.map((g) => `- ${g}`),
    "",
    "Limitations:",
    ...workspace.limitations.map((l) => `- ${l}`),
  ].join("\n"),
  technologyReview: techReview ? formatTechnologyReview(techReview) : "No technology review generated.",
  innovationSummary: innovation
    ? formatInnovationAssessment(innovation)
    : workspace.innovationIdeas.length > 0
      ? workspace.innovationIdeas.map((i) => `- ${i}`).join("\n")
      : "No innovation assessment.",
  researchOutline: [
    "1. Introduction and background",
    "2. Literature review",
    "3. Problem statement and objectives",
    "4. Methodology",
    "5. Results and discussion",
    "6. Conclusions",
    "7. Future scope and recommendations",
    "8. References",
  ].join("\n"),
  presentationSummary: [
    `Title: ${workspace.topic}`,
    `Key message: Research on ${workspace.topic} for ${workspace.disciplineName ?? "engineering"}`,
    "Slides: Background → Gap → Methodology → Results → Conclusions",
  ].join("\n"),
  discussionNotes: formatLiteratureSummary(workspace),
  futureDirections: workspace.futureScope.length > 0
    ? workspace.futureScope.join("\n")
    : [
        "Scale-up from lab to field demonstration",
        "Integration with industry standards and codes",
        "Long-term performance and durability studies",
        "Cross-disciplinary collaboration opportunities",
      ].join("\n"),
  generatedAt: Date.now(),
});

export const formatResearchReportForPrompt = (report: ResearchReport): string =>
  [
    report.title,
    "",
    "RESEARCH BRIEF:",
    report.researchBrief,
    "",
    "TECHNOLOGY REVIEW:",
    report.technologyReview,
    "",
    "INNOVATION:",
    report.innovationSummary,
    "",
    "RESEARCH OUTLINE:",
    report.researchOutline,
    "",
    "FUTURE DIRECTIONS:",
    report.futureDirections,
  ].join("\n");
