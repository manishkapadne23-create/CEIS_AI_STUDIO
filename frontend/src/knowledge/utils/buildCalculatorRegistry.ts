import type {
  EngineeringCalculator,
  EngineeringCalculatorCategoryGroup,
  EngineeringCalculatorCategoryKey,
  EngineeringCalculatorRegistry,
} from "../types/EngineeringCalculator";
import {
  ENGINEERING_CALCULATOR_CATEGORY_KEYS,
  ENGINEERING_CALCULATOR_CATEGORY_LABELS,
} from "../types/EngineeringCalculator";

const categoryOrder: EngineeringCalculatorCategoryKey[] = [
  ENGINEERING_CALCULATOR_CATEGORY_KEYS.pavement,
  ENGINEERING_CALCULATOR_CATEGORY_KEYS.geometric,
  ENGINEERING_CALCULATOR_CATEGORY_KEYS.earthwork,
  ENGINEERING_CALCULATOR_CATEGORY_KEYS.structural,
  ENGINEERING_CALCULATOR_CATEGORY_KEYS.hydraulic,
  ENGINEERING_CALCULATOR_CATEGORY_KEYS.general,
];

export const buildCalculatorRegistry = (
  disciplineId: string,
  disciplineName: string,
  calculators: EngineeringCalculator[]
): EngineeringCalculatorRegistry => {
  const categories: EngineeringCalculatorCategoryGroup[] =
    categoryOrder
      .map((categoryKey) => ({
        key: categoryKey,
        label: ENGINEERING_CALCULATOR_CATEGORY_LABELS[categoryKey],
        calculators: calculators.filter(
          (calculator) => calculator.category === categoryKey
        ),
      }))
      .filter((category) => category.calculators.length > 0);

  return {
    disciplineId,
    disciplineName,
    categories,
    calculators,
  };
};
