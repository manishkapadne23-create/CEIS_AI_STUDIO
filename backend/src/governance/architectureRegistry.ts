import type { ArchitectureModuleEntry, ModuleCategory } from "./types.js";

const modules = new Map<string, ArchitectureModuleEntry>();

const register = (entry: ArchitectureModuleEntry): void => {
  modules.set(entry.id, entry);
};

const seedArchitectureRegistry = (): void => {
  if (modules.size > 0) {
    return;
  }

  const engineeringModules: ArchitectureModuleEntry[] = [
    { id: "assistant", name: "Engineering Digital Assistant", category: "engineering-module", version: "1.0.0", path: "frontend/src/assistant", dependencies: ["ai", "knowledge"], status: "active" },
    { id: "workflows", name: "Workflow Automation", category: "engineering-module", version: "1.0.0", path: "frontend/src/workflows", dependencies: ["ai", "projects"], status: "active" },
    { id: "design", name: "Design Wizard", category: "engineering-module", version: "1.0.0", path: "frontend/src/design", dependencies: ["ai", "compliance"], status: "active" },
    { id: "estimation", name: "Estimation & Cost", category: "engineering-module", version: "1.0.0", path: "frontend/src/estimation", dependencies: ["ai", "projects"], status: "active" },
    { id: "tender", name: "Tender Intelligence", category: "engineering-module", version: "1.0.0", path: "frontend/src/tender", dependencies: ["ai", "documents"], status: "active" },
    { id: "contracts", name: "Contract & Claims", category: "engineering-module", version: "1.0.0", path: "frontend/src/contracts", dependencies: ["ai", "compliance"], status: "active" },
    { id: "research", name: "Research & Innovation", category: "engineering-module", version: "1.0.0", path: "frontend/src/research", dependencies: ["ai", "knowledge-network"], status: "active" },
    { id: "mentor", name: "Mentor & Career", category: "engineering-module", version: "1.0.0", path: "frontend/src/mentor", dependencies: ["ai"], status: "active" },
    { id: "knowledge-capture", name: "Knowledge Capture", category: "engineering-module", version: "1.0.0", path: "frontend/src/knowledge-capture", dependencies: ["ai", "knowledge"], status: "active" },
    { id: "site-execution", name: "Site Execution Intelligence", category: "engineering-module", version: "1.0.0", path: "frontend/src/site-execution", dependencies: ["ai", "projects"], status: "active" },
    { id: "dashboard", name: "Engineering Intelligence Dashboard", category: "engineering-module", version: "1.0.0", path: "frontend/src/dashboard", dependencies: ["ai", "intelligence"], status: "active" },
    { id: "marketplace", name: "Marketplace", category: "engineering-module", version: "1.0.0", path: "frontend/src/marketplace", dependencies: ["ai"], status: "active" },
    { id: "templates", name: "Report Generator", category: "template", version: "1.0.0", path: "frontend/src/templates", dependencies: ["ai", "documents"], status: "active" },
    { id: "compliance", name: "Compliance Engine", category: "engineering-module", version: "1.0.0", path: "frontend/src/compliance", dependencies: ["ai", "knowledge"], status: "active" },
    { id: "documents", name: "Document Intelligence", category: "engineering-module", version: "1.0.0", path: "frontend/src/documents", dependencies: ["ai", "projects"], status: "active" },
  ];

  const aiModules: ArchitectureModuleEntry[] = [
    { id: "ai", name: "AI Expert Engine", category: "ai-module", version: "1.0.0", path: "frontend/src/ai", dependencies: ["context", "plugins"], status: "active" },
    { id: "orchestrator", name: "Orchestrator", category: "ai-module", version: "1.0.0", path: "frontend/src/orchestrator", dependencies: ["ai"], status: "active" },
    { id: "engineering-orchestrator-engine", name: "Engineering Orchestrator Engine", category: "ai-module", version: "1.0.0", path: "backend/src/orchestrator", dependencies: ["ai", "edm"], status: "active" },
    { id: "engineering-evidence-citation-engine", name: "Engineering Evidence & Citation Engine", category: "ai-module", version: "1.0.0", path: "backend/src/evidence", dependencies: ["ai", "edm", "orchestrator"], status: "active" },
    { id: "engineering-predictive-intelligence", name: "Engineering Predictive Intelligence Engine", category: "ai-module", version: "1.0.0", path: "backend/src/predictive", dependencies: ["ai", "orchestrator", "evidence"], status: "active" },
    { id: "engineering-multi-agent-collaboration", name: "Engineering Multi-Agent Collaboration Engine", category: "ai-module", version: "1.0.0", path: "backend/src/agents", dependencies: ["ai", "orchestrator", "evidence"], status: "active" },
    { id: "engineering-digital-engineer", name: "Engineering Digital Engineer", category: "ai-module", version: "1.0.0", path: "backend/src/digital-engineer", dependencies: ["ai", "orchestrator", "predictive"], status: "active" },
    { id: "engineering-simulation-scenario-analysis", name: "Engineering Simulation & Scenario Analysis Engine", category: "ai-module", version: "1.0.0", path: "backend/src/simulation", dependencies: ["ai", "orchestrator", "decision-support"], status: "active" },
    { id: "enterprise-security-ip-protection", name: "Enterprise Security, IP Protection & Anti-Reverse Engineering Framework", category: "ai-module", version: "1.0.0", path: "backend/src/security", dependencies: ["infrastructure", "auth"], status: "active" },
    { id: "copilot", name: "Copilot Intelligence", category: "ai-module", version: "1.0.0", path: "frontend/src/copilot", dependencies: ["ai", "knowledge"], status: "active" },
    { id: "intelligence", name: "Intelligence Engine", category: "ai-module", version: "1.0.0", path: "frontend/src/intelligence", dependencies: ["ai"], status: "active" },
    { id: "decision-support", name: "Decision Support", category: "ai-module", version: "1.0.0", path: "frontend/src/decision-support", dependencies: ["ai"], status: "active" },
    { id: "backend-ai", name: "Multi-LLM Provider Layer", category: "ai-module", version: "1.0.0", path: "backend/src/ai", dependencies: ["infrastructure"], status: "active" },
  ];

  const agents: ArchitectureModuleEntry[] = [
    { id: "agents", name: "Engineering AI Agents", category: "ai-agent", version: "1.0.0", path: "frontend/src/agents", dependencies: ["ai"], status: "active" },
  ];

  const plugins: ArchitectureModuleEntry[] = [
    { id: "plugins", name: "Plugin Framework", category: "plugin", version: "1.0.0", path: "frontend/src/plugins", dependencies: ["ai"], status: "active" },
    { id: "backend-plugins", name: "Server Plugin Framework", category: "plugin", version: "1.0.0", path: "backend/src/plugins", dependencies: ["infrastructure"], status: "active" },
  ];

  const knowledge: ArchitectureModuleEntry[] = [
    { id: "knowledge", name: "Knowledge Base", category: "knowledge-service", version: "1.0.0", path: "frontend/src/knowledge", dependencies: [], status: "active" },
    { id: "knowledge-network", name: "Knowledge Network", category: "knowledge-service", version: "1.0.0", path: "frontend/src/knowledge-network", dependencies: ["knowledge"], status: "active" },
    { id: "calculators", name: "Engineering Calculators", category: "calculator", version: "1.0.0", path: "frontend/src/knowledge/calculators", dependencies: ["knowledge"], status: "active" },
    { id: "professional-tools", name: "Professional Tools", category: "professional-tool", version: "1.0.0", path: "frontend/src/knowledge/professional-tools", dependencies: ["knowledge"], status: "active" },
  ];

  const workflows: ArchitectureModuleEntry[] = [
    { id: "workflow-registry", name: "Workflow Registry", category: "workflow", version: "1.0.0", path: "frontend/src/knowledge/workflows", dependencies: ["knowledge", "workflows"], status: "active" },
  ];

  const reports: ArchitectureModuleEntry[] = [
    { id: "audit", name: "Audit Reports", category: "report", version: "1.0.0", path: "frontend/src/audit", dependencies: ["ai", "compliance"], status: "active" },
    { id: "actions-export", name: "Export Engine", category: "report", version: "0.9.0", path: "frontend/src/actions", dependencies: ["documents"], status: "beta" },
  ];

  [
    ...engineeringModules,
    ...aiModules,
    ...agents,
    ...plugins,
    ...knowledge,
    ...workflows,
    ...reports,
  ].forEach(register);
};

export const registerArchitectureModule = (entry: ArchitectureModuleEntry): void => {
  modules.set(entry.id, entry);
};

export const getArchitectureModule = (id: string): ArchitectureModuleEntry | undefined =>
  modules.get(id);

export const listArchitectureModules = (category?: ModuleCategory): ArchitectureModuleEntry[] => {
  seedArchitectureRegistry();
  const all = Array.from(modules.values());
  return category ? all.filter((module) => module.category === category) : all;
};

export const getArchitectureSummary = (): {
  totalModules: number;
  byCategory: Record<ModuleCategory, number>;
} => {
  seedArchitectureRegistry();
  const all = Array.from(modules.values());
  const byCategory = {} as Record<ModuleCategory, number>;

  for (const module of all) {
    byCategory[module.category] = (byCategory[module.category] ?? 0) + 1;
  }

  return { totalModules: all.length, byCategory };
};
