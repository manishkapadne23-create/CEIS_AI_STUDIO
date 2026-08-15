import { loadTaskTemplates } from "./loadOrchestratorConfig.js";
import type { EoeIntentId, EoeModuleId, EoeTaskPlan } from "./types.js";

export const buildTaskPlan = (
  message: string,
  primaryIntent: EoeIntentId,
  routedModuleIds: EoeModuleId[]
): EoeTaskPlan => {
  const normalized = message.toLowerCase();
  const templates = loadTaskTemplates();

  for (const template of templates) {
    const matched = template.triggerPatterns.some((patternSource) =>
      new RegExp(patternSource, "i").test(normalized)
    );

    if (matched) {
      return {
        templateId: template.id,
        templateLabel: template.label,
        steps: template.steps.map((step) => ({
          order: step.order,
          moduleId: step.moduleId as EoeModuleId,
          action: step.action,
        })),
        isComplex: template.steps.length > 3,
        summary: `${template.label}: ${template.steps.length} orchestrated steps`,
      };
    }
  }

  const defaultSteps = routedModuleIds.slice(0, 5).map((moduleId, index) => ({
    order: index + 1,
    moduleId,
    action: `Execute ${moduleId.replace(/-/g, " ")} for ${primaryIntent}`,
  }));

  return {
    templateId: null,
    templateLabel: null,
    steps: defaultSteps,
    isComplex: defaultSteps.length > 2,
    summary:
      defaultSteps.length > 1
        ? `Multi-module plan across ${defaultSteps.length} engines`
        : "Single-module execution plan",
  };
};
