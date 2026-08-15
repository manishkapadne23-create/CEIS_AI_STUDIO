import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const renewableCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "renewable-energy",
  "Renewable Energy",
  [
    {
      name: "Solar PV",
      category: "Solar Energy",
      description:
        "PV array sizing, energy yield, and inverter capacity for solar plants.",
      isPopular: true,
    },
    {
      name: "Battery Bank",
      category: "Energy Storage",
      description:
        "Battery bank capacity and autonomy for off-grid and hybrid systems.",
      isPopular: true,
    },
    {
      name: "Wind Turbine Output",
      category: "Wind Energy",
      description:
        "Wind turbine power output based on wind speed and rotor characteristics.",
      isPopular: true,
    },
  ]
);
