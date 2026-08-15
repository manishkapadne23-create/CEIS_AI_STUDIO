import { DISCIPLINE_DEFINITIONS } from "../data/disciplineManifest";
import type { EngineeringStandardsRegistry } from "../types/EngineeringStandard";
import {
  ENGINEERING_STANDARD_FAMILY_KEYS,
  ENGINEERING_STANDARD_FAMILY_LABELS,
} from "../types/EngineeringStandard";
import {
  buildStandardsRegistry,
  createStandardDocument,
} from "./buildStandardsRegistry";

export const createPlaceholderStandardsRegistry = (
  disciplineId: string
): EngineeringStandardsRegistry => {
  const discipline = DISCIPLINE_DEFINITIONS.find(
    (entry) => entry.id === disciplineId
  );

  if (!discipline) {
    throw new Error(`Unknown engineering discipline: ${disciplineId}`);
  }

  return buildStandardsRegistry(discipline.id, discipline.name, [
    {
      key: ENGINEERING_STANDARD_FAMILY_KEYS.general,
      label: ENGINEERING_STANDARD_FAMILY_LABELS.general,
      description: `Applicable standards catalog for ${discipline.name}.`,
      documents: [
        createStandardDocument(
          `${disciplineId}-standards-catalog`,
          "Catalog",
          "Standards Catalog",
          ENGINEERING_STANDARD_FAMILY_KEYS.general,
          `Standards and codes for ${discipline.name} will be added to this registry.`,
          undefined,
          "standards-catalog"
        ),
      ].map((document) => ({
        ...document,
        status: "coming-soon" as const,
      })),
    },
  ]);
};
