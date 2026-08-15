export type EngineeringCalculatorStatus = "available" | "beta" | "coming-soon";

export interface EngineeringCalculatorMetadata {
  id: string;
  disciplineId: string;
  disciplineName: string;
  name: string;
  description: string;
  category: string;
  status: EngineeringCalculatorStatus;
  isPopular?: boolean;
}

export interface DisciplineCalculatorsCatalog {
  disciplineId: string;
  disciplineName: string;
  calculators: EngineeringCalculatorMetadata[];
}

export type CalculatorsFilterId =
  | "all"
  | "popular"
  | "recently-used"
  | "favourite";
