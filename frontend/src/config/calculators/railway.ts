import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const railwayCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "railway-engineering",
  "Railway Engineering",
  [
    {
      name: "Cant Calculation",
      category: "Track Geometry",
      description:
        "Cant and cant deficiency for curved railway track sections.",
      isPopular: true,
    },
    {
      name: "Track Geometry",
      category: "Track Geometry",
      description:
        "Alignment, gauge, and vertical profile parameters for railway track.",
      isPopular: true,
    },
    {
      name: "Curve Design",
      category: "Track Geometry",
      description:
        "Horizontal curve radius and transition design for railway alignments.",
      isPopular: true,
    },
  ]
);
