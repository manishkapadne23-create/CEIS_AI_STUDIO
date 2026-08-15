import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import { createPlaceholderCapabilityRegistry } from "../utils/createPlaceholderCapabilityRegistry";
import { civilEngineeringCapabilityRegistry } from "./civil";import { mechanicalEngineeringCapabilityRegistry } from "./mechanical";
import { electricalEngineeringCapabilityRegistry } from "./electrical";
import { computerEngineeringCapabilityRegistry } from "./computer";
import { electronicsTelecommunicationEngineeringCapabilityRegistry } from "./electronics-telecommunication";
import { chemicalEngineeringCapabilityRegistry } from "./chemical";
import { environmentalEngineeringCapabilityRegistry } from "./environmental";
import { miningEngineeringCapabilityRegistry } from "./mining";
import { marineEngineeringCapabilityRegistry } from "./marine";
import { aerospaceEngineeringCapabilityRegistry } from "./aerospace";
import { railwayEngineeringCapabilityRegistry } from "./railway";
import type {
  EngineeringCapabilityRegistry,
  EngineeringCapabilityRegistryMap,
} from "../types/EngineeringCapability";

export const disciplineCapabilityRegistries: EngineeringCapabilityRegistry[] =
  [
    civilEngineeringCapabilityRegistry,
    mechanicalEngineeringCapabilityRegistry,
    electricalEngineeringCapabilityRegistry,
    computerEngineeringCapabilityRegistry,
    electronicsTelecommunicationEngineeringCapabilityRegistry,
    chemicalEngineeringCapabilityRegistry,
    environmentalEngineeringCapabilityRegistry,
    miningEngineeringCapabilityRegistry,
    marineEngineeringCapabilityRegistry,
    aerospaceEngineeringCapabilityRegistry,
    railwayEngineeringCapabilityRegistry,
  ];

const capabilityRegistryMap =
  disciplineCapabilityRegistries.reduce<
    Record<string, EngineeringCapabilityRegistry>
  >((accumulator, registry) => {
    accumulator[registry.disciplineId] = registry;
    return accumulator;
  }, {});

export const engineeringCapabilityRegistry: EngineeringCapabilityRegistryMap =
  {
    registries: capabilityRegistryMap,
    getRegistry(disciplineId: string) {
      return capabilityRegistryMap[disciplineId];
    },
    listRegistries() {
      return disciplineCapabilityRegistries;
    },
  };

export const getCapabilityRegistry = (
  disciplineId: string
): EngineeringCapabilityRegistry | undefined => {
  const existing = engineeringCapabilityRegistry.getRegistry(disciplineId);
  if (existing) return existing;

  if (DISCIPLINE_DEFINITIONS.some((discipline) => discipline.id === disciplineId)) {
    return createPlaceholderCapabilityRegistry(disciplineId);
  }

  return undefined;
};
