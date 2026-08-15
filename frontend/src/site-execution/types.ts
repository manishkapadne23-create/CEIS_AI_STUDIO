export type SiteDisciplineId =
  | "civil-engineering"
  | "mechanical-engineering"
  | "electrical-engineering"
  | "computer-engineering"
  | "electronics-telecommunication-engineering"
  | "chemical-engineering"
  | "environmental-engineering"
  | "mining-engineering"
  | "marine-engineering"
  | "railway-engineering"
  | "aerospace-engineering"
  | "industrial-engineering"
  | "automation-robotics"
  | "renewable-energy"
  | "architecture-planning"
  | "agricultural-engineering"
  | "oil-gas-engineering"
  | "biomedical-engineering";

export type ExecutionPhase =
  | "construction"
  | "manufacturing"
  | "installation"
  | "inspection"
  | "testing"
  | "commissioning"
  | "handover";

export type ChecklistType =
  | "daily-site"
  | "inspection"
  | "material"
  | "equipment"
  | "labour"
  | "safety"
  | "permit";

export type SiteActivityType =
  | "concrete"
  | "steel"
  | "electrical"
  | "mechanical"
  | "piping"
  | "hvac"
  | "finishing"
  | "general";

export interface ChecklistItem {
  id: string;
  description: string;
  category: string;
  mandatory: boolean;
  standard?: string | null;
}

export interface SiteChecklist {
  id: string;
  type: ChecklistType;
  title: string;
  phase: ExecutionPhase;
  items: ChecklistItem[];
  generatedAt: number;
}

export interface InspectionRecord {
  id: string;
  activity: string;
  inspectionType: string;
  findings: string[];
  status: "pass" | "fail" | "conditional";
  standard: string | null;
  inspector: string | null;
  recordedAt: number;
}

export interface QualityRecord {
  id: string;
  activity: string;
  materialVerified: boolean;
  workmanshipRating: "acceptable" | "needs-improvement" | "reject";
  nonConformances: string[];
  correctiveActions: string[];
  recordedAt: number;
}

export interface TroubleshootingResult {
  issue: string;
  category: string;
  probableCauses: string[];
  recommendedActions: string[];
  safetyNotes: string[];
  relatedStandards: string[];
}

export interface SiteReport {
  id: string;
  type:
    | "daily-progress"
    | "inspection"
    | "site-observation"
    | "quality"
    | "safety-observation"
    | "work-completion"
    | "site-instruction";
  title: string;
  content: string;
  generatedAt: number;
}

export interface SiteExecutionWorkspace {
  id: string;
  title: string;
  disciplineId: string | null;
  disciplineName: string | null;
  conversationId: string | null;
  projectName: string | null;
  activityType: SiteActivityType;
  phase: ExecutionPhase;
  checklists: SiteChecklist[];
  inspections: InspectionRecord[];
  qualityRecords: QualityRecord[];
  reports: SiteReport[];
  observations: string[];
  status: "active" | "paused" | "completed";
  createdAt: number;
  updatedAt: number;
}

export interface ExecutionEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName?: string | null;
}

export interface ExecutionEngineResult {
  active: boolean;
  activeWorkspace: SiteExecutionWorkspace | null;
  executionAction: string | null;
  reportAction: string | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface ExecutionExtensionHooks {
  offlineMobileModeId?: string | null;
  voiceCommandsId?: string | null;
  imageBasedSiteReviewId?: string | null;
  videoAssistanceId?: string | null;
  droneIntegrationId?: string | null;
  bimSiteReviewId?: string | null;
  pmisSiteModuleId?: string | null;
}

export const EXECUTION_PHASES: { id: ExecutionPhase; label: string }[] = [
  { id: "construction", label: "Construction" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "installation", label: "Installation" },
  { id: "inspection", label: "Inspection" },
  { id: "testing", label: "Testing" },
  { id: "commissioning", label: "Commissioning" },
  { id: "handover", label: "Handover" },
];

export const CHECKLIST_TYPES: { id: ChecklistType; label: string }[] = [
  { id: "daily-site", label: "Daily Site Checklist" },
  { id: "inspection", label: "Inspection Checklist" },
  { id: "material", label: "Material Checklist" },
  { id: "equipment", label: "Equipment Checklist" },
  { id: "labour", label: "Labour Checklist" },
  { id: "safety", label: "Safety Checklist" },
  { id: "permit", label: "Permit Checklist" },
];
