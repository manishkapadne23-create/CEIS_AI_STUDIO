export interface EngineeringAIExpertCapability {
  key: string;
  label: string;
  status: string;
}

export interface EngineeringAIExpertProfile {
  id: string;
  discipline: string;
  branch: string | null;
  specialization: string;
  scope: string[];
  standards: string[];
  terminology: string[];
  responseStyle: string;
  availableCapabilities: EngineeringAIExpertCapability[];
}
