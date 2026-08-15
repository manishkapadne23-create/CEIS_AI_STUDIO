import type { EngineeringAIContext } from "../types/EngineeringAIContext";
import type { EngineeringAIExpertProfile } from "../types/EngineeringAIExpertProfile";

const formatList = (
  items: string[],
  emptyMessage: string
): string =>
  items.length > 0
    ? items.map((item) => `- ${item}`).join("\n")
    : `- ${emptyMessage}`;

const formatValue = (value: string | null): string =>
  value?.trim() ? value : "Not selected";

export const buildExpertSystemPrompt = (
  profile: EngineeringAIExpertProfile,
  context: EngineeringAIContext
): string => {
  const knowledgeOverview =
    context.knowledge.overview ??
    "No specialization knowledge overview available.";

  const registryCapabilities = context.capabilities.filter(
    (capability) => capability.enabled
  );

  const capabilityLines =
    registryCapabilities.length > 0
      ? registryCapabilities.map(
          (capability) =>
            `- ${capability.label} (${capability.status})`
        )
      : profile.availableCapabilities.length > 0
        ? profile.availableCapabilities.map(
            (capability) =>
              `- ${capability.label} (${capability.status})`
          )
        : ["- General AI assistance"];

  const standardsLines =
    context.standards.length > 0
      ? context.standards.map(
          (standard) =>
            `- ${standard.code} — ${standard.title} [${standard.family}]`
        )
      : ["- Applicable standards to be confirmed"];

  return [
    "========================================",
    "Engineering AI Expert System Prompt",
    "========================================",
    "",
    "Expert Identity",
    `Discipline: ${profile.discipline}`,
    `Branch: ${formatValue(profile.branch)}`,
    `Specialization: ${profile.specialization}`,
    `Profile ID: ${profile.id}`,
    "",
    "Response Style",
    profile.responseStyle,
    "",
    "Scope",
    formatList(profile.scope, "General engineering scope"),
    "",
    "Standards & Codes Registry",
    ...standardsLines,
    "",
    "Engineering Terminology",
    formatList(
      profile.terminology,
      "Use domain-appropriate professional terminology"
    ),
    "",
    "Knowledge Repository",
    `Module: ${formatValue(context.knowledge.moduleName)}`,
    `Specialization: ${formatValue(context.knowledge.specialization)}`,
    `Overview: ${knowledgeOverview}`,
    `Country: ${context.workspace.country}`,
    `Codes: ${context.workspace.codes.join(", ")}`,
    "",
    "Capability Registry",
    ...capabilityLines,
    "",
    "User Question:",
    context.userPrompt,
    "",
    "========================================",
  ].join("\n");
};
