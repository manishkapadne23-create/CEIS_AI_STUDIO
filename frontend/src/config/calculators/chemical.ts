import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const chemicalCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "chemical-engineering",
  "Chemical Engineering",
  [
    {
      name: "Reactor Volume",
      category: "Reaction Engineering",
      description:
        "Batch and continuous reactor volume sizing for chemical processes.",
      isPopular: true,
    },
    {
      name: "Heat Exchanger",
      category: "Heat Transfer",
      description:
        "Shell-and-tube and plate heat exchanger duty and area estimation.",
      isPopular: true,
    },
    {
      name: "Pressure Drop",
      category: "Fluid Flow",
      description:
        "Pressure loss in pipes, fittings, and process equipment.",
      isPopular: true,
    },
    {
      name: "Pipe Flow",
      category: "Fluid Flow",
      description:
        "Process pipe flow rate and velocity for chemical plant piping.",
    },
    {
      name: "Tank Volume",
      category: "Process Equipment",
      description:
        "Storage tank capacity and fill level calculations for process vessels.",
    },
  ]
);
