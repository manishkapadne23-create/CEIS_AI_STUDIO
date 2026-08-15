import type { ResolvedEngineeringStandard } from "../knowledge/types/EngineeringStandard";

export type EngineeringSearchResultType =
  | "discipline"
  | "standard"
  | "calculator"
  | "tool"
  | "workflow"
  | "knowledge";

export interface EngineeringSearchResult {
  id: string;
  type: EngineeringSearchResultType;
  title: string;
  subtitle?: string;
  disciplineId: string;
  disciplineName: string;
  resourceId?: string;
}

export type { ResolvedEngineeringStandard };
