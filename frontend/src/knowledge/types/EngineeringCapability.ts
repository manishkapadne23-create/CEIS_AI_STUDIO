export const ENGINEERING_CAPABILITY_KEYS = {
  aiChat: "ai-chat",
  knowledge: "knowledge",
  standards: "standards",
  documentIntelligence: "document-intelligence",
  professionalTools: "professional-tools",
  calculators: "calculators",
  templates: "templates",
  learning: "learning",
  aiEngineeringAgents: "ai-engineering-agents",
} as const;

export type EngineeringCapabilityKey =
  (typeof ENGINEERING_CAPABILITY_KEYS)[keyof typeof ENGINEERING_CAPABILITY_KEYS];

export const ENGINEERING_CAPABILITY_LABELS: Record<
  EngineeringCapabilityKey,
  string
> = {
  "ai-chat": "AI Chat",
  knowledge: "Knowledge",
  standards: "Standards",
  "document-intelligence": "Document Intelligence",
  "professional-tools": "Professional Tools",
  calculators: "Calculators",
  templates: "Templates",
  learning: "Learning",
  "ai-engineering-agents": "AI Engineering Agents",
};

export type EngineeringCapabilityStatus =
  | "available"
  | "beta"
  | "coming-soon";

export interface EngineeringCapability {
  id: string;
  key: EngineeringCapabilityKey;
  label: string;
  description: string;
  enabled: boolean;
  status: EngineeringCapabilityStatus;
}

export interface EngineeringCapabilityRegistry {
  disciplineId: string;
  disciplineName: string;
  capabilities: EngineeringCapability[];
}

export interface EngineeringCapabilityRegistryMap {
  registries: Record<string, EngineeringCapabilityRegistry>;
  getRegistry: (
    disciplineId: string
  ) => EngineeringCapabilityRegistry | undefined;
  listRegistries: () => EngineeringCapabilityRegistry[];
}
