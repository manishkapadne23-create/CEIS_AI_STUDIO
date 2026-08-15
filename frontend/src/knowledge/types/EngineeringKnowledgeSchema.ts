export const ENGINEERING_KNOWLEDGE_SECTION_KEYS = {
  overview: "overview",
  scope: "scope",
  designStandards: "design-standards",
  designModules: "design-modules",
  designSoftware: "design-software",
  aiEngineeringAgents: "ai-engineering-agents",
  engineeringCalculators: "engineering-calculators",
  templates: "templates",
  learningResources: "learning-resources",
} as const;

export type EngineeringKnowledgeSectionKey =
  (typeof ENGINEERING_KNOWLEDGE_SECTION_KEYS)[keyof typeof ENGINEERING_KNOWLEDGE_SECTION_KEYS];

export const ENGINEERING_KNOWLEDGE_SECTION_LABELS: Record<
  EngineeringKnowledgeSectionKey,
  string
> = {
  overview: "Overview",
  scope: "Scope",
  "design-standards": "Design Standards",
  "design-modules": "Design Modules",
  "design-software": "Design Software",
  "ai-engineering-agents": "AI Engineering Agents",
  "engineering-calculators": "Engineering Calculators",
  templates: "Templates",
  "learning-resources": "Learning Resources",
};

export interface EngineeringKnowledgeItem {
  id: string;
  title: string;
  description?: string;
}

export interface EngineeringKnowledgeStandard
  extends EngineeringKnowledgeItem {
  code?: string;
}

export interface EngineeringSpecializationKnowledge {
  id: string;
  title: string;
  disciplineId: string;
  overview: string;
  scope: string[];
  designStandards: EngineeringKnowledgeStandard[];
  designModules: EngineeringKnowledgeItem[];
  designSoftware: EngineeringKnowledgeItem[];
  aiEngineeringAgents: EngineeringKnowledgeItem[];
  engineeringCalculators: EngineeringKnowledgeItem[];
  templates: EngineeringKnowledgeItem[];
  learningResources: EngineeringKnowledgeItem[];
}

export interface EngineeringDisciplineKnowledgeSchema {
  disciplineId: string;
  disciplineName: string;
  specializations: Record<string, EngineeringSpecializationKnowledge>;
}

export interface EngineeringKnowledgeSchemaRegistry {
  disciplines: Record<string, EngineeringDisciplineKnowledgeSchema>;
  getDiscipline: (
    disciplineId: string
  ) => EngineeringDisciplineKnowledgeSchema | undefined;
  getSpecialization: (
    disciplineId: string,
    specializationTitle: string
  ) => EngineeringSpecializationKnowledge | undefined;
}
