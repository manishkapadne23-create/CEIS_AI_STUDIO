import type { DisciplineExpertIntelligence } from "./types";
import {
  buildStructuredEngineeringResponse,
  formatStructuredEngineeringResponse,
} from "../responseFormatter";

export interface FormatExpertIntelligenceResponseOptions {
  intelligence: DisciplineExpertIntelligence;
  userQuestion: string;
  followUpIntent?: string | null;
  applicableStandards?: string[];
}

const formatAsExecutiveSummary = (
  structured: ReturnType<typeof buildStructuredEngineeringResponse>
): string =>
  [
    `## Executive Summary`,
    structured.summary,
    ``,
    `**Key Considerations:** ${structured.engineeringConsiderations[0] ?? "See discipline guidance."}`,
    ``,
    `**Recommendation:** ${structured.practicalRecommendations[0] ?? "Validate with applicable standards."}`,
  ].join("\n");

const formatAsBullet = (
  structured: ReturnType<typeof buildStructuredEngineeringResponse>
): string =>
  [
    `## ${structured.summary}`,
    ...structured.engineeringConsiderations.map((item) => `- ${item}`),
    ...structured.practicalRecommendations.map((item) => `- ${item}`),
  ].join("\n");

const formatAsStepByStep = (
  structured: ReturnType<typeof buildStructuredEngineeringResponse>,
  question: string
): string =>
  [
    `## Step-by-Step — ${structured.summary}`,
    `1. **Understand the query:** ${question}`,
    "2. **Identify governing context:** Apply discipline standards and workspace assumptions.",
    "3. **Analyze engineering considerations:** Review technical constraints and safety checks.",
    "4. **Apply methodology:** Use discipline-appropriate calculations or design logic.",
    "5. **Verify compliance:** Cross-check against applicable standards metadata.",
    "6. **Deliver recommendation:** Provide actionable engineering guidance.",
  ].join("\n");

const formatAsChecklist = (
  structured: ReturnType<typeof buildStructuredEngineeringResponse>
): string =>
  [
    `## Engineering Checklist`,
    ...structured.engineeringConsiderations.map(
      (item, index) => `- [ ] ${index + 1}. ${item}`
    ),
    ...structured.practicalRecommendations.map(
      (item, index) =>
        `- [ ] ${structured.engineeringConsiderations.length + index + 1}. ${item}`
    ),
  ].join("\n");

const formatAsTable = (
  structured: ReturnType<typeof buildStructuredEngineeringResponse>
): string =>
  [
    `## Comparison Table`,
    `| Area | Guidance |`,
    `| --- | --- |`,
    ...structured.engineeringConsiderations.map(
      (item, index) => `| Consideration ${index + 1} | ${item} |`
    ),
    ...structured.applicableStandards
      .slice(0, 3)
      .map((standard) => `| Standard | ${standard} |`),
  ].join("\n");

const formatAsDetailedReport = (
  structured: ReturnType<typeof buildStructuredEngineeringResponse>
): string => formatStructuredEngineeringResponse(structured);

export const formatExpertIntelligenceResponse = (
  options: FormatExpertIntelligenceResponseOptions
): string => {
  const { intelligence, userQuestion, followUpIntent, applicableStandards } =
    options;

  const structured = buildStructuredEngineeringResponse({
    disciplineName: intelligence.disciplineName,
    activeModuleTitle: intelligence.activeModuleTitle,
    userQuestion,
    followUpIntent,
    applicableStandards,
  });

  structured.summary = `${intelligence.expertTitle} (${intelligence.activeExpertMode.label}) — ${structured.summary}`;

  switch (intelligence.outputFormat.id) {
    case "step-by-step":
      return formatAsStepByStep(structured, userQuestion);
    case "executive-summary":
      return formatAsExecutiveSummary(structured);
    case "bullet-format":
      return formatAsBullet(structured);
    case "detailed-report":
      return formatAsDetailedReport(structured);
    case "table":
      return formatAsTable(structured);
    case "checklist":
      return formatAsChecklist(structured);
    default:
      return formatStructuredEngineeringResponse(structured);
  }
};
