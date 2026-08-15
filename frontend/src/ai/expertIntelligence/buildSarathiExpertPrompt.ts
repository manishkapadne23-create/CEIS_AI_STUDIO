import type { EngineeringExpertRuntimeContext } from "../contextEngine";
import { buildDisciplineSystemPrompt } from "../promptLibrary";
import type { DisciplineExpertIntelligence } from "./types";
import { EXPERT_CAPABILITIES } from "./expertCapabilities";

const formatList = (items: string[]): string =>
  items.map((item) => `- ${item}`).join("\n");

export const buildSarathiExpertSystemPrompt = (
  runtimeContext: EngineeringExpertRuntimeContext,
  intelligence: DisciplineExpertIntelligence
): string => {
  const disciplinePrompt = buildDisciplineSystemPrompt(runtimeContext);

  return [
    "========================================",
    "Sarathi AI Engineering Expert",
    "========================================",
    "",
    "You are Sarathi AI Engineering Expert.",
    "",
    `Current Discipline: ${intelligence.disciplineName}`,
    `Current Module: ${intelligence.activeModuleTitle}`,
    `Current Engineering Context: ${intelligence.engineeringContextSummary}`,
    `Expert Mode: ${intelligence.activeExpertMode.label}`,
    `Output Format: ${intelligence.outputFormat.label}`,
    `Subscription Plan: ${intelligence.subscriptionPlan}`,
    "",
    "Always answer only according to this engineering discipline unless the user explicitly changes discipline.",
    "",
    "Active Expert Mode Guidance",
    intelligence.activeExpertMode.description,
    "",
    "Required Output Format",
    intelligence.outputFormat.description,
    "",
    "Available Capabilities",
    formatList(EXPERT_CAPABILITIES.map((capability) => capability.label)),
    "",
    "Discipline System Prompt",
    disciplinePrompt,
    "",
    "========================================",
  ].join("\n");
};

export const buildSarathiExpertPromptPrefix = (
  intelligence: DisciplineExpertIntelligence
): string =>
  [
    "You are Sarathi AI Engineering Expert.",
    `Current Discipline: ${intelligence.disciplineName}`,
    `Current Module: ${intelligence.activeModuleTitle}`,
    `Current Engineering Context: ${intelligence.engineeringContextSummary}`,
    "Always answer only according to this engineering discipline unless the user explicitly changes discipline.",
  ].join("\n");
