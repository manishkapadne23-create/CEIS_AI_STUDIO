import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const oilGasCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "oil-gas-engineering",
  "Oil & Gas Engineering",
  [
    {
      name: "Pipeline Flow",
      category: "Pipeline",
      description:
        "Liquid pipeline flow rate and pressure drop for oil transmission.",
      isPopular: true,
    },
    {
      name: "Gas Flow",
      category: "Pipeline",
      description:
        "Natural gas flow and compression requirements in pipeline networks.",
      isPopular: true,
    },
    {
      name: "Pressure Loss",
      category: "Process",
      description:
        "Pressure loss in piping, valves, and process equipment in oil & gas facilities.",
      isPopular: true,
    },
  ]
);
