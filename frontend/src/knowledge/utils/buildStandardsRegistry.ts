import type {
  EngineeringStandardDocument,
  EngineeringStandardFamily,
  EngineeringStandardFamilyKey,
  EngineeringStandardsRegistry,
} from "../types/EngineeringStandard";
import { ENGINEERING_STANDARD_FAMILY_KEYS } from "../types/EngineeringStandard";

const familyOrder: EngineeringStandardFamilyKey[] = [
  ENGINEERING_STANDARD_FAMILY_KEYS.irc,
  ENGINEERING_STANDARD_FAMILY_KEYS.morth,
  ENGINEERING_STANDARD_FAMILY_KEYS.is,
  ENGINEERING_STANDARD_FAMILY_KEYS.astm,
  ENGINEERING_STANDARD_FAMILY_KEYS.aashto,
  ENGINEERING_STANDARD_FAMILY_KEYS.general,
];

export const buildStandardsRegistry = (
  disciplineId: string,
  disciplineName: string,
  families: EngineeringStandardFamily[]
): EngineeringStandardsRegistry => {
  const orderedFamilies = familyOrder
    .map((familyKey) =>
      families.find((family) => family.key === familyKey)
    )
    .filter((family): family is EngineeringStandardFamily =>
      Boolean(family)
    );

  const documents = orderedFamilies.flatMap(
    (family) => family.documents
  );

  return {
    disciplineId,
    disciplineName,
    families: orderedFamilies,
    documents,
  };
};

export const createStandardDocument = (
  id: string,
  code: string,
  title: string,
  family: EngineeringStandardFamilyKey,
  description?: string,
  specializationId?: string,
  knowledgeItemId?: string
): EngineeringStandardDocument => ({
  id,
  code,
  title,
  description,
  family,
  status: "available",
  specializationId,
  knowledgeItemId,
});
