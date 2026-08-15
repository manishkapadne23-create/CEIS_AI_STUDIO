import type { ChecklistItem, ChecklistType, ExecutionPhase, SiteChecklist } from "./types";

const makeItem = (
  description: string,
  category: string,
  mandatory = true,
  standard?: string
): ChecklistItem => ({
  id: crypto.randomUUID(),
  description,
  category,
  mandatory,
  standard: standard ?? null,
});

const DAILY_SITE_ITEMS: ChecklistItem[] = [
  makeItem("Review today's work plan and method statement", "Planning"),
  makeItem("Verify weather conditions suitable for planned activities", "Planning"),
  makeItem("Confirm site access and logistics arrangements", "Logistics"),
  makeItem("Check toolbox talk / safety briefing completed", "Safety", true, "Site HSE Plan"),
  makeItem("Verify permits and work authorizations are valid", "Permits"),
  makeItem("Inspect work area for hazards before start", "Safety"),
  makeItem("Confirm materials delivered and stored correctly", "Materials"),
  makeItem("Check equipment calibration and inspection tags", "Equipment"),
  makeItem("Record manpower and equipment deployment", "Labour"),
  makeItem("Document progress and any deviations at end of day", "Reporting"),
];

const INSPECTION_ITEMS: ChecklistItem[] = [
  makeItem("Verify work conforms to approved drawings", "Documentation", true, "IFC Drawings"),
  makeItem("Check dimensions and levels against specifications", "Quality"),
  makeItem("Confirm material test certificates available", "Materials", true),
  makeItem("Inspect workmanship against acceptance criteria", "Quality"),
  makeItem("Verify hold points cleared before proceeding", "QA/QC"),
  makeItem("Record inspection findings with photographs", "Documentation"),
  makeItem("Sign off inspection report or raise NCR", "QA/QC"),
];

const MATERIAL_ITEMS: ChecklistItem[] = [
  makeItem("Verify material delivery note matches order", "Documentation"),
  makeItem("Check material test certificates (MTC) validity", "Quality", true),
  makeItem("Inspect material condition on delivery", "Quality"),
  makeItem("Confirm storage conditions per specification", "Storage"),
  makeItem("Verify batch/lot traceability records", "Traceability"),
  makeItem("Sample and test as per QA plan if required", "Testing"),
  makeItem("Tag approved materials; quarantine rejected items", "QA/QC"),
];

const EQUIPMENT_ITEMS: ChecklistItem[] = [
  makeItem("Verify equipment inspection and certification current", "Safety", true),
  makeItem("Check operator licenses and competency records", "Labour", true),
  makeItem("Inspect equipment condition before use", "Safety"),
  makeItem("Confirm lifting plan for crane/rigging operations", "Safety", true),
  makeItem("Verify fuel, lubricants, and consumables available", "Logistics"),
  makeItem("Record equipment hours and maintenance log", "Maintenance"),
];

const LABOUR_ITEMS: ChecklistItem[] = [
  makeItem("Verify workforce headcount against deployment plan", "Planning"),
  makeItem("Confirm all workers inducted and PPE compliant", "Safety", true),
  makeItem("Check trade certifications for specialized work", "Competency"),
  makeItem("Assign supervisor for each work front", "Management"),
  makeItem("Brief team on today's scope and hazards", "Safety"),
  makeItem("Record attendance and productivity", "Reporting"),
];

const SAFETY_ITEMS: ChecklistItem[] = [
  makeItem("PPE compliance check for all personnel", "PPE", true),
  makeItem("Verify barricading and signage in place", "Site Setup"),
  makeItem("Check emergency exits and first aid availability", "Emergency", true),
  makeItem("Confirm fire extinguishers inspected and accessible", "Emergency"),
  makeItem("Review JSA/RAMS for today's activities", "Planning", true),
  makeItem("Inspect scaffolding, ladders, and access ways", "Access"),
  makeItem("Verify hot work / confined space permits if applicable", "Permits"),
  makeItem("Report and investigate any near-miss incidents", "Incident"),
];

const PERMIT_ITEMS: ChecklistItem[] = [
  makeItem("Work permit issued and signed by authorized person", "Authorization", true),
  makeItem("Permit validity period confirmed", "Authorization"),
  makeItem("Isolation and lockout/tagout verified if required", "Safety", true),
  makeItem("Gas test results recorded for confined space", "Testing"),
  makeItem("Fire watch assigned for hot work", "Safety"),
  makeItem("Permit displayed at work location", "Documentation"),
  makeItem("Permit closed and area restored after work", "Closure"),
];

const CHECKLIST_TEMPLATES: Record<ChecklistType, ChecklistItem[]> = {
  "daily-site": DAILY_SITE_ITEMS,
  inspection: INSPECTION_ITEMS,
  material: MATERIAL_ITEMS,
  equipment: EQUIPMENT_ITEMS,
  labour: LABOUR_ITEMS,
  safety: SAFETY_ITEMS,
  permit: PERMIT_ITEMS,
};

const CHECKLIST_TITLES: Record<ChecklistType, string> = {
  "daily-site": "Daily Site Checklist",
  inspection: "Inspection Checklist",
  material: "Material Checklist",
  equipment: "Equipment Checklist",
  labour: "Labour Checklist",
  safety: "Safety Checklist",
  permit: "Permit Checklist",
};

export const generateChecklist = (
  type: ChecklistType,
  phase: ExecutionPhase,
  disciplineName: string | null
): SiteChecklist => {
  const baseItems = CHECKLIST_TEMPLATES[type];
  const disciplineItem =
    disciplineName
      ? makeItem(
          `Verify ${disciplineName} specific requirements for ${phase}`,
          "Discipline",
          true
        )
      : null;

  return {
    id: crypto.randomUUID(),
    type,
    title: CHECKLIST_TITLES[type],
    phase,
    items: disciplineItem ? [disciplineItem, ...baseItems] : [...baseItems],
    generatedAt: Date.now(),
  };
};

export const resolveChecklistType = (message: string): ChecklistType => {
  const m = message.toLowerCase();
  if (/inspection/i.test(m)) return "inspection";
  if (/material/i.test(m)) return "material";
  if (/equipment/i.test(m)) return "equipment";
  if (/labour|labor|manpower/i.test(m)) return "labour";
  if (/safety/i.test(m)) return "safety";
  if (/permit/i.test(m)) return "permit";
  return "daily-site";
};

export const formatChecklist = (checklist: SiteChecklist): string =>
  [
    checklist.title.toUpperCase(),
    `Phase: ${checklist.phase}`,
    `Items: ${checklist.items.length}`,
    "",
    ...checklist.items.map(
      (item, i) =>
        `${i + 1}. [${item.mandatory ? "MANDATORY" : "Optional"}] ${item.description}${item.standard ? ` (${item.standard})` : ""}`
    ),
  ].join("\n");

export const CHECKLIST_TEMPLATE_COUNT = Object.keys(CHECKLIST_TEMPLATES).length;
