import type { ArchitectureModuleEntry, ModuleCategory } from "./types";

const modules = new Map<string, ArchitectureModuleEntry>();

const seed = (): void => {
  if (modules.size > 0) return;

  const entries: ArchitectureModuleEntry[] = [
    { id: "ai", name: "AI Expert Engine", category: "ai-module", version: "1.0.0", path: "src/ai", dependencies: ["plugins", "context"], status: "active" },
    { id: "plugins", name: "Plugin Framework", category: "plugin", version: "1.0.0", path: "src/plugins", dependencies: ["ai"], status: "active" },
    { id: "governance", name: "Architecture Governance", category: "engineering-module", version: "1.0.0", path: "src/governance", dependencies: [], status: "active" },
    { id: "assistant", name: "EDA Assistant", category: "engineering-module", version: "1.0.0", path: "src/assistant", dependencies: ["ai"], status: "active" },
    { id: "workflows", name: "Workflow Automation", category: "workflow", version: "1.0.0", path: "src/workflows", dependencies: ["ai"], status: "active" },
    { id: "knowledge", name: "Knowledge Base", category: "knowledge-service", version: "1.0.0", path: "src/knowledge", dependencies: [], status: "active" },
    { id: "calculators", name: "Calculators", category: "calculator", version: "1.0.0", path: "src/knowledge/calculators", dependencies: ["knowledge"], status: "active" },
    { id: "agents", name: "AI Agents", category: "ai-agent", version: "1.0.0", path: "src/agents", dependencies: ["ai"], status: "active" },
    { id: "templates", name: "Report Templates", category: "template", version: "1.0.0", path: "src/templates", dependencies: ["ai", "documents"], status: "active" },
    { id: "marketplace", name: "Marketplace", category: "engineering-module", version: "1.0.0", path: "src/marketplace", dependencies: ["ai"], status: "active" },
    { id: "dashboard", name: "Intelligence Dashboard", category: "engineering-module", version: "1.0.0", path: "src/dashboard", dependencies: ["ai", "intelligence"], status: "active" },
    { id: "professional-tools", name: "Professional Tools", category: "professional-tool", version: "1.0.0", path: "src/knowledge/professional-tools", dependencies: ["knowledge"], status: "active" },
  ];

  entries.forEach((entry) => modules.set(entry.id, entry));
};

export const registerArchitectureModule = (entry: ArchitectureModuleEntry): void => {
  modules.set(entry.id, entry);
};

export const getArchitectureModule = (id: string): ArchitectureModuleEntry | undefined => {
  seed();
  return modules.get(id);
};

export const listArchitectureModules = (category?: ModuleCategory): ArchitectureModuleEntry[] => {
  seed();
  const all = Array.from(modules.values());
  return category ? all.filter((m) => m.category === category) : all;
};

export const getArchitectureSummary = () => {
  seed();
  const all = Array.from(modules.values());
  const byCategory: Record<string, number> = {};
  for (const module of all) {
    byCategory[module.category] = (byCategory[module.category] ?? 0) + 1;
  }
  return { totalModules: all.length, byCategory };
};
