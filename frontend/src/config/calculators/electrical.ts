import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const electricalCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "electrical-engineering",
  "Electrical Engineering",
  [
    {
      name: "Voltage Drop",
      category: "Power Distribution",
      description:
        "Conductor voltage drop for low and medium voltage distribution circuits.",
      isPopular: true,
    },
    {
      name: "Cable Size",
      category: "Power Distribution",
      description:
        "Cable current-carrying capacity and sizing for electrical installations.",
      isPopular: true,
    },
    {
      name: "Transformer Rating",
      category: "Power Systems",
      description:
        "Transformer kVA rating based on connected load and diversity factors.",
      isPopular: true,
    },
    {
      name: "Motor Power",
      category: "Drives & Motors",
      description:
        "Motor power, efficiency, and load calculations for industrial drives.",
      isPopular: true,
    },
    {
      name: "Short Circuit",
      category: "Protection",
      description:
        "Prospective short circuit current for protection device coordination.",
    },
    {
      name: "Earthing",
      category: "Protection",
      description:
        "Earth electrode resistance and earthing conductor sizing.",
    },
    {
      name: "Lighting",
      category: "Illumination",
      description:
        "Illuminance levels and luminaire layout for interior and exterior lighting.",
    },
    {
      name: "Battery Backup",
      category: "Power Systems",
      description:
        "Battery bank capacity and backup duration for UPS and solar systems.",
    },
  ]
);
