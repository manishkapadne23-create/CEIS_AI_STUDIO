import type {
  EngineeringKnowledgeItem,
  EngineeringKnowledgeStandard,
  EngineeringSpecializationKnowledge,
} from "../types/EngineeringKnowledgeSchema";

export interface CreatePlaceholderSpecializationInput {
  id: string;
  title: string;
  disciplineId: string;
  overview: string;
  scope?: string[];
  designStandards?: string[];
  designSoftware?: string[];
  aiEngineeringAgents?: string[];
}

const toKnowledgeItems = (
  items: string[],
  prefix: string
): EngineeringKnowledgeItem[] =>
  items.map((title, index) => ({
    id: `${prefix}-${index}`,
    title,
  }));

const toKnowledgeStandards = (
  standards: string[]
): EngineeringKnowledgeStandard[] =>
  standards.map((code, index) => ({
    id: `standard-${index}`,
    title: code,
    code,
  }));

export const createPlaceholderSpecialization = (
  input: CreatePlaceholderSpecializationInput
): EngineeringSpecializationKnowledge => ({
  id: input.id,
  title: input.title,
  disciplineId: input.disciplineId,
  overview: input.overview,
  scope: input.scope ?? [],
  designStandards: toKnowledgeStandards(input.designStandards ?? []),
  designModules: [],
  designSoftware: toKnowledgeItems(
    input.designSoftware ?? [],
    "software"
  ),
  aiEngineeringAgents: toKnowledgeItems(
    input.aiEngineeringAgents ?? [],
    "agent"
  ),
  engineeringCalculators: [],
  templates: [],
  learningResources: [],
});
