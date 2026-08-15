import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const architectureCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "architecture-planning",
  "Architecture & Planning",
  [
    {
      name: "Building Area",
      category: "Space Planning",
      description:
        "Floor area ratio, built-up area, and carpet area calculations.",
      isPopular: true,
    },
    {
      name: "Parking Design",
      category: "Site Planning",
      description:
        "Parking bay count and layout based on built-up area and occupancy.",
      isPopular: true,
    },
    {
      name: "Daylight Factor",
      category: "Environmental Design",
      description:
        "Natural daylight factor and glazing area for building design.",
    },
    {
      name: "Stair Design",
      category: "Building Code",
      description:
        "Stair riser, tread, and width per NBC and accessibility requirements.",
    },
    {
      name: "HVAC Load",
      category: "MEP",
      description:
        "Cooling and heating load estimation for building HVAC systems.",
    },
  ]
);
