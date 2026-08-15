import type {
  EngineeringIntent,
  ExecutionPlan,
  ExecutionStep,
  ModuleRouteTarget,
} from "./types";

const ENGINE_ACTIONS: Record<string, string> = {
  "standards-engine": "Load and interpret applicable standards",
  "calculator-engine": "Recommend and guide engineering calculations",
  "professional-tools": "Activate professional engineering tools",
  "workflow-engine": "Suggest and guide engineering workflow",
  "action-engine": "Generate reports, checklists, and deliverables",
  "document-intelligence": "Retrieve and analyze documents/drawings",
  "ai-expert": "Provide discipline AI expert guidance",
  "decision-support": "Run engineering decision support analysis",
  "agent-engine": "Activate discipline engineering agent",
  "learning-hub": "Recommend learning resources",
};

export const buildExecutionPlan = (
  routes: ModuleRouteTarget[],
  primaryIntent: EngineeringIntent
): ExecutionPlan => {
  const steps: ExecutionStep[] = routes.map((route, index) => ({
    engineId: route.engineId,
    moduleId: route.moduleId,
    action: ENGINE_ACTIONS[route.engineId] ?? `Execute ${route.engineId}`,
    order: index + 1,
  }));

  if (primaryIntent === "design" && steps.length < 3) {
    const designSteps: ExecutionStep[] = [
      {
        engineId: "standards-engine",
        moduleId: "standards",
        action: ENGINE_ACTIONS["standards-engine"],
        order: steps.length + 1,
      },
      {
        engineId: "calculator-engine",
        moduleId: "calculators",
        action: ENGINE_ACTIONS["calculator-engine"],
        order: steps.length + 2,
      },
      {
        engineId: "workflow-engine",
        moduleId: "professional-tools",
        action: ENGINE_ACTIONS["workflow-engine"],
        order: steps.length + 3,
      },
      {
        engineId: "ai-expert",
        moduleId: "ai-expert",
        action: ENGINE_ACTIONS["ai-expert"],
        order: steps.length + 4,
      },
    ];

    for (const step of designSteps) {
      if (!steps.some((s) => s.engineId === step.engineId)) {
        steps.push({ ...step, order: steps.length + 1 });
      }
    }
  }

  steps.sort((a, b) => a.order - b.order);

  const isMultiModule = steps.length > 1;
  const engineNames = [...new Set(steps.map((s) => s.engineId))].join(" + ");

  const summary = isMultiModule
    ? `Multi-module execution: ${engineNames} coordinated for ${primaryIntent.replace(/-/g, " ")}`
    : steps.length === 1
      ? `Single-module: ${steps[0].engineId}`
      : "AI Expert general guidance";

  return {
    steps,
    isMultiModule,
    summary,
  };
};

export const formatExecutionPlanForPrompt = (plan: ExecutionPlan): string => {
  const stepLines = plan.steps.map(
    (step) =>
      `${step.order}. [${step.engineId}] → ${step.moduleId ?? "system"}: ${step.action}`
  );

  return [
    `Execution mode: ${plan.isMultiModule ? "Multi-module" : "Single-module"}`,
    plan.summary,
    "",
    "Coordinated steps:",
    ...stepLines,
  ].join("\n");
};
