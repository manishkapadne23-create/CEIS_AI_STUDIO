import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import type {
  EngineeringCalculator,
  EngineeringCalculatorRegistry,
} from "../types/EngineeringCalculator";
import { ENGINEERING_CALCULATOR_CATEGORY_KEYS } from "../types/EngineeringCalculator";
import { buildCalculatorRegistry } from "./buildCalculatorRegistry";

export const createPlaceholderCalculatorRegistry = (
  disciplineId: string
): EngineeringCalculatorRegistry => {
  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  if (!discipline) {
    throw new Error(`Unknown engineering discipline: ${disciplineId}`);
  }

  const placeholderCalculator: EngineeringCalculator = {
    id: `${disciplineId}-calculators-catalog`,
    key: "calculators-catalog",
    title: "Calculator Catalog",
    description: `Engineering calculators for ${discipline.name} are planned and will be added to this registry.`,
    category: ENGINEERING_CALCULATOR_CATEGORY_KEYS.general,
    status: "coming-soon",
    enabled: false,
    disciplineId: discipline.id,
    pluginId: `ceis.calculator.${discipline.id}.catalog`,
    standards: [],
    inputs: [],
    outputs: [],
  };

  return buildCalculatorRegistry(discipline.id, discipline.name, [
    placeholderCalculator,
  ]);
};
