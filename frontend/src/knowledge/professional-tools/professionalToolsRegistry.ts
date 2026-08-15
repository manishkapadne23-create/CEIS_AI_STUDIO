import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import { createPlaceholderProfessionalToolsRegistry } from "../utils/createPlaceholderProfessionalToolsRegistry";
import { civilEngineeringProfessionalToolsRegistry } from "./civil";
import { mechanicalEngineeringProfessionalToolsRegistry } from "./mechanical";
import { electricalEngineeringProfessionalToolsRegistry } from "./electrical";
import { computerEngineeringProfessionalToolsRegistry } from "./computer";
import { electronicsTelecommunicationEngineeringProfessionalToolsRegistry } from "./electronics-telecommunication";
import { chemicalEngineeringProfessionalToolsRegistry } from "./chemical";
import { environmentalEngineeringProfessionalToolsRegistry } from "./environmental";
import { miningEngineeringProfessionalToolsRegistry } from "./mining";
import { marineEngineeringProfessionalToolsRegistry } from "./marine";
import { aerospaceEngineeringProfessionalToolsRegistry } from "./aerospace";
import { railwayEngineeringProfessionalToolsRegistry } from "./railway";
import type {
  EngineeringProfessionalToolsRegistry,
  EngineeringProfessionalToolsRegistryMap,
} from "../types/EngineeringProfessionalTool";

export const disciplineProfessionalToolsRegistries: EngineeringProfessionalToolsRegistry[] =
  [
    civilEngineeringProfessionalToolsRegistry,
    mechanicalEngineeringProfessionalToolsRegistry,
    electricalEngineeringProfessionalToolsRegistry,
    computerEngineeringProfessionalToolsRegistry,
    electronicsTelecommunicationEngineeringProfessionalToolsRegistry,
    chemicalEngineeringProfessionalToolsRegistry,
    environmentalEngineeringProfessionalToolsRegistry,
    miningEngineeringProfessionalToolsRegistry,
    marineEngineeringProfessionalToolsRegistry,
    aerospaceEngineeringProfessionalToolsRegistry,
    railwayEngineeringProfessionalToolsRegistry,
  ];

const professionalToolsRegistryMap =
  disciplineProfessionalToolsRegistries.reduce<
    Record<string, EngineeringProfessionalToolsRegistry>
  >((accumulator, registry) => {
    accumulator[registry.disciplineId] = registry;
    return accumulator;
  }, {});

export const engineeringProfessionalToolsRegistry: EngineeringProfessionalToolsRegistryMap =
  {
    registries: professionalToolsRegistryMap,
    getRegistry(disciplineId: string) {
      return professionalToolsRegistryMap[disciplineId];
    },
    listRegistries() {
      return disciplineProfessionalToolsRegistries;
    },
  };

export const getProfessionalToolsRegistry = (
  disciplineId: string
): EngineeringProfessionalToolsRegistry | undefined => {
  const existing = engineeringProfessionalToolsRegistry.getRegistry(disciplineId);
  if (existing) return existing;

  if (DISCIPLINE_DEFINITIONS.some((discipline) => discipline.id === disciplineId)) {
    return createPlaceholderProfessionalToolsRegistry(disciplineId);
  }

  return undefined;
};
