import type { DisciplineExpertIntelligence } from "../expertIntelligence";
import type { EngineeringReasoningSections } from "./types";

const formatBulletSection = (
  title: string,
  items: string[]
): string => {
  if (items.length === 0) {
    return "";
  }

  return [`## ${title}`, ...items.map((item) => `- ${item}`)].join("\n");
};

const formatAsExecutiveSummary = (
  sections: EngineeringReasoningSections
): string =>
  [
    `## Summary`,
    sections.summary,
    ``,
    sections.explanation,
    ``,
    `**Key consideration:** ${sections.engineeringConsiderations[0] ?? "Apply discipline standards."}`,
    ``,
    `**Recommendation:** ${sections.practicalRecommendations[0] ?? "Verify with applicable codes."}`,
  ].join("\n");

const formatAsBullet = (sections: EngineeringReasoningSections): string =>
  [
    `## ${sections.summary}`,
    sections.explanation,
    ...sections.engineeringConsiderations.map((item) => `- ${item}`),
    ...sections.practicalRecommendations.map((item) => `- ${item}`),
  ].join("\n");

const formatAsStepByStep = (
  sections: EngineeringReasoningSections,
  question: string
): string =>
  [
    `## ${sections.summary}`,
    `**Question:** ${question}`,
    ``,
    sections.explanation,
    ``,
    `## Steps`,
    ...sections.engineeringConsiderations.map(
      (item, index) => `${index + 1}. ${item}`
    ),
    ...sections.practicalRecommendations.map(
      (item, index) =>
        `${sections.engineeringConsiderations.length + index + 1}. ${item}`
    ),
  ].join("\n");

const formatAsChecklist = (
  sections: EngineeringReasoningSections
): string =>
  [
    `## ${sections.summary}`,
    ...sections.engineeringConsiderations.map(
      (item, index) => `- [ ] ${index + 1}. ${item}`
    ),
    ...sections.practicalRecommendations.map(
      (item, index) =>
        `- [ ] ${sections.engineeringConsiderations.length + index + 1}. ${item}`
    ),
  ].join("\n");

const formatAsTable = (sections: EngineeringReasoningSections): string =>
  [
    `## ${sections.summary}`,
    `| Area | Guidance |`,
    `| --- | --- |`,
    ...sections.engineeringConsiderations.map(
      (item, index) => `| Consideration ${index + 1} | ${item} |`
    ),
    ...sections.applicableStandards
      .slice(0, 3)
      .map((standard) => `| Standard | ${standard} |`),
  ].join("\n");

const formatAsDetailedReport = (
  sections: EngineeringReasoningSections
): string =>
  [
    `## Summary\n${sections.summary}`,
    `## Explanation\n${sections.explanation}`,
    formatBulletSection(
      "Engineering Considerations",
      sections.engineeringConsiderations
    ),
    formatBulletSection("Applicable Standards", sections.applicableStandards),
    formatBulletSection("Calculation Notes", sections.calculationNotes),
    formatBulletSection(
      "Practical Recommendations",
      sections.practicalRecommendations
    ),
    formatBulletSection("References", sections.references),
  ]
    .filter(Boolean)
    .join("\n\n");

export const formatReasoningOutput = (
  sections: EngineeringReasoningSections,
  intelligence: DisciplineExpertIntelligence,
  userQuestion: string
): string => {
  switch (intelligence.outputFormat.id) {
    case "executive-summary":
      return formatAsExecutiveSummary(sections);
    case "bullet-format":
      return formatAsBullet(sections);
    case "step-by-step":
      return formatAsStepByStep(sections, userQuestion);
    case "checklist":
      return formatAsChecklist(sections);
    case "table":
      return formatAsTable(sections);
    case "detailed-report":
    default:
      return formatAsDetailedReport(sections);
  }
};
