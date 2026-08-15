import { listArchitectureModules } from "./architectureRegistry";
import type { DependencyReport } from "./types";

const SHARED = ["src/context", "src/components", "src/utils", "src/types"];

export const analyzeDependencies = (): DependencyReport => {
  const modules = listArchitectureModules();

  const deprecatedModules = modules
    .filter((m) => m.status === "deprecated")
    .map((m) => m.id);

  const unusedModules = modules
    .filter((m) => !modules.some((other) => other.dependencies.includes(m.id)))
    .filter((m) => m.id !== "knowledge" && m.id !== "governance")
    .map((m) => m.id);

  return {
    modules,
    circularDependencies: [],
    unusedModules,
    deprecatedModules,
    sharedComponents: SHARED,
  };
};
