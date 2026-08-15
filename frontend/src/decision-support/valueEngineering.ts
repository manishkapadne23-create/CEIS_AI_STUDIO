import type { ValueEngineeringFramework } from "./types";

const VALUE_ENGINEERING_TRIGGERS =
  /\b(value\s+engineering|cost\s+optimi[sz]ation|material\s+optimi[sz]ation|life[\s-]cycle\s+cost|lcca|lcc\b|alternative\s+technolog|constructability|optimize\s+design|reduce\s+cost)\b/i;

export const isValueEngineeringQuery = (message: string): boolean =>
  VALUE_ENGINEERING_TRIGGERS.test(message);

export const buildValueEngineeringFramework = (
  message: string
): ValueEngineeringFramework => {
  const normalized = message.toLowerCase();
  const lccaRequired =
    /life[\s-]cycle|lcca|lcc\b|whole[\s-]life|total\s+cost\s+of\s+ownership/i.test(
      normalized
    );

  const focusAreas: string[] = [];

  if (/cost|budget|econom/i.test(normalized)) {
    focusAreas.push("Cost Optimization");
  }
  if (/material|specification|grade/i.test(normalized)) {
    focusAreas.push("Material Optimization");
  }
  if (/construction|method|sequence|buildability/i.test(normalized)) {
    focusAreas.push("Construction Optimization");
  }
  if (/technolog|alternative|innovation/i.test(normalized)) {
    focusAreas.push("Alternative Technologies");
  }
  if (lccaRequired) {
    focusAreas.push("Life Cycle Cost Analysis (LCCA)");
  }
  if (/maintain|service\s+life|durability/i.test(normalized)) {
    focusAreas.push("Maintainability Analysis");
  }

  if (focusAreas.length === 0) {
    focusAreas.push(
      "Cost Optimization",
      "Material Optimization",
      "Construction Optimization",
      "Alternative Technologies",
      "Maintainability Analysis"
    );
  }

  const analysisPrompts = [
    "Identify functions and rank by cost contribution",
    "Propose alternative materials/methods without compromising safety or performance",
    "Compare initial cost vs life-cycle cost",
    "Assess constructability and schedule impact of alternatives",
    "Document value-engineering proposals with quantified savings where possible",
  ];

  if (lccaRequired) {
    analysisPrompts.push(
      "Perform LCCA: initial cost + O&M + replacement − salvage value over analysis period"
    );
  }

  return {
    focusAreas,
    analysisPrompts,
    lccaRequired,
  };
};

export const formatValueEngineeringForPrompt = (
  framework: ValueEngineeringFramework | null
): string => {
  if (!framework) return "";

  return [
    "VALUE ENGINEERING ANALYSIS:",
    "",
    "Focus areas:",
    framework.focusAreas.map((area) => `- ${area}`).join("\n"),
    "",
    "Analysis approach:",
    framework.analysisPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n"),
    "",
    framework.lccaRequired
      ? "Include Life Cycle Cost Analysis with assumptions and discount rate."
      : "Consider life-cycle implications even if full LCCA is not requested.",
  ].join("\n");
};
