import { knowledgePanelLabels } from "./knowledgePanelLabels";
import { highwayEngineeringSchema } from "../schemas/civil/highwayEngineering.schema";
import { toKnowledgeModuleContent } from "../../utils/toKnowledgeModuleContent";

export const highwayEngineeringKnowledge = toKnowledgeModuleContent(
  highwayEngineeringSchema,
  knowledgePanelLabels.badge
);
