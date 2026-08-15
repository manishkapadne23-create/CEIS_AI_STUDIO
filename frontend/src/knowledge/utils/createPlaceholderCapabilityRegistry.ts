import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import {
  ENGINEERING_CAPABILITY_KEYS,
  ENGINEERING_CAPABILITY_LABELS,
  type EngineeringCapability,
  type EngineeringCapabilityRegistry,
  type EngineeringCapabilityStatus,
} from "../types/EngineeringCapability";

interface CreateCapabilityInput {
  key: (typeof ENGINEERING_CAPABILITY_KEYS)[keyof typeof ENGINEERING_CAPABILITY_KEYS];
  description: string;
  enabled?: boolean;
  status?: EngineeringCapabilityStatus;
}

const createCapability = (
  input: CreateCapabilityInput
): EngineeringCapability => ({
  id: input.key,
  key: input.key,
  label: ENGINEERING_CAPABILITY_LABELS[input.key],
  description: input.description,
  enabled: input.enabled ?? false,
  status: input.status ?? "coming-soon",
});

export const createPlaceholderCapabilityRegistry = (
  disciplineId: string
): EngineeringCapabilityRegistry => {
  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  if (!discipline) {
    throw new Error(`Unknown engineering discipline: ${disciplineId}`);
  }

  const placeholderDescription = (capabilityLabel: string) =>
    `${capabilityLabel} capability for ${discipline.name} is planned and will be added to this registry.`;

  const capabilities: EngineeringCapability[] = [
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.aiChat,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[ENGINEERING_CAPABILITY_KEYS.aiChat]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.knowledge,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[ENGINEERING_CAPABILITY_KEYS.knowledge]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.standards,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[ENGINEERING_CAPABILITY_KEYS.standards]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.documentIntelligence,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[
          ENGINEERING_CAPABILITY_KEYS.documentIntelligence
        ]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.professionalTools,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[
          ENGINEERING_CAPABILITY_KEYS.professionalTools
        ]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.calculators,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[ENGINEERING_CAPABILITY_KEYS.calculators]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.templates,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[ENGINEERING_CAPABILITY_KEYS.templates]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.learning,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[ENGINEERING_CAPABILITY_KEYS.learning]
      ),
    }),
    createCapability({
      key: ENGINEERING_CAPABILITY_KEYS.aiEngineeringAgents,
      description: placeholderDescription(
        ENGINEERING_CAPABILITY_LABELS[
          ENGINEERING_CAPABILITY_KEYS.aiEngineeringAgents
        ]
      ),
    }),
  ];

  return {
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    capabilities,
  };
};
