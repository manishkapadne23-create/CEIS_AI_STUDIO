import type {
  EngineeringKnowledgeSchemaRegistry,
  EngineeringSpecializationKnowledge,
} from "../../types/EngineeringKnowledgeSchema";
import { disciplineKnowledgeSchemaMap } from "./disciplineSchemaRegistry";

export const engineeringKnowledgeSchemaRegistry: EngineeringKnowledgeSchemaRegistry =
  {
    disciplines: disciplineKnowledgeSchemaMap,
    getDiscipline(disciplineId: string) {
      return disciplineKnowledgeSchemaMap[disciplineId];
    },
    getSpecialization(
      disciplineId: string,
      specializationTitle: string
    ): EngineeringSpecializationKnowledge | undefined {
      return disciplineKnowledgeSchemaMap[disciplineId]
        ?.specializations[specializationTitle];
    },
  };

export const getSpecializationKnowledge = (
  disciplineId: string,
  specializationTitle: string
): EngineeringSpecializationKnowledge | undefined =>
  engineeringKnowledgeSchemaRegistry.getSpecialization(
    disciplineId,
    specializationTitle
  );

export {
  disciplineKnowledgeSchemas,
  disciplineKnowledgeSchemaMap,
} from "./disciplineSchemaRegistry";
