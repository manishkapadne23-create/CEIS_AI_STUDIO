import { loadModuleConfig } from "./loadOrchestratorConfig.js";
import type { EoeModuleId } from "./types.js";

export type ModuleHealthStatus = "healthy" | "degraded" | "unavailable";

export interface ModuleHealthEntry {
  moduleId: EoeModuleId;
  label: string;
  status: ModuleHealthStatus;
  fallbackModuleId: EoeModuleId | null;
  message: string;
}

const moduleOverrides = new Map<EoeModuleId, ModuleHealthStatus>();

export const setModuleHealthOverride = (
  moduleId: EoeModuleId,
  status: ModuleHealthStatus | null
): void => {
  if (status === null) {
    moduleOverrides.delete(moduleId);
    return;
  }
  moduleOverrides.set(moduleId, status);
};

export const getModuleHealthSnapshot = () => {
  const modules = loadModuleConfig();

  const entries: ModuleHealthEntry[] = modules.map((module) => {
    const override = moduleOverrides.get(module.id as EoeModuleId);
    const status = override ?? "healthy";

    return {
      moduleId: module.id as EoeModuleId,
      label: module.label,
      status,
      fallbackModuleId: (module.fallbackModuleId as EoeModuleId | null) ?? null,
      message:
        status === "healthy"
          ? "Module available"
          : status === "degraded"
            ? "Module degraded — partial capabilities"
            : "Module unavailable — fallback routing enabled",
    };
  });

  const healthyCount = entries.filter((entry) => entry.status === "healthy").length;

  return {
    engine: "Engineering Orchestrator Engine",
    status:
      healthyCount === entries.length
        ? "healthy"
        : healthyCount > 0
          ? "degraded"
          : "unavailable",
    modules: entries,
    checkedAt: new Date().toISOString(),
  };
};
