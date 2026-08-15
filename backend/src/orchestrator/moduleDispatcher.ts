import { globalSearchEdm } from "../services/edmSearch.service.js";
import type {
  EoeContextDetection,
  EoeIntentDetection,
  EoeModuleContribution,
  EoeModuleId,
  EoeModuleRoute,
  EoeTaskPlan,
} from "./types.js";

const buildModuleSummary = (
  moduleId: EoeModuleId,
  context: EoeContextDetection,
  intent: EoeIntentDetection
): string => {
  const discipline = context.disciplineName ?? "General Engineering";
  const specialization = context.specializationName ?? "General";
  const topic = context.topic ?? "the requested topic";

  const summaries: Record<EoeModuleId, string> = {
    "ai-expert": `Provide ${intent.intentLabel.toLowerCase()} guidance for ${topic} in ${discipline}.`,
    "knowledge-base": `Retrieve engineering knowledge references for ${topic}.`,
    "standards-engine": `Identify applicable standards and code clauses for ${topic}.`,
    "calculator-engine": `Select calculation tools relevant to ${intent.intentLabel.toLowerCase()} on ${topic}.`,
    "workflow-engine": `Outline workflow steps for ${intent.intentLabel.toLowerCase()} in ${specialization}.`,
    "document-engine": `Locate document and drawing metadata related to ${topic}.`,
    "learning-hub": `Suggest learning resources for ${topic}.`,
    "professional-tools": `Activate professional tools for ${intent.intentLabel.toLowerCase()}.`,
    "engineering-memory": `Query Engineering Digital Memory for ${discipline} / ${specialization}.`,
    "decision-intelligence": `Structure decision support for ${topic}.`,
    "simulation-engine": `Evaluate engineering scenarios and compare alternatives for ${topic}.`,
  };

  return summaries[moduleId];
};

const dispatchKnowledgeModules = async (
  moduleId: EoeModuleId,
  query: string,
  context: EoeContextDetection
): Promise<string[]> => {
  if (
    moduleId !== "knowledge-base" &&
    moduleId !== "engineering-memory" &&
    moduleId !== "document-engine"
  ) {
    return [];
  }

  try {
    const results = await globalSearchEdm(
      {
        q: query,
        disciplineId: context.disciplineId ?? undefined,
        categoryId: undefined,
        limit: 5,
      },
      undefined
    );

    return results.map(
      (result) => `${result.entry.title} [${result.entry.disciplineId}]`
    );
  } catch {
    return [];
  }
};

export const dispatchModules = async (input: {
  routes: EoeModuleRoute[];
  taskPlan: EoeTaskPlan;
  context: EoeContextDetection;
  intent: EoeIntentDetection;
  userMessage: string;
}): Promise<EoeModuleContribution[]> => {
  const uniqueModuleIds = [
    ...new Set(input.routes.map((route) => route.resolvedModuleId)),
  ];

  const contributions: EoeModuleContribution[] = [];

  for (const moduleId of uniqueModuleIds) {
    const route = input.routes.find((entry) => entry.resolvedModuleId === moduleId);
    const status =
      route?.available === false
        ? "unavailable"
        : route?.usedFallback
          ? "degraded"
          : "ok";

    const references = await dispatchKnowledgeModules(
      moduleId,
      input.userMessage,
      input.context
    );

    contributions.push({
      moduleId,
      status,
      summary: buildModuleSummary(moduleId, input.context, input.intent),
      references,
      metadata: {
        role: route?.role ?? "supporting",
        priority: route?.priority ?? 0,
        taskSteps: input.taskPlan.steps
          .filter((step) => step.moduleId === moduleId)
          .map((step) => step.action),
      },
    });
  }

  return contributions;
};
