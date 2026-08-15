export const ENGINEERING_RESPONSE_SECTIONS = [
  "Summary",
  "Explanation",
  "Engineering Considerations",
  "Applicable Standards",
  "Calculation Notes",
  "Practical Recommendations",
  "References",
] as const;

export type EngineeringResponseSection =
  (typeof ENGINEERING_RESPONSE_SECTIONS)[number];

export interface StructuredEngineeringResponse {
  summary: string;
  explanation: string;
  engineeringConsiderations: string[];
  applicableStandards: string[];
  calculationNotes: string[];
  practicalRecommendations: string[];
  references: string[];
}

export interface EngineeringResponseFormatOptions {
  disciplineName: string;
  activeModuleTitle: string;
  userQuestion: string;
  followUpIntent?: string | null;
  applicableStandards?: string[];
}
