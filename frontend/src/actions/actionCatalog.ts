import type {
  EngineeringDeliverableType,
  EngineeringOutputType,
} from "./types";

export interface DisciplineActionDefinition {
  deliverableType: EngineeringDeliverableType;
  label: string;
  outputType: EngineeringOutputType;
  promptTemplate: string;
}

const CIVIL_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "boq",
    label: "Generate BOQ",
    outputType: "tabular-report",
    promptTemplate:
      "Prepare a detailed Bill of Quantities (BOQ) for the current project with item descriptions, units, and quantities.",
  },
  {
    deliverableType: "method-statement",
    label: "Generate Method Statement",
    outputType: "step-by-step-procedure",
    promptTemplate:
      "Prepare a professional method statement covering scope, sequence, plant, materials, safety, and quality control.",
  },
  {
    deliverableType: "checklist",
    label: "Generate QA Checklist",
    outputType: "checklist",
    promptTemplate:
      "Prepare a QA/QC inspection checklist for the current civil engineering work.",
  },
  {
    deliverableType: "inspection-format",
    label: "Concrete Inspection Format",
    outputType: "engineering-format",
    promptTemplate:
      "Generate a concrete inspection format with test fields, acceptance criteria, and sign-off sections.",
  },
];

const MECHANICAL_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "checklist",
    label: "Maintenance Checklist",
    outputType: "checklist",
    promptTemplate:
      "Prepare a preventive maintenance checklist for the mechanical equipment discussed.",
  },
  {
    deliverableType: "inspection-format",
    label: "Machine Inspection Report",
    outputType: "professional-report",
    promptTemplate:
      "Generate a machine inspection report template with condition assessment fields.",
  },
  {
    deliverableType: "sop",
    label: "Lubrication Schedule",
    outputType: "tabular-report",
    promptTemplate:
      "Prepare a lubrication schedule with equipment, lubricant type, frequency, and responsibility.",
  },
];

const ELECTRICAL_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "report",
    label: "Cable Schedule",
    outputType: "tabular-report",
    promptTemplate:
      "Generate a cable schedule with tag, route, size, length, and termination details.",
  },
  {
    deliverableType: "checklist",
    label: "Testing Checklist",
    outputType: "checklist",
    promptTemplate:
      "Prepare an electrical testing and commissioning checklist.",
  },
  {
    deliverableType: "report",
    label: "Transformer Report",
    outputType: "professional-report",
    promptTemplate:
      "Generate a transformer inspection and test report format.",
  },
];

const COMPUTER_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "technical-note",
    label: "Software Design Document",
    outputType: "professional-report",
    promptTemplate:
      "Prepare a software design document outline for the system discussed.",
  },
  {
    deliverableType: "technical-note",
    label: "API Documentation",
    outputType: "engineering-format",
    promptTemplate:
      "Generate API documentation with endpoints, parameters, and response schemas.",
  },
  {
    deliverableType: "technical-presentation",
    label: "Architecture Diagram",
    outputType: "engineering-format",
    promptTemplate:
      "Describe a system architecture diagram with components, interfaces, and data flow.",
  },
];

const AUTOMATION_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "test-format",
    label: "PLC Testing Sheet",
    outputType: "checklist",
    promptTemplate:
      "Generate a PLC FAT/SAT testing sheet with I/O verification steps.",
  },
  {
    deliverableType: "report",
    label: "SCADA Report",
    outputType: "professional-report",
    promptTemplate:
      "Prepare a SCADA system commissioning report template.",
  },
];

const OIL_GAS_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "inspection-format",
    label: "Pipeline Inspection Report",
    outputType: "professional-report",
    promptTemplate:
      "Generate a pipeline inspection report with corrosion, coating, and weld assessment fields.",
  },
  {
    deliverableType: "checklist",
    label: "HAZOP Checklist",
    outputType: "checklist",
    promptTemplate:
      "Prepare a HAZOP study checklist with guidewords and action tracking.",
  },
];

const RENEWABLE_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "inspection-format",
    label: "Solar Inspection Report",
    outputType: "professional-report",
    promptTemplate:
      "Generate a solar plant inspection report covering modules, inverters, and earthing.",
  },
  {
    deliverableType: "checklist",
    label: "Wind Farm Checklist",
    outputType: "checklist",
    promptTemplate:
      "Prepare a wind farm O&M inspection checklist.",
  },
];

const BIOMEDICAL_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "test-format",
    label: "Equipment Calibration Report",
    outputType: "professional-report",
    promptTemplate:
      "Generate a biomedical equipment calibration report format.",
  },
  {
    deliverableType: "checklist",
    label: "Hospital Equipment Checklist",
    outputType: "checklist",
    promptTemplate:
      "Prepare a hospital equipment inspection and maintenance checklist.",
  },
];

const DEFAULT_ACTIONS: DisciplineActionDefinition[] = [
  {
    deliverableType: "report",
    label: "Generate Report",
    outputType: "professional-report",
    promptTemplate:
      "Generate a professional engineering report for the current discussion.",
  },
  {
    deliverableType: "checklist",
    label: "Generate Checklist",
    outputType: "checklist",
    promptTemplate: "Prepare an engineering checklist for the current topic.",
  },
  {
    deliverableType: "boq",
    label: "Generate BOQ",
    outputType: "tabular-report",
    promptTemplate:
      "Prepare a Bill of Quantities for the current engineering scope.",
  },
  {
    deliverableType: "estimate",
    label: "Generate Estimate",
    outputType: "tabular-report",
    promptTemplate:
      "Prepare a cost estimate breakdown for the current engineering scope.",
  },
  {
    deliverableType: "method-statement",
    label: "Method Statement",
    outputType: "step-by-step-procedure",
    promptTemplate: "Prepare a method statement for the current work scope.",
  },
  {
    deliverableType: "inspection-format",
    label: "Inspection Format",
    outputType: "engineering-format",
    promptTemplate:
      "Generate an inspection format for the current engineering activity.",
  },
  {
    deliverableType: "technical-note",
    label: "Technical Note",
    outputType: "technical-note",
    promptTemplate: "Prepare a formal technical note for the current topic.",
  },
  {
    deliverableType: "comparison-table",
    label: "Comparison Table",
    outputType: "tabular-report",
    promptTemplate:
      "Generate a comparison table of the engineering options discussed.",
  },
  {
    deliverableType: "risk-assessment",
    label: "Risk Assessment",
    outputType: "professional-report",
    promptTemplate:
      "Prepare a risk assessment matrix for the current engineering activity.",
  },
  {
    deliverableType: "calculation-sheet",
    label: "Calculation Sheet",
    outputType: "engineering-format",
    promptTemplate:
      "Prepare a structured calculation sheet with inputs, formulas, and results.",
  },
];

const DISCIPLINE_ACTION_MAP: Record<string, DisciplineActionDefinition[]> = {
  civil: CIVIL_ACTIONS,
  "civil-engineering": CIVIL_ACTIONS,
  mechanical: MECHANICAL_ACTIONS,
  "mechanical-engineering": MECHANICAL_ACTIONS,
  electrical: ELECTRICAL_ACTIONS,
  "electrical-engineering": ELECTRICAL_ACTIONS,
  computer: COMPUTER_ACTIONS,
  "computer-engineering": COMPUTER_ACTIONS,
  automation: AUTOMATION_ACTIONS,
  "automation-robotics": AUTOMATION_ACTIONS,
  "oil-gas": OIL_GAS_ACTIONS,
  "renewable-energy": RENEWABLE_ACTIONS,
  biomedical: BIOMEDICAL_ACTIONS,
};

const normalizeDisciplineKey = (
  disciplineId: string | null,
  disciplineName: string | null
): string => {
  const source = (disciplineId ?? disciplineName ?? "").toLowerCase();
  return source.replace(/\s+/g, "-").replace(/engineering/g, "").replace(/--/g, "-");
};

export const getDisciplineActions = (
  disciplineId: string | null,
  disciplineName: string | null
): DisciplineActionDefinition[] => {
  const key = normalizeDisciplineKey(disciplineId, disciplineName);

  for (const [mapKey, actions] of Object.entries(DISCIPLINE_ACTION_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return actions;
    }
  }

  if (disciplineName) {
    const nameLower = disciplineName.toLowerCase();
    if (nameLower.includes("civil")) return CIVIL_ACTIONS;
    if (nameLower.includes("mechanical")) return MECHANICAL_ACTIONS;
    if (nameLower.includes("electrical")) return ELECTRICAL_ACTIONS;
    if (nameLower.includes("computer")) return COMPUTER_ACTIONS;
    if (nameLower.includes("automation")) return AUTOMATION_ACTIONS;
    if (nameLower.includes("oil") || nameLower.includes("gas"))
      return OIL_GAS_ACTIONS;
    if (nameLower.includes("renewable")) return RENEWABLE_ACTIONS;
    if (nameLower.includes("biomedical")) return BIOMEDICAL_ACTIONS;
  }

  return DEFAULT_ACTIONS;
};

export const getDeliverableLabel = (
  deliverableType: EngineeringDeliverableType
): string => {
  const match = DEFAULT_ACTIONS.find(
    (action) => action.deliverableType === deliverableType
  );
  return match?.label ?? deliverableType.replace(/-/g, " ");
};

export const ACTION_BAR_ITEMS: Array<{
  id: import("./types").ActionBarActionId;
  label: string;
  shortLabel?: string;
}> = [
  { id: "generate-pdf", label: "Generate PDF", shortLabel: "PDF" },
  { id: "copy", label: "Copy" },
  { id: "export-word", label: "Export Word", shortLabel: "Word" },
  { id: "export-excel", label: "Export Excel", shortLabel: "Excel" },
  { id: "share", label: "Share" },
  { id: "save-workspace", label: "Save Workspace", shortLabel: "Save" },
  {
    id: "continue-conversation",
    label: "Continue Conversation",
    shortLabel: "Continue",
  },
  { id: "regenerate", label: "Regenerate" },
  { id: "translate", label: "Translate" },
  { id: "print", label: "Print" },
];
