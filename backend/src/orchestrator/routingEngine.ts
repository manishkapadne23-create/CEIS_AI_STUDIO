import { loadRoutingRules } from "./loadOrchestratorConfig.js";
import { getModuleHealthSnapshot } from "./healthMonitor.js";
import type {
  EoeIntentId,
  EoeModuleId,
  EoeModuleRole,
  EoeModuleRoute,
} from "./types.js";

const resolveFallback = (
  moduleId: EoeModuleId,
  healthMap: Map<string, { available: boolean; fallbackModuleId: string | null }>
): { resolvedModuleId: EoeModuleId; usedFallback: boolean } => {
  let current = moduleId;
  let usedFallback = false;
  const visited = new Set<string>();

  while (true) {
    const health = healthMap.get(current);
    if (!health || health.available) {
      return { resolvedModuleId: current, usedFallback };
    }

    if (!health.fallbackModuleId || visited.has(health.fallbackModuleId)) {
      return { resolvedModuleId: "ai-expert", usedFallback: true };
    }

    visited.add(current);
    current = health.fallbackModuleId as EoeModuleId;
    usedFallback = true;
  }
};

export const resolveRoutes = (
  primaryIntent: EoeIntentId,
  secondaryIntents: EoeIntentId[],
  confidence: number
): EoeModuleRoute[] => {
  const rules = loadRoutingRules();
  const healthSnapshot = getModuleHealthSnapshot();
  const healthMap = new Map(
    healthSnapshot.modules.map((module) => [
      module.moduleId,
      {
        available: module.status !== "unavailable",
        fallbackModuleId: module.fallbackModuleId,
      },
    ])
  );

  const intentIds = [primaryIntent, ...secondaryIntents];
  const routeMap = new Map<string, EoeModuleRoute>();

  for (const intentId of intentIds) {
    const rule = rules.find((entry) => entry.intentId === intentId);
    if (!rule) {
      continue;
    }

    for (const moduleRoute of rule.modules) {
      const moduleId = moduleRoute.moduleId as EoeModuleId;
      const health = healthMap.get(moduleId);
      const available = health?.available ?? true;
      const { resolvedModuleId, usedFallback } = resolveFallback(moduleId, healthMap);

      const candidate: EoeModuleRoute = {
        moduleId,
        role: moduleRoute.role as EoeModuleRole,
        priority: moduleRoute.priority,
        reason: moduleRoute.reason,
        confidence,
        available,
        usedFallback,
        resolvedModuleId,
      };

      const key = `${candidate.moduleId}:${candidate.role}`;
      const existing = routeMap.get(key);
      if (!existing || candidate.priority > existing.priority) {
        routeMap.set(key, candidate);
      }
    }
  }

  if (routeMap.size === 0) {
    routeMap.set("ai-expert:primary", {
      moduleId: "ai-expert",
      role: "primary",
      priority: 5,
      reason: "Default engineering guidance route",
      confidence,
      available: true,
      usedFallback: false,
      resolvedModuleId: "ai-expert",
    });
  }

  return Array.from(routeMap.values()).sort(
    (left, right) => right.priority - left.priority
  );
};

export const partitionRoutes = (routes: EoeModuleRoute[]) => {
  const primaryRoute =
    routes.find((route) => route.role === "primary") ?? routes[0] ?? null;
  const supportingRoutes = routes.filter((route) => route.role === "supporting");
  const fallbackRoutes = routes.filter((route) => route.usedFallback);

  return { primaryRoute, supportingRoutes, fallbackRoutes };
};
