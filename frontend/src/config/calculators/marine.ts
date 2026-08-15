import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const marineCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "marine-engineering",
  "Marine Engineering",
  [
    {
      name: "Buoyancy",
      category: "Naval Architecture",
      description:
        "Displacement, buoyant force, and draft calculations for vessels.",
      isPopular: true,
    },
    {
      name: "Ship Stability",
      category: "Naval Architecture",
      description:
        "GM, righting moment, and stability criteria for ship design.",
      isPopular: true,
    },
    {
      name: "Fuel Consumption",
      category: "Propulsion",
      description:
        "Specific fuel oil consumption and voyage fuel requirements.",
      isPopular: true,
    },
  ]
);
