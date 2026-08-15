import { civilEngineeringKnowledgeSchema } from "./civil";
import { mechanicalEngineeringKnowledgeSchema } from "./mechanical";
import { electricalEngineeringKnowledgeSchema } from "./electrical";
import { computerEngineeringKnowledgeSchema } from "./computer";
import { electronicsTelecommunicationEngineeringKnowledgeSchema } from "./electronics-telecommunication";
import { chemicalEngineeringKnowledgeSchema } from "./chemical";
import { environmentalEngineeringKnowledgeSchema } from "./environmental";
import { miningEngineeringKnowledgeSchema } from "./mining";
import { marineEngineeringKnowledgeSchema } from "./marine";
import { aerospaceEngineeringKnowledgeSchema } from "./aerospace";
import { railwayEngineeringKnowledgeSchema } from "./railway";
import type { EngineeringDisciplineKnowledgeSchema } from "../../types/EngineeringKnowledgeSchema";
import { DISCIPLINE_DEFINITIONS } from "../disciplineManifest";
import { createDisciplinePlaceholderSchema } from "../../utils/createDisciplinePlaceholderSchema";

const explicitDisciplineSchemas: EngineeringDisciplineKnowledgeSchema[] = [
    civilEngineeringKnowledgeSchema,
    mechanicalEngineeringKnowledgeSchema,
    electricalEngineeringKnowledgeSchema,
    computerEngineeringKnowledgeSchema,
    electronicsTelecommunicationEngineeringKnowledgeSchema,
    chemicalEngineeringKnowledgeSchema,
    environmentalEngineeringKnowledgeSchema,
    miningEngineeringKnowledgeSchema,
    marineEngineeringKnowledgeSchema,
    aerospaceEngineeringKnowledgeSchema,
    railwayEngineeringKnowledgeSchema,
];

const explicitDisciplineIds = new Set(
  explicitDisciplineSchemas.map((schema) => schema.disciplineId)
);

const placeholderDisciplineSchemas = DISCIPLINE_DEFINITIONS.filter(
  (discipline) => !explicitDisciplineIds.has(discipline.id)
).map((discipline) => createDisciplinePlaceholderSchema(discipline.id));

export const disciplineKnowledgeSchemas: EngineeringDisciplineKnowledgeSchema[] =
  [...explicitDisciplineSchemas, ...placeholderDisciplineSchemas];

export const disciplineKnowledgeSchemaMap =
  disciplineKnowledgeSchemas.reduce<
    Record<string, EngineeringDisciplineKnowledgeSchema>
  >((accumulator, schema) => {
    accumulator[schema.disciplineId] = schema;
    return accumulator;
  }, {});
