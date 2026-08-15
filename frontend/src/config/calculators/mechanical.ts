import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const mechanicalCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "mechanical-engineering",
  "Mechanical Engineering",
  [
    {
      name: "Shaft Design",
      category: "Machine Design",
      description:
        "Shaft diameter and stress checks for power transmission systems.",
      isPopular: true,
    },
    {
      name: "Gear Design",
      category: "Machine Design",
      description:
        "Spur and helical gear sizing based on load, speed, and material.",
      isPopular: true,
    },
    {
      name: "Bearing Life",
      category: "Machine Design",
      description:
        "Rolling element bearing life (L10) estimation under applied loads.",
      isPopular: true,
    },
    {
      name: "Power & Torque",
      category: "Power Transmission",
      description:
        "Shaft power, torque, and speed relationships for rotating machinery.",
      isPopular: true,
    },
    {
      name: "Pump Selection",
      category: "Fluid Systems",
      description:
        "Pump head, flow rate, and NPSH requirements for fluid systems.",
    },
    {
      name: "Heat Transfer",
      category: "Thermal",
      description:
        "Conduction, convection, and radiation heat transfer estimations.",
    },
    {
      name: "Pressure Vessel",
      category: "Pressure Systems",
      description:
        "Shell thickness and design pressure for cylindrical pressure vessels.",
    },
    {
      name: "Belt Drive",
      category: "Power Transmission",
      description:
        "Belt tension, power capacity, and drive ratio for belt systems.",
    },
    {
      name: "Pipe Sizing",
      category: "Fluid Systems",
      description:
        "Pipe diameter selection based on flow rate and pressure drop.",
    },
  ]
);
