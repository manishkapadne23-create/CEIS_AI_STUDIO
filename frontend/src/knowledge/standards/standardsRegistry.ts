import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import { createPlaceholderStandardsRegistry } from "../utils/createPlaceholderStandardsRegistry";
import { civilEngineeringStandardsRegistry } from "./civil";
import { mechanicalEngineeringStandardsRegistry } from "./mechanical";
import { electricalEngineeringStandardsRegistry } from "./electrical";
import { computerEngineeringStandardsRegistry } from "./computer";
import { electronicsTelecommunicationEngineeringStandardsRegistry } from "./electronics-telecommunication";
import { chemicalEngineeringStandardsRegistry } from "./chemical";
import { environmentalEngineeringStandardsRegistry } from "./environmental";
import { miningEngineeringStandardsRegistry } from "./mining";
import { marineEngineeringStandardsRegistry } from "./marine";
import { aerospaceEngineeringStandardsRegistry } from "./aerospace";
import { railwayEngineeringStandardsRegistry } from "./railway";
import type {
  EngineeringStandardsRegistry,
  EngineeringStandardsRegistryMap,
} from "../types/EngineeringStandard";

export const disciplineStandardsRegistries: EngineeringStandardsRegistry[] =
  [
    civilEngineeringStandardsRegistry,
    mechanicalEngineeringStandardsRegistry,
    electricalEngineeringStandardsRegistry,
    computerEngineeringStandardsRegistry,
    electronicsTelecommunicationEngineeringStandardsRegistry,
    chemicalEngineeringStandardsRegistry,
    environmentalEngineeringStandardsRegistry,
    miningEngineeringStandardsRegistry,
    marineEngineeringStandardsRegistry,
    aerospaceEngineeringStandardsRegistry,
    railwayEngineeringStandardsRegistry,
  ];

const standardsRegistryMap =
  disciplineStandardsRegistries.reduce<
    Record<string, EngineeringStandardsRegistry>
  >((accumulator, registry) => {
    accumulator[registry.disciplineId] = registry;
    return accumulator;
  }, {});

export const engineeringStandardsRegistry: EngineeringStandardsRegistryMap =
  {
    registries: standardsRegistryMap,
    getRegistry(disciplineId: string) {
      return standardsRegistryMap[disciplineId];
    },
    listRegistries() {
      return disciplineStandardsRegistries;
    },
  };

export const getStandardsRegistry = (
  disciplineId: string
): EngineeringStandardsRegistry | undefined => {
  const existing = engineeringStandardsRegistry.getRegistry(disciplineId);
  if (existing) return existing;

  if (DISCIPLINE_DEFINITIONS.some((discipline) => discipline.id === disciplineId)) {
    return createPlaceholderStandardsRegistry(disciplineId);
  }

  return undefined;
};
