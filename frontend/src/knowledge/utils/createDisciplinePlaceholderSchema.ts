import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import type {
  EngineeringDisciplineKnowledgeSchema,
  EngineeringKnowledgeItem,
  EngineeringSpecializationKnowledge,
} from "../types/EngineeringKnowledgeSchema";

const comingSoonItem = (
  sectionId: string,
  label: string
): EngineeringKnowledgeItem => ({
  id: `${sectionId}-coming-soon`,
  title: label,
  description: "Content will be added to this knowledge module.",
});

const createDefaultSpecialization = (
  disciplineId: string,
  disciplineName: string
): EngineeringSpecializationKnowledge => ({
  id: `${disciplineId}-general`,
  title: disciplineName,
  disciplineId,
  overview: `${disciplineName} knowledge repository structured using the master engineering knowledge schema. Domain content is being expanded across all standard knowledge sections.`,
  scope: [
    `${disciplineName} fundamentals`,
    `${disciplineName} design and analysis`,
    `${disciplineName} standards and professional practice`,
  ],
  designStandards: [
    {
      id: "standards-catalog",
      title: "Standards Catalog",
      code: "Catalog",
      description:
        "Applicable codes and standards for this discipline will be listed here.",
    },
  ],
  designModules: [
    comingSoonItem("design-modules", "Design modules catalog"),
  ],
  designSoftware: [
    comingSoonItem("design-software", "Design software catalog"),
  ],
  aiEngineeringAgents: [
    comingSoonItem("ai-agents", "AI engineering agents"),
  ],
  engineeringCalculators: [
    comingSoonItem("calculators", "Engineering calculators"),
  ],
  templates: [comingSoonItem("templates", "Engineering templates")],
  learningResources: [
    comingSoonItem("learning", "Learning resources"),
  ],
});

export const createDisciplinePlaceholderSchema = (
  disciplineId: string
): EngineeringDisciplineKnowledgeSchema => {
  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  if (!discipline) {
    throw new Error(`Unknown engineering discipline: ${disciplineId}`);
  }

  const specialization = createDefaultSpecialization(
    discipline.id,
    discipline.name
  );

  return {
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    specializations: {
      [specialization.title]: specialization,
    },
  };
};
