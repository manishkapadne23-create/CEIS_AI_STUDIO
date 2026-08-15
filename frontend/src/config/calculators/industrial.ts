import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const industrialCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "industrial-engineering",
  "Industrial Engineering",
  [
    {
      name: "OEE",
      category: "Manufacturing",
      description:
        "Overall Equipment Effectiveness from availability, performance, and quality.",
      isPopular: true,
    },
    {
      name: "Takt Time",
      category: "Lean Manufacturing",
      description:
        "Takt time and line balancing for production flow optimization.",
      isPopular: true,
    },
    {
      name: "Production Capacity",
      category: "Manufacturing",
      description:
        "Production line capacity and throughput based on cycle time and shifts.",
      isPopular: true,
    },
    {
      name: "Inventory Turnover",
      category: "Supply Chain",
      description:
        "Inventory turnover ratio and days of supply for supply chain analysis.",
    },
  ]
);
