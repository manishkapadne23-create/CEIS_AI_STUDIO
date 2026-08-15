import type {
  EoeComposedResponse,
  EoeContextDetection,
  EoeIntentDetection,
  EoeModuleContribution,
  EoeModuleRoute,
  EoeTaskPlan,
} from "./types.js";

const sectionTypeForModule = (
  moduleId: string
): EoeComposedResponse["sections"][number]["type"] => {
  switch (moduleId) {
    case "standards-engine":
      return "standards";
    case "calculator-engine":
      return "calculations";
    case "document-engine":
    case "professional-tools":
      return "templates";
    case "workflow-engine":
      return "workflow";
    case "learning-hub":
      return "learning";
    case "simulation-engine":
    case "decision-intelligence":
      return "ai-guidance";
    default:
      return "ai-guidance";
  }
};

export const composeOrchestratedResponse = (input: {
  userMessage: string;
  intent: EoeIntentDetection;
  context: EoeContextDetection;
  primaryRoute: EoeModuleRoute | null;
  routes: EoeModuleRoute[];
  taskPlan: EoeTaskPlan;
  contributions: EoeModuleContribution[];
}): EoeComposedResponse => {
  const discipline = input.context.disciplineName ?? "Engineering";
  const specialization = input.context.specializationName ?? "General";
  const topic = input.context.topic ?? "the requested topic";

  const sections = input.contributions.map((contribution) => ({
    type: sectionTypeForModule(contribution.moduleId),
    title: contribution.moduleId.replace(/-/g, " ").toUpperCase(),
    content: [
      contribution.summary,
      contribution.references.length > 0
        ? `References: ${contribution.references.join("; ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    moduleId: contribution.moduleId,
  }));

  const knowledgeReferences = input.contributions.flatMap(
    (contribution) => contribution.references
  );

  const orchestrationSummary = [
    `Discipline: ${discipline}`,
    `Specialization: ${specialization}`,
    `Topic: ${topic}`,
    `Intent: ${input.intent.intentLabel}`,
    input.taskPlan.templateLabel
      ? `Task: ${input.taskPlan.templateLabel}`
      : input.taskPlan.summary,
    `Primary module: ${input.primaryRoute?.resolvedModuleId ?? "ai-expert"}`,
    input.taskPlan.isComplex ? "Multi-module orchestration active" : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    title: `${input.intent.intentLabel} — ${topic}`,
    orchestrationSummary,
    sections,
    knowledgeReferences,
    recommendedModules: input.routes.map((route) => route.resolvedModuleId),
  };
};

export const buildPromptAugmentation = (input: {
  intent: EoeIntentDetection;
  context: EoeContextDetection;
  routes: EoeModuleRoute[];
  primaryRoute: EoeModuleRoute | null;
  taskPlan: EoeTaskPlan;
  composedResponse: EoeComposedResponse;
}): string =>
  [
    "========================================",
    "Engineering Orchestrator Engine (EOE)",
    "========================================",
    "Every response must be orchestrated across Sarathi engineering modules.",
    "",
    "DETECTED CONTEXT:",
    `- Discipline: ${input.context.disciplineName ?? "Unknown"}`,
    `- Specialization: ${input.context.specializationName ?? "Unknown"}`,
    `- Topic: ${input.context.topic ?? "General"}`,
    `- Intent: ${input.intent.intentLabel} (${input.intent.primaryIntent})`,
    `- Confidence: ${Math.round(input.intent.confidence * 100)}%`,
    "",
    "MODULE ROUTING:",
    ...input.routes
      .slice(0, 8)
      .map(
        (route) =>
          `- [${route.role}] ${route.resolvedModuleId}: ${route.reason} (priority ${route.priority})`
      ),
    "",
    "TASK PLAN:",
    input.taskPlan.templateLabel
      ? `Template: ${input.taskPlan.templateLabel}`
      : input.taskPlan.summary,
    ...input.taskPlan.steps.map(
      (step) => `  ${step.order}. [${step.moduleId}] ${step.action}`
    ),
    "",
    "MODULE CONTRIBUTIONS:",
    ...input.composedResponse.sections.map(
      (section) => `- ${section.title}: ${section.content.split("\n")[0]}`
    ),
    "",
    "COMPOSITION INSTRUCTIONS:",
    "- Combine standards, calculations, workflows, templates, and learning resources",
    "- Present one unified structured engineering answer",
    "- Cite applicable standards and reference orchestrated modules explicitly",
    "- Do not ask the user to switch modules manually",
  ].join("\n");
