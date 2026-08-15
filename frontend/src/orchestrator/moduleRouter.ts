import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type {
  EngineeringIntent,
  ModuleRouteTarget,
  OrchestratorEngineId,
} from "./types";

interface IntentModuleMapping {
  moduleId: WorkspaceCategoryId;
  engineId: OrchestratorEngineId;
  reason: string;
  priority: number;
}

const INTENT_MODULE_MAP: Record<EngineeringIntent, IntentModuleMapping[]> = {
  "general-question": [
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "General engineering guidance via AI Expert",
      priority: 5,
    },
  ],
  standards: [
    {
      moduleId: "standards",
      engineId: "standards-engine",
      reason: "Standards and code interpretation",
      priority: 10,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "Expert interpretation support",
      priority: 6,
    },
  ],
  calculation: [
    {
      moduleId: "calculators",
      engineId: "calculator-engine",
      reason: "Engineering calculation required",
      priority: 10,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "Calculation guidance and verification",
      priority: 7,
    },
  ],
  design: [
    {
      moduleId: "standards",
      engineId: "standards-engine",
      reason: "Design requires applicable standards",
      priority: 9,
    },
    {
      moduleId: "calculators",
      engineId: "calculator-engine",
      reason: "Design calculations needed",
      priority: 9,
    },
    {
      moduleId: "professional-tools",
      engineId: "workflow-engine",
      reason: "Design workflow guidance",
      priority: 8,
    },
    {
      moduleId: "professional-tools",
      engineId: "professional-tools",
      reason: "Design assistants and tools",
      priority: 8,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "AI Expert design intelligence",
      priority: 9,
    },
  ],
  planning: [
    {
      moduleId: "professional-tools",
      engineId: "workflow-engine",
      reason: "Planning workflow and procedures",
      priority: 8,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "Planning guidance",
      priority: 7,
    },
  ],
  estimation: [
    {
      moduleId: "professional-tools",
      engineId: "professional-tools",
      reason: "Estimation and costing tools",
      priority: 9,
    },
    {
      moduleId: "calculators",
      engineId: "calculator-engine",
      reason: "Quantity and rate calculations",
      priority: 7,
    },
  ],
  quantity: [
    {
      moduleId: "professional-tools",
      engineId: "professional-tools",
      reason: "BOQ and quantity surveying tools",
      priority: 10,
    },
    {
      moduleId: "calculators",
      engineId: "calculator-engine",
      reason: "Measurement calculations",
      priority: 8,
    },
  ],
  "qa-qc": [
    {
      moduleId: "professional-tools",
      engineId: "workflow-engine",
      reason: "QA/QC workflow and procedures",
      priority: 9,
    },
    {
      moduleId: "professional-tools",
      engineId: "action-engine",
      reason: "Inspection checklists and reports",
      priority: 8,
    },
  ],
  tender: [
    {
      moduleId: "professional-tools",
      engineId: "professional-tools",
      reason: "Tender preparation tools",
      priority: 9,
    },
    {
      moduleId: "documents",
      engineId: "document-intelligence",
      reason: "Tender document management",
      priority: 7,
    },
  ],
  contracts: [
    {
      moduleId: "documents",
      engineId: "document-intelligence",
      reason: "Contract document review",
      priority: 9,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "Contract interpretation guidance",
      priority: 7,
    },
  ],
  claims: [
    {
      moduleId: "documents",
      engineId: "document-intelligence",
      reason: "Claims documentation",
      priority: 9,
    },
    {
      moduleId: "professional-tools",
      engineId: "professional-tools",
      reason: "Claims analysis tools",
      priority: 8,
    },
  ],
  construction: [
    {
      moduleId: "professional-tools",
      engineId: "workflow-engine",
      reason: "Construction execution workflow",
      priority: 9,
    },
    {
      moduleId: "professional-tools",
      engineId: "action-engine",
      reason: "Method statements and site reports",
      priority: 8,
    },
  ],
  maintenance: [
    {
      moduleId: "standards",
      engineId: "standards-engine",
      reason: "Maintenance standards and codes",
      priority: 8,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "Maintenance planning guidance",
      priority: 7,
    },
  ],
  learning: [
    {
      moduleId: "learning-hub",
      engineId: "learning-hub",
      reason: "Learning resources and courses",
      priority: 10,
    },
  ],
  research: [
    {
      moduleId: "learning-hub",
      engineId: "learning-hub",
      reason: "Research and reference materials",
      priority: 9,
    },
    {
      moduleId: "standards",
      engineId: "standards-engine",
      reason: "Standards reference for research",
      priority: 7,
    },
  ],
  comparison: [
    {
      moduleId: "ai-expert",
      engineId: "decision-support",
      reason: "Engineering decision support and comparison",
      priority: 10,
    },
    {
      moduleId: "standards",
      engineId: "standards-engine",
      reason: "Standards comparison context",
      priority: 7,
    },
  ],
  workflow: [
    {
      moduleId: "professional-tools",
      engineId: "workflow-engine",
      reason: "Engineering workflow execution",
      priority: 10,
    },
  ],
  document: [
    {
      moduleId: "documents",
      engineId: "document-intelligence",
      reason: "Document and drawing intelligence",
      priority: 10,
    },
  ],
  "report-generation": [
    {
      moduleId: "professional-tools",
      engineId: "action-engine",
      reason: "Report generation via Action Engine",
      priority: 10,
    },
    {
      moduleId: "ai-expert",
      engineId: "ai-expert",
      reason: "AI-assisted report content",
      priority: 8,
    },
  ],
  checklist: [
    {
      moduleId: "professional-tools",
      engineId: "action-engine",
      reason: "Checklist generation via Action Engine",
      priority: 10,
    },
  ],
};

type ModuleRouterCallback = (
  moduleId: WorkspaceCategoryId,
  reason: string
) => void;

let moduleRouterCallback: ModuleRouterCallback | null = null;

export const registerOrchestratorModuleRouter = (
  callback: ModuleRouterCallback | null
): void => {
  moduleRouterCallback = callback;
};

const dedupeRoutes = (routes: ModuleRouteTarget[]): ModuleRouteTarget[] => {
  const seen = new Map<string, ModuleRouteTarget>();

  for (const route of routes) {
    const key = `${route.moduleId}:${route.engineId}`;
    const existing = seen.get(key);
    if (!existing || route.priority > existing.priority) {
      seen.set(key, route);
    }
  }

  return Array.from(seen.values()).sort((a, b) => b.priority - a.priority);
};

export const resolveModuleRoutes = (
  primaryIntent: EngineeringIntent,
  secondaryIntents: EngineeringIntent[],
  confidence: number
): ModuleRouteTarget[] => {
  const intents = [primaryIntent, ...secondaryIntents];
  const routes: ModuleRouteTarget[] = [];

  for (const intent of intents) {
    const mappings = INTENT_MODULE_MAP[intent] ?? INTENT_MODULE_MAP["general-question"];
    for (const mapping of mappings) {
      routes.push({
        moduleId: mapping.moduleId,
        engineId: mapping.engineId,
        reason: mapping.reason,
        priority: mapping.priority,
        confidence,
      });
    }
  }

  return dedupeRoutes(routes);
};

export const selectPrimaryModuleRoute = (
  routes: ModuleRouteTarget[],
  currentModuleId: WorkspaceCategoryId | null
): ModuleRouteTarget | null => {
  if (routes.length === 0) return null;

  const switchable = routes.find((route) => route.moduleId !== currentModuleId);
  return switchable ?? routes[0];
};

export const applyOrchestratorModuleRoute = (
  route: ModuleRouteTarget | null
): boolean => {
  if (!route || !moduleRouterCallback) return false;
  moduleRouterCallback(route.moduleId, route.reason);
  return true;
};

export const getIntentModuleMappings = (): typeof INTENT_MODULE_MAP =>
  INTENT_MODULE_MAP;
