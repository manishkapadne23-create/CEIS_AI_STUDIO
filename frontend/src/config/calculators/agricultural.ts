import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const agriculturalCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "agricultural-engineering",
  "Agricultural Engineering",
  [
    {
      name: "Irrigation Water",
      category: "Irrigation",
      description:
        "Crop water requirement and irrigation scheduling for farm planning.",
      isPopular: true,
    },
    {
      name: "Crop Yield",
      category: "Crop Science",
      description:
        "Expected crop yield based on area, variety, and agronomic factors.",
      isPopular: true,
    },
    {
      name: "Greenhouse Climate",
      category: "Protected Cultivation",
      description:
        "Ventilation, heating, and humidity control for greenhouse design.",
    },
    {
      name: "Feed Ration",
      category: "Animal Husbandry",
      description:
        "Livestock feed formulation and nutrient balance calculations.",
    },
    {
      name: "Soil Moisture",
      category: "Soil & Water",
      description:
        "Soil moisture content and irrigation depth for field crops.",
    },
  ]
);
