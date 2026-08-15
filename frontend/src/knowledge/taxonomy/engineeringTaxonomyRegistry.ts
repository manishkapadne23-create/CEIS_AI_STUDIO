import {
  getCapabilityRegistry,
} from "../capabilities/capabilityRegistry";
import { getCalculatorRegistry } from "../calculators/calculatorRegistry";
import { getStandardsRegistry } from "../standards/standardsRegistry";
import { getProfessionalToolsRegistry } from "../professional-tools/professionalToolsRegistry";
import type { EngineeringCalculatorRegistry } from "../types/EngineeringCalculator";
import type { EngineeringCapabilityRegistry } from "../types/EngineeringCapability";
import type { EngineeringProfessionalToolsRegistry } from "../types/EngineeringProfessionalTool";
import { getWorkflowRegistry } from "../workflows/workflowRegistry";
import type { EngineeringStandardsRegistry } from "../types/EngineeringStandard";
import type { EngineeringWorkflowRegistry } from "../types/EngineeringWorkflow";
import type { DisciplineDefinition } from "../data/disciplineManifest";
import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import {
  disciplineKnowledgeSchemaMap,
  disciplineKnowledgeSchemas,
} from "../data/schemas/disciplineSchemaRegistry";
import {
  getKnowledgeModule,
  knowledgeModuleRegistry,
} from "../data/registry";
import { createDisciplinePlaceholderSchema } from "../utils/createDisciplinePlaceholderSchema";
import type { EngineeringDisciplineKnowledgeSchema } from "../types/EngineeringKnowledgeSchema";
import type { KnowledgeModule } from "../types";

export interface EngineeringTaxonomyEntry {
  disciplineId: string;
  disciplineName: string;
  knowledgeSchema: EngineeringDisciplineKnowledgeSchema;
  knowledgeModule: KnowledgeModule;
  capabilityRegistry: EngineeringCapabilityRegistry;
  professionalToolsRegistry: EngineeringProfessionalToolsRegistry;
  calculatorRegistry: EngineeringCalculatorRegistry;
  standardsRegistry: EngineeringStandardsRegistry;
  workflowRegistry: EngineeringWorkflowRegistry;
}

export interface EngineeringTaxonomyRegistry {
  entries: EngineeringTaxonomyEntry[];
  getEntry: (disciplineId: string) => EngineeringTaxonomyEntry | undefined;
  listDisciplines: () => DisciplineDefinition[];
  getSchema: (
    disciplineId: string
  ) => EngineeringDisciplineKnowledgeSchema | undefined;
  getModule: (disciplineId: string) => KnowledgeModule | undefined;
  getCapabilityRegistry: (
    disciplineId: string
  ) => EngineeringCapabilityRegistry | undefined;
  getProfessionalToolsRegistry: (
    disciplineId: string
  ) => EngineeringProfessionalToolsRegistry | undefined;
  getCalculatorRegistry: (
    disciplineId: string
  ) => EngineeringCalculatorRegistry | undefined;
  getStandardsRegistry: (
    disciplineId: string
  ) => EngineeringStandardsRegistry | undefined;
  getWorkflowRegistry: (
    disciplineId: string
  ) => EngineeringWorkflowRegistry | undefined;
}

const taxonomyEntries: EngineeringTaxonomyEntry[] =
  DISCIPLINE_DEFINITIONS.map((discipline) => {
    const knowledgeSchema =
      disciplineKnowledgeSchemaMap[discipline.id] ??
      createDisciplinePlaceholderSchema(discipline.id);
    const knowledgeModule = getKnowledgeModule(discipline.id);
    const capabilityRegistry = getCapabilityRegistry(discipline.id);
    const professionalToolsRegistry = getProfessionalToolsRegistry(discipline.id);
    const calculatorRegistry = getCalculatorRegistry(discipline.id);
    const standardsRegistry = getStandardsRegistry(discipline.id);
    const workflowRegistry = getWorkflowRegistry(discipline.id);

    if (!knowledgeModule) {
      throw new Error(
        `Missing knowledge module for discipline: ${discipline.id}`
      );
    }

    return {
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      knowledgeSchema,
      knowledgeModule,
      capabilityRegistry: capabilityRegistry!,
      professionalToolsRegistry: professionalToolsRegistry!,
      calculatorRegistry: calculatorRegistry!,
      standardsRegistry: standardsRegistry!,
      workflowRegistry: workflowRegistry!,
    };
  });

const taxonomyEntryMap = taxonomyEntries.reduce<
  Record<string, EngineeringTaxonomyEntry>
>((accumulator, entry) => {
  accumulator[entry.disciplineId] = entry;
  return accumulator;
}, {});

export const engineeringTaxonomyRegistry: EngineeringTaxonomyRegistry =
  {
    entries: taxonomyEntries,
    getEntry(disciplineId: string) {
      return taxonomyEntryMap[disciplineId];
    },
    listDisciplines() {
      return DISCIPLINE_DEFINITIONS;
    },
    getSchema(disciplineId: string) {
      return disciplineKnowledgeSchemaMap[disciplineId];
    },
    getModule(disciplineId: string) {
      return knowledgeModuleRegistry.getModule(disciplineId);
    },
    getCapabilityRegistry(disciplineId: string) {
      return getCapabilityRegistry(disciplineId);
    },
    getProfessionalToolsRegistry(disciplineId: string) {
      return getProfessionalToolsRegistry(disciplineId);
    },
    getCalculatorRegistry(disciplineId: string) {
      return getCalculatorRegistry(disciplineId);
    },
    getStandardsRegistry(disciplineId: string) {
      return getStandardsRegistry(disciplineId);
    },
    getWorkflowRegistry(disciplineId: string) {
      return getWorkflowRegistry(disciplineId);
    },
  };

export const globalEngineeringTaxonomy = {
  disciplines: DISCIPLINE_DEFINITIONS,
  schemas: disciplineKnowledgeSchemas,
  registry: engineeringTaxonomyRegistry,
};
