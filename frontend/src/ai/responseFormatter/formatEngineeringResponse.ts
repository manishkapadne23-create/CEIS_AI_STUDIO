import type {
  EngineeringResponseFormatOptions,
  StructuredEngineeringResponse,
} from "./types";

const formatBulletSection = (
  title: string,
  items: string[]
): string => {
  if (items.length === 0) {
    return `## ${title}\n- Not applicable for this query.`;
  }

  return [`## ${title}`, ...items.map((item) => `- ${item}`)].join("\n");
};

export const buildStructuredEngineeringResponse = (
  options: EngineeringResponseFormatOptions
): StructuredEngineeringResponse => {
  const standards =
    options.applicableStandards && options.applicableStandards.length > 0
      ? options.applicableStandards
      : [
          "Refer to discipline-specific standards catalog metadata in Sarathi AI.",
        ];

  const followUpNote = options.followUpIntent
    ? ` Follow-up intent detected: ${options.followUpIntent}.`
    : "";

  return {
    summary: `Engineering guidance for ${options.disciplineName} within ${options.activeModuleTitle}.${followUpNote}`,
    explanation: `Your question — "${options.userQuestion}" — is being handled in the context of ${options.disciplineName}. Sarathi AI applies discipline-aware reasoning, module context, and structured engineering response formatting before any future LLM provider is connected.`,
    engineeringConsiderations: [
      `Maintain compliance with ${options.disciplineName} practice and applicable national codes.`,
      "State assumptions explicitly before design or calculation recommendations.",
      "Highlight safety-critical checks and verification steps.",
      `Align recommendations with the active module: ${options.activeModuleTitle}.`,
    ],
    applicableStandards: standards,
    calculationNotes: [
      "No live calculation engine is connected in this release.",
      "When calculations are requested, show formulas, inputs, units, and verification steps once the calculator engine is enabled.",
    ],
    practicalRecommendations: [
      "Validate outputs against governing standards and project specifications.",
      "Use Sarathi Standards & Codes workspace for metadata references.",
      "Escalate safety-critical decisions to a licensed professional engineer.",
    ],
    references: standards.map(
      (standard) => `${standard} (metadata reference only — no copyrighted documents stored)`
    ),
  };
};

export const formatStructuredEngineeringResponse = (
  response: StructuredEngineeringResponse
): string =>
  [
    `## Summary\n${response.summary}`,
    `## Explanation\n${response.explanation}`,
    formatBulletSection(
      "Engineering Considerations",
      response.engineeringConsiderations
    ),
    formatBulletSection("Applicable Standards", response.applicableStandards),
    formatBulletSection("Calculation Notes", response.calculationNotes),
    formatBulletSection(
      "Practical Recommendations",
      response.practicalRecommendations
    ),
    formatBulletSection("References", response.references),
  ].join("\n\n");

export const formatEngineeringExpertResponse = (
  options: EngineeringResponseFormatOptions
): string =>
  formatStructuredEngineeringResponse(
    buildStructuredEngineeringResponse(options)
  );
