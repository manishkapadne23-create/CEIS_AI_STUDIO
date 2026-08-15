import type { EngineeringStandardFamilyKey } from "../../knowledge/types/EngineeringStandard";

export type StandardsNavigationView = "categories" | "publications";

export interface StandardsNavigationCategory {
  id: string;
  familyKey?: EngineeringStandardFamilyKey;
  label: string;
  description: string;
  icon: string;
  /** When set, category is only shown for these discipline IDs. */
  disciplineIds?: string[];
}

export const STANDARDS_NAVIGATION_CATEGORIES: StandardsNavigationCategory[] = [
  {
    id: "irc",
    familyKey: "irc",
    label: "IRC Publications",
    description: "Indian Roads Congress codes for highways and bridges.",
    icon: "🛣️",
    disciplineIds: ["civil-engineering"],
  },
  {
    id: "is",
    familyKey: "is",
    label: "IS Codes",
    description: "Bureau of Indian Standards design and materials codes.",
    icon: "🇮🇳",
    disciplineIds: ["civil-engineering"],
  },
  {
    id: "morth",
    familyKey: "morth",
    label: "MoRTH Specifications",
    description:
      "Ministry of Road Transport and Highways specifications and manuals.",
    icon: "📋",
    disciplineIds: ["civil-engineering"],
  },
  {
    id: "astm",
    familyKey: "astm",
    label: "ASTM Standards",
    description: "ASTM International materials and testing standards.",
    icon: "🧪",
    disciplineIds: ["civil-engineering"],
  },
  {
    id: "aashto",
    familyKey: "aashto",
    label: "AASHTO Standards",
    description:
      "American Association of State Highway and Transportation Officials references.",
    icon: "🚧",
    disciplineIds: ["civil-engineering"],
  },
  {
    id: "ieee-iec-asme",
    label: "IEEE / IEC / ASME",
    description:
      "Electrical, electronics, and mechanical engineering standards bodies.",
    icon: "⚡",
    disciplineIds: [
      "electrical-engineering",
      "mechanical-engineering",
      "electronics-telecommunication-engineering",
      "computer-engineering",
      "aerospace-engineering",
    ],
  },
];

export const getStandardsCategoriesForDiscipline = (
  disciplineId: string | null
): StandardsNavigationCategory[] => {
  if (!disciplineId) {
    return [];
  }

  return STANDARDS_NAVIGATION_CATEGORIES.filter(
    (category) =>
      !category.disciplineIds ||
      category.disciplineIds.includes(disciplineId)
  );
};

export const getCategoryLabel = (
  familyKey: EngineeringStandardFamilyKey
): string => {
  const match = STANDARDS_NAVIGATION_CATEGORIES.find(
    (category) => category.familyKey === familyKey
  );

  if (match) {
    return match.label;
  }

  if (familyKey === "general") {
    return "General Standards";
  }

  return familyKey.toUpperCase();
};
