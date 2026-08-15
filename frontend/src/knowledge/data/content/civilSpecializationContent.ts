import type { KnowledgeModuleContent } from "../../types";
import { civilEngineeringKnowledgeSchema } from "../schemas/civil";
import { knowledgePanelLabels } from "./knowledgePanelLabels";
import { toKnowledgeModuleContent } from "../../utils/toKnowledgeModuleContent";

export const civilSpecializationContent: Record<
  string,
  KnowledgeModuleContent
> = Object.fromEntries(
  Object.values(
    civilEngineeringKnowledgeSchema.specializations
  ).map((specialization) => [
    specialization.title,
    toKnowledgeModuleContent(
      specialization,
      knowledgePanelLabels.badge
    ),
  ])
);
