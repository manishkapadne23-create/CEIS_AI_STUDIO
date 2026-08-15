import type { KnowledgeModuleContent, KnowledgeModuleSection } from "../types";
import {
  ENGINEERING_KNOWLEDGE_SECTION_KEYS,
  ENGINEERING_KNOWLEDGE_SECTION_LABELS,
  type EngineeringKnowledgeItem,
  type EngineeringKnowledgeStandard,
  type EngineeringSpecializationKnowledge,
} from "../types/EngineeringKnowledgeSchema";

const mapToCards = (items: EngineeringKnowledgeItem[]) =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
  }));

const toStandardCards = (items: EngineeringKnowledgeStandard[]) =>
  items.map((item) => ({
    id: item.id,
    title: item.code ?? item.title,
    description: item.description ?? item.title,
  }));

export const toKnowledgeModuleContent = (
  knowledge: EngineeringSpecializationKnowledge,
  panelBadgeLabel: string
): KnowledgeModuleContent => {
  const sections: KnowledgeModuleSection[] = [
    {
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.overview,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.overview
        ],
      type: "text",
      text: knowledge.overview,
    },
  ];

  if (knowledge.scope.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.scope,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.scope
        ],
      type: "list",
      items: knowledge.scope,
    });
  }

  if (knowledge.designStandards.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.designStandards,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.designStandards
        ],
      type: "cards",
      items: toStandardCards(knowledge.designStandards),
    });
  }

  if (knowledge.designModules.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.designModules,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.designModules
        ],
      type: "cards",
      items: mapToCards(knowledge.designModules),
    });
  }

  if (knowledge.designSoftware.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.designSoftware,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.designSoftware
        ],
      type: "cards",
      items: mapToCards(knowledge.designSoftware),
    });
  }

  if (knowledge.aiEngineeringAgents.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.aiEngineeringAgents,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.aiEngineeringAgents
        ],
      type: "cards",
      items: mapToCards(knowledge.aiEngineeringAgents),
    });
  }

  if (knowledge.engineeringCalculators.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.engineeringCalculators,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.engineeringCalculators
        ],
      type: "cards",
      items: mapToCards(knowledge.engineeringCalculators),
    });
  }

  if (knowledge.templates.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.templates,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.templates
        ],
      type: "cards",
      items: mapToCards(knowledge.templates),
    });
  }

  if (knowledge.learningResources.length > 0) {
    sections.push({
      id: ENGINEERING_KNOWLEDGE_SECTION_KEYS.learningResources,
      label:
        ENGINEERING_KNOWLEDGE_SECTION_LABELS[
          ENGINEERING_KNOWLEDGE_SECTION_KEYS.learningResources
        ],
      type: "cards",
      items: mapToCards(knowledge.learningResources),
    });
  }

  return {
    title: knowledge.title,
    panelBadgeLabel,
    sections,
  };
};
