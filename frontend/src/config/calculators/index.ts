import { agriculturalCalculatorsCatalog } from "./agricultural";
import { aerospaceCalculatorsCatalog } from "./aerospace";
import { architectureCalculatorsCatalog } from "./architecture";
import { automationCalculatorsCatalog } from "./automation";
import { biomedicalCalculatorsCatalog } from "./biomedical";
import { chemicalCalculatorsCatalog } from "./chemical";
import { civilCalculatorsCatalog } from "./civil";
import { computerCalculatorsCatalog } from "./computer";
import { electricalCalculatorsCatalog } from "./electrical";
import { electronicsCalculatorsCatalog } from "./electronics";
import { environmentalCalculatorsCatalog } from "./environmental";
import { industrialCalculatorsCatalog } from "./industrial";
import { marineCalculatorsCatalog } from "./marine";
import { mechanicalCalculatorsCatalog } from "./mechanical";
import { miningCalculatorsCatalog } from "./mining";
import { oilGasCalculatorsCatalog } from "./oilgas";
import { railwayCalculatorsCatalog } from "./railway";
import { renewableCalculatorsCatalog } from "./renewable";
import type {
  CalculatorsFilterId,
  DisciplineCalculatorsCatalog,
  EngineeringCalculatorMetadata,
} from "./types";

export const DISCIPLINE_CALCULATORS_CATALOGS: DisciplineCalculatorsCatalog[] = [
  civilCalculatorsCatalog,
  mechanicalCalculatorsCatalog,
  electricalCalculatorsCatalog,
  computerCalculatorsCatalog,
  electronicsCalculatorsCatalog,
  chemicalCalculatorsCatalog,
  environmentalCalculatorsCatalog,
  miningCalculatorsCatalog,
  marineCalculatorsCatalog,
  railwayCalculatorsCatalog,
  aerospaceCalculatorsCatalog,
  architectureCalculatorsCatalog,
  renewableCalculatorsCatalog,
  oilGasCalculatorsCatalog,
  biomedicalCalculatorsCatalog,
  automationCalculatorsCatalog,
  industrialCalculatorsCatalog,
  agriculturalCalculatorsCatalog,
];

const catalogByDisciplineId = new Map(
  DISCIPLINE_CALCULATORS_CATALOGS.map((catalog) => [
    catalog.disciplineId,
    catalog,
  ])
);

export const getCalculatorsCatalogByDisciplineId = (
  disciplineId: string | null | undefined
): DisciplineCalculatorsCatalog | null =>
  disciplineId ? catalogByDisciplineId.get(disciplineId) ?? null : null;

export const searchCalculatorsMetadata = (
  calculators: EngineeringCalculatorMetadata[],
  query: string,
  disciplineName?: string | null
): EngineeringCalculatorMetadata[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return calculators;
  }

  return calculators.filter((calculator) => {
    const haystack = [
      calculator.name,
      calculator.description,
      calculator.category,
      calculator.disciplineName,
      disciplineName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};

export const filterCalculatorsByTab = (
  calculators: EngineeringCalculatorMetadata[],
  filter: CalculatorsFilterId,
  recentIds: string[],
  favouriteIds: string[]
): EngineeringCalculatorMetadata[] => {
  switch (filter) {
    case "popular":
      return calculators.filter((calculator) => calculator.isPopular);
    case "recently-used":
      return recentIds
        .map((id) => calculators.find((calculator) => calculator.id === id))
        .filter((calculator): calculator is EngineeringCalculatorMetadata =>
          Boolean(calculator)
        );
    case "favourite":
      return favouriteIds
        .map((id) => calculators.find((calculator) => calculator.id === id))
        .filter((calculator): calculator is EngineeringCalculatorMetadata =>
          Boolean(calculator)
        );
    default:
      return calculators;
  }
};

export type {
  CalculatorsFilterId,
  DisciplineCalculatorsCatalog,
  EngineeringCalculatorMetadata,
  EngineeringCalculatorStatus,
} from "./types";
