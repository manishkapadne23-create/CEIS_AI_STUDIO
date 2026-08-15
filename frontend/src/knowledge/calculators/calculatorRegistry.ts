import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import { createPlaceholderCalculatorRegistry } from "../utils/createPlaceholderCalculatorRegistry";
import { civilEngineeringCalculatorRegistry } from "./civil";
import { mechanicalEngineeringCalculatorRegistry } from "./mechanical";
import { electricalEngineeringCalculatorRegistry } from "./electrical";
import { computerEngineeringCalculatorRegistry } from "./computer";
import { electronicsTelecommunicationEngineeringCalculatorRegistry } from "./electronics-telecommunication";
import { chemicalEngineeringCalculatorRegistry } from "./chemical";
import { environmentalEngineeringCalculatorRegistry } from "./environmental";
import { miningEngineeringCalculatorRegistry } from "./mining";
import { marineEngineeringCalculatorRegistry } from "./marine";
import { aerospaceEngineeringCalculatorRegistry } from "./aerospace";
import { railwayEngineeringCalculatorRegistry } from "./railway";
import type {
  EngineeringCalculatorRegistry,
  EngineeringCalculatorRegistryMap,
} from "../types/EngineeringCalculator";

export const disciplineCalculatorRegistries: EngineeringCalculatorRegistry[] =
  [
    civilEngineeringCalculatorRegistry,
    mechanicalEngineeringCalculatorRegistry,
    electricalEngineeringCalculatorRegistry,
    computerEngineeringCalculatorRegistry,
    electronicsTelecommunicationEngineeringCalculatorRegistry,
    chemicalEngineeringCalculatorRegistry,
    environmentalEngineeringCalculatorRegistry,
    miningEngineeringCalculatorRegistry,
    marineEngineeringCalculatorRegistry,
    aerospaceEngineeringCalculatorRegistry,
    railwayEngineeringCalculatorRegistry,
  ];

const calculatorRegistryMap =
  disciplineCalculatorRegistries.reduce<
    Record<string, EngineeringCalculatorRegistry>
  >((accumulator, registry) => {
    accumulator[registry.disciplineId] = registry;
    return accumulator;
  }, {});

export const engineeringCalculatorRegistry: EngineeringCalculatorRegistryMap =
  {
    registries: calculatorRegistryMap,
    getRegistry(disciplineId: string) {
      return calculatorRegistryMap[disciplineId];
    },
    listRegistries() {
      return disciplineCalculatorRegistries;
    },
  };

export const getCalculatorRegistry = (
  disciplineId: string
): EngineeringCalculatorRegistry | undefined => {
  const existing = engineeringCalculatorRegistry.getRegistry(disciplineId);
  if (existing) return existing;

  if (DISCIPLINE_DEFINITIONS.some((discipline) => discipline.id === disciplineId)) {
    return createPlaceholderCalculatorRegistry(disciplineId);
  }

  return undefined;
};
