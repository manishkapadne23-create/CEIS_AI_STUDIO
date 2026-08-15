import type { EngineeringDisciplineKnowledgeSchema } from "../../../types/EngineeringKnowledgeSchema";
import { createPlaceholderSpecialization } from "../../../utils/createPlaceholderSpecialization";
import { highwayEngineeringSchema } from "./highwayEngineering.schema";

export { highwayEngineeringSchema } from "./highwayEngineering.schema";

const bridgeEngineeringSchema = createPlaceholderSpecialization({
  id: "bridge-engineering",
  title: "Bridge Engineering",
  disciplineId: "civil-engineering",
  overview:
    "Structural design, load analysis, and construction planning for bridges across highway and railway networks.",
  designStandards: ["IRC:6", "IRC:21", "IRC:112", "IS:456", "IS:800"],
  designSoftware: ["STAAD.Pro", "MIDAS Civil", "SAP2000", "Tekla"],
  aiEngineeringAgents: [
    "Bridge Load Analysis Agent",
    "Foundation Design Agent",
  ],
});

const transportationEngineeringSchema =
  createPlaceholderSpecialization({
    id: "transportation-engineering",
    title: "Transportation Engineering",
    disciplineId: "civil-engineering",
    overview:
      "Integrated planning and design of transportation systems including highways, railways, airports, and traffic networks.",
    designStandards: [
      "IRC",
      "MORTH",
      "Indian Railways Standards",
      "FAA",
    ],
    designSoftware: [
      "VISSIM",
      "PTV Vistro",
      "Civil 3D",
      "OpenRoads",
    ],
    aiEngineeringAgents: [
      "Transport Planning Agent",
      "Traffic Simulation Agent",
    ],
  });

export const civilEngineeringKnowledgeSchema: EngineeringDisciplineKnowledgeSchema =
  {
    disciplineId: "civil-engineering",
    disciplineName: "Civil Engineering",
    specializations: {
      [highwayEngineeringSchema.title]: highwayEngineeringSchema,
      [bridgeEngineeringSchema.title]: bridgeEngineeringSchema,
      [transportationEngineeringSchema.title]:
        transportationEngineeringSchema,
    },
  };
