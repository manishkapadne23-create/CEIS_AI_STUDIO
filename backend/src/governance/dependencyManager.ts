import { listArchitectureModules } from "./architectureRegistry.js";
import type { DependencyReport } from "./types.js";

const SHARED_COMPONENTS = [
  "frontend/src/context",
  "frontend/src/components",
  "frontend/src/utils",
  "frontend/src/types",
  "backend/src/infrastructure",
  "backend/src/middleware",
  "backend/src/utils",
];

const detectCircularDependencies = (
  modules: ReturnType<typeof listArchitectureModules>
): string[][] => {
  const graph = new Map(modules.map((module) => [module.id, module.dependencies]));
  const cycles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  const dfs = (node: string): void => {
    if (visiting.has(node)) {
      const cycleStart = stack.indexOf(node);
      if (cycleStart >= 0) {
        cycles.push([...stack.slice(cycleStart), node]);
      }
      return;
    }
    if (visited.has(node)) {
      return;
    }

    visiting.add(node);
    stack.push(node);

    for (const dep of graph.get(node) ?? []) {
      if (graph.has(dep)) {
        dfs(dep);
      }
    }

    stack.pop();
    visiting.delete(node);
    visited.add(node);
  };

  for (const module of modules) {
    dfs(module.id);
  }

  return cycles;
};

export const analyzeDependencies = (): DependencyReport => {
  const modules = listArchitectureModules();
  const knownIds = new Set(modules.map((module) => module.id));

  const unusedModules = modules
    .filter((module) => !modules.some((other) => other.dependencies.includes(module.id)))
    .filter((module) => module.category !== "knowledge-service" && module.id !== "knowledge")
    .map((module) => module.id);

  const deprecatedModules = modules
    .filter((module) => module.status === "deprecated")
    .map((module) => module.id);

  const invalidDependencies = modules.flatMap((module) =>
    module.dependencies
      .filter((dep) => !knownIds.has(dep) && !SHARED_COMPONENTS.some((path) => dep === path))
      .map((dep) => `${module.id} -> ${dep}`)
  );

  return {
    modules,
    circularDependencies: detectCircularDependencies(modules),
    unusedModules: [...unusedModules, ...invalidDependencies],
    deprecatedModules,
    sharedComponents: SHARED_COMPONENTS,
  };
};
