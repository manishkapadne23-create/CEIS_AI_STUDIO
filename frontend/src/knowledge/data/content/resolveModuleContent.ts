import type { KnowledgeModule, KnowledgeModuleContent } from "../../types";
import { getSpecializationKnowledge } from "../schemas";
import { knowledgePanelLabels } from "./knowledgePanelLabels";
import { toKnowledgeModuleContent } from "../../utils/toKnowledgeModuleContent";
import {
  ENGINEERING_KNOWLEDGE_SECTION_KEYS,
  ENGINEERING_KNOWLEDGE_SECTION_LABELS,
} from "../../types/EngineeringKnowledgeSchema";

const createFallbackContent = (
  module: KnowledgeModule,
  specialization: string,
  fallbackStandards: string[]
): KnowledgeModuleContent => ({
  title: specialization,
  panelBadgeLabel: knowledgePanelLabels.badge,
  sections: [
    {
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.overview,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.overview
        ],
      type: "text",
      text:
        module.metadata?.description ??
        `${specialization} knowledge within ${module.disciplineName}.`,
    },
    {
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.designStandards,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.designStandards
        ],
      type: "list",
      items:
        fallbackStandards.length > 0
          ? fallbackStandards
          : [knowledgePanelLabels.emptyList],
    },
    {
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.designSoftware,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.designSoftware
        ],
      type: "list",
      items: [knowledgePanelLabels.emptyList],
    },
    {
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.aiEngineeringAgents,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.aiEngineeringAgents
        ],
      type: "list",
      items: [knowledgePanelLabels.emptyList],
    },
  ],
});

export const resolveModuleContent = (
  module: KnowledgeModule | null,
  specialization: string | null,
  fallbackStandards: string[] = []
): KnowledgeModuleContent | null => {
  if (!module || !specialization) {
    return null;
  }

  const specializationKnowledge = getSpecializationKnowledge(
    module.disciplineId,
    specialization
  );

  if (specializationKnowledge) {
    return toKnowledgeModuleContent(
      specializationKnowledge,
      knowledgePanelLabels.badge
    );
  }

  return createFallbackContent(
    module,
    specialization,
    fallbackStandards
  );
};
