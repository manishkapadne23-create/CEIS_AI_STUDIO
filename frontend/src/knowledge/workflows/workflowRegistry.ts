import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import { createPlaceholderWorkflowRegistry } from "../utils/createPlaceholderWorkflowRegistry";
import { civilEngineeringWorkflowRegistry } from "./civil";
import { mechanicalEngineeringWorkflowRegistry } from "./mechanical";
import { electricalEngineeringWorkflowRegistry } from "./electrical";
import { computerEngineeringWorkflowRegistry } from "./computer";
import { electronicsTelecommunicationEngineeringWorkflowRegistry } from "./electronics-telecommunication";
import { chemicalEngineeringWorkflowRegistry } from "./chemical";
import { environmentalEngineeringWorkflowRegistry } from "./environmental";
import { miningEngineeringWorkflowRegistry } from "./mining";
import { marineEngineeringWorkflowRegistry } from "./marine";
import { aerospaceEngineeringWorkflowRegistry } from "./aerospace";
import { railwayEngineeringWorkflowRegistry } from "./railway";
import type {
  EngineeringWorkflowRegistry,
  EngineeringWorkflowRegistryMap,
} from "../types/EngineeringWorkflow";

export const disciplineWorkflowRegistries: EngineeringWorkflowRegistry[] =
  [
    civilEngineeringWorkflowRegistry,
    mechanicalEngineeringWorkflowRegistry,
    electricalEngineeringWorkflowRegistry,
    computerEngineeringWorkflowRegistry,
    electronicsTelecommunicationEngineeringWorkflowRegistry,
    chemicalEngineeringWorkflowRegistry,
    environmentalEngineeringWorkflowRegistry,
    miningEngineeringWorkflowRegistry,
    marineEngineeringWorkflowRegistry,
    aerospaceEngineeringWorkflowRegistry,
    railwayEngineeringWorkflowRegistry,
  ];

const workflowRegistryMap =
  disciplineWorkflowRegistries.reduce<
    Record<string, EngineeringWorkflowRegistry>
  >((accumulator, registry) => {
    accumulator[registry.disciplineId] = registry;
    return accumulator;
  }, {});

export const engineeringWorkflowRegistry: EngineeringWorkflowRegistryMap =
  {
    registries: workflowRegistryMap,
    getRegistry(disciplineId: string) {
      return workflowRegistryMap[disciplineId];
    },
    listRegistries() {
      return disciplineWorkflowRegistries;
    },
  };

export const getWorkflowRegistry = (
  disciplineId: string
): EngineeringWorkflowRegistry | undefined => {
  const existing = engineeringWorkflowRegistry.getRegistry(disciplineId);
  if (existing) return existing;

  if (DISCIPLINE_DEFINITIONS.some((discipline) => discipline.id === disciplineId)) {
    return createPlaceholderWorkflowRegistry(disciplineId);
  }

  return undefined;
};
