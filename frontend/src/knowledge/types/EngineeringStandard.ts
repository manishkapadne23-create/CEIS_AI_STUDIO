export const ENGINEERING_STANDARD_FAMILY_KEYS = {
  irc: "irc",
  morth: "morth",
  is: "is",
  astm: "astm",
  aashto: "aashto",
  general: "general",
} as const;

export type EngineeringStandardFamilyKey =
  (typeof ENGINEERING_STANDARD_FAMILY_KEYS)[keyof typeof ENGINEERING_STANDARD_FAMILY_KEYS];

export const ENGINEERING_STANDARD_FAMILY_LABELS: Record<
  EngineeringStandardFamilyKey,
  string
> = {
  irc: "IRC",
  morth: "MoRTH",
  is: "IS Codes",
  astm: "ASTM",
  aashto: "AASHTO",
  general: "General Standards",
};

export type EngineeringStandardStatus =
  | "available"
  | "reference"
  | "coming-soon";

export interface EngineeringStandardDocument {
  id: string;
  code: string;
  title: string;
  description?: string;
  family: EngineeringStandardFamilyKey;
  status: EngineeringStandardStatus;
  specializationId?: string;
  knowledgeItemId?: string;
}

export interface EngineeringStandardFamily {
  key: EngineeringStandardFamilyKey;
  label: string;
  description: string;
  documents: EngineeringStandardDocument[];
}

export interface EngineeringStandardsRegistry {
  disciplineId: string;
  disciplineName: string;
  families: EngineeringStandardFamily[];
  documents: EngineeringStandardDocument[];
}

export interface EngineeringStandardsRegistryMap {
  registries: Record<string, EngineeringStandardsRegistry>;
  getRegistry: (
    disciplineId: string
  ) => EngineeringStandardsRegistry | undefined;
  listRegistries: () => EngineeringStandardsRegistry[];
}

export interface ResolvedEngineeringStandard {
  id: string;
  code: string;
  title: string;
  description?: string;
  family: EngineeringStandardFamilyKey;
  familyLabel: string;
  status: EngineeringStandardStatus;
  fromKnowledgeRepository: boolean;
}

export interface ResolvedEngineeringStandards {
  disciplineId: string | null;
  disciplineName: string | null;
  specialization: string | null;
  families: EngineeringStandardFamilyKey[];
  standards: ResolvedEngineeringStandard[];
}
