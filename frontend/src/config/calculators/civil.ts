import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const civilCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "civil-engineering",
  "Civil Engineering",
  [
    {
      name: "Pavement Design",
      category: "Pavement",
      description:
        "Flexible and rigid pavement thickness design for highways and urban roads.",
      isPopular: true,
    },
    {
      name: "Superelevation",
      category: "Geometric Design",
      description:
        "Superelevation rate and transition length for horizontal curves.",
      isPopular: true,
    },
    {
      name: "Sight Distance",
      category: "Geometric Design",
      description:
        "Stopping, passing, and decision sight distance for roadway alignment.",
      isPopular: true,
    },
    {
      name: "Earthwork Volume",
      category: "Earthwork",
      description:
        "Cut and fill volume estimation for grading and embankment works.",
      isPopular: true,
    },
    {
      name: "Transition Curve",
      category: "Geometric Design",
      description:
        "Spiral and transition curve parameters for highway alignment design.",
    },
    {
      name: "Curve Geometry",
      category: "Geometric Design",
      description:
        "Horizontal and vertical curve geometry for road and rail alignments.",
    },
    {
      name: "Culvert Hydraulics",
      category: "Hydraulic",
      description:
        "Culvert sizing and hydraulic capacity for drainage structures.",
    },
    {
      name: "Pipe Flow",
      category: "Hydraulic",
      description:
        "Gravity and pressure pipe flow calculations for water supply and drainage.",
    },
    {
      name: "Concrete Mix",
      category: "Structural",
      description:
        "Concrete mix proportioning and material quantity estimation.",
    },
    {
      name: "Steel Quantity",
      category: "Structural",
      description:
        "Reinforcement steel quantity estimation for RCC structural members.",
    },
  ]
);
