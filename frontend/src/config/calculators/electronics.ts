import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const electronicsCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "electronics-telecommunication-engineering",
  "Electronics & Telecommunication Engineering",
  [
    {
      name: "Ohm's Law",
      category: "Circuit Analysis",
      description:
        "Voltage, current, and resistance relationships in DC circuits.",
      isPopular: true,
    },
    {
      name: "Filter Design",
      category: "Signal Processing",
      description:
        "Low-pass, high-pass, and band-pass filter component selection.",
      isPopular: true,
    },
    {
      name: "PCB Track Width",
      category: "PCB Design",
      description:
        "Copper trace width for current capacity and thermal management.",
      isPopular: true,
    },
    {
      name: "Voltage Divider",
      category: "Circuit Analysis",
      description:
        "Resistor divider output voltage and power dissipation calculations.",
    },
    {
      name: "Amplifier Gain",
      category: "Analog Electronics",
      description:
        "Voltage and power gain for operational amplifier circuits.",
    },
  ]
);
