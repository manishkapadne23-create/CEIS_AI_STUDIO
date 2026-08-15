import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const aerospaceCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "aerospace-engineering",
  "Aerospace Engineering",
  [
    {
      name: "Lift",
      category: "Aerodynamics",
      description:
        "Lift force and coefficient calculations for wing and airfoil design.",
      isPopular: true,
    },
    {
      name: "Drag",
      category: "Aerodynamics",
      description:
        "Drag force and coefficient for aircraft and component aerodynamics.",
      isPopular: true,
    },
    {
      name: "Thrust",
      category: "Propulsion",
      description:
        "Engine thrust requirements for takeoff, climb, and cruise phases.",
      isPopular: true,
    },
    {
      name: "Wing Loading",
      category: "Aircraft Design",
      description:
        "Wing area and loading for aircraft performance and stall speed.",
    },
  ]
);
