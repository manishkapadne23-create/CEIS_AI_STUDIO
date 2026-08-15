import { loadAdaptationRules } from "./loadEdeConfig.js";
import { estimateExperienceLevel } from "./experienceAnalyzer.js";
import type {
  EdAdaptationContext,
  EdDigitalEngineerProfile,
  EdEngineContextInput,
} from "./types.js";

export const buildAdaptationContext = (
  profile: EdDigitalEngineerProfile,
  input?: EdEngineContextInput
): EdAdaptationContext => ({
  experienceLevel: estimateExperienceLevel(profile),
  disciplineId: input?.disciplineId ?? profile.primaryDisciplineId,
  disciplineName: input?.disciplineName ?? profile.primaryDisciplineName,
  specializationId:
    input?.specializationId ?? profile.specializationIds[0] ?? null,
  specializationName:
    input?.specializationName ?? profile.specializationNames[0] ?? null,
  currentWorkspaceId: input?.workspaceId ?? null,
  currentProjectId: input?.projectId ?? null,
  currentProjectName: input?.projectName ?? null,
  previousDecisions: [],
});

export const buildAdaptationPromptAugmentation = (
  profile: EdDigitalEngineerProfile,
  adaptation: EdAdaptationContext
): string => {
  if (!profile.learningEnabled) {
    return "";
  }

  const rules = loadAdaptationRules().responseAdjustments[adaptation.experienceLevel];
  const sections = [
    "## Digital Engineer Personalization",
    "Adapt your response to this engineer's profile. Do not repeat this block verbatim.",
    "",
    `**Experience:** ${adaptation.experienceLevel}${
      profile.yearsOfExperience ? ` (${profile.yearsOfExperience} years)` : ""
    }`,
    `**Discipline:** ${adaptation.disciplineName ?? "General Engineering"}`,
  ];

  if (adaptation.specializationName) {
    sections.push(`**Specialization:** ${adaptation.specializationName}`);
  }
  if (profile.industry) {
    sections.push(`**Industry:** ${profile.industry}`);
  }
  if (profile.preferredUnits) {
    sections.push(`**Preferred units:** ${profile.preferredUnits}`);
  }
  if (profile.preferredStandards.length > 0) {
    sections.push(
      `**Preferred standards:** ${profile.preferredStandards.slice(0, 5).join(", ")}`
    );
  }
  if (profile.workingStyle.frequentlyAskedTopics.length > 0) {
    sections.push(
      `**Frequent topics:** ${profile.workingStyle.frequentlyAskedTopics.slice(0, 4).join(", ")}`
    );
  }
  if (adaptation.currentProjectName) {
    sections.push(`**Current project:** ${adaptation.currentProjectName}`);
  }

  if (rules) {
    sections.push(
      "",
      "### Response style",
      `- Detail level: ${rules.detailLevel}`,
      `- Include definitions: ${rules.includeDefinitions ? "yes" : "no"}`,
      `- Include examples: ${rules.includeExamples ? "yes" : "no"}`,
      `- Assume prior knowledge: ${rules.assumePriorKnowledge ? "yes" : "no"}`
    );
  }

  return sections.join("\n");
};
