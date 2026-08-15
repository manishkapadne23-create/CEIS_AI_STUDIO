import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const miningCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "mining-engineering",
  "Mining Engineering",
  [
    {
      name: "Blast Design",
      category: "Explosives",
      description:
        "Blast pattern, charge weight, and fragmentation for open-pit mining.",
      isPopular: true,
    },
    {
      name: "Ore Volume",
      category: "Mine Planning",
      description:
        "Ore body volume and tonnage estimation from geological models.",
      isPopular: true,
    },
    {
      name: "Production Rate",
      category: "Mine Operations",
      description:
        "Mine production rate and equipment fleet productivity calculations.",
      isPopular: true,
    },
    {
      name: "Slope Stability",
      category: "Geotechnical",
      description:
        "Factor of safety for open-pit slope and waste dump stability.",
    },
  ]
);
