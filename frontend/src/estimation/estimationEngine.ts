import type {
  EstimateTemplate,
  EstimationDisciplineId,
  EstimationTypeId,
  EngineeringEstimate,
} from "./types";

export const ESTIMATION_TYPES: {
  id: EstimationTypeId;
  name: string;
}[] = [
  { id: "preliminary", name: "Preliminary Estimate" },
  { id: "detailed", name: "Detailed Estimate" },
  { id: "boq", name: "BOQ Estimate" },
  { id: "quantity", name: "Quantity Estimate" },
  { id: "budget", name: "Budget Estimate" },
  { id: "concept", name: "Concept Estimate" },
  { id: "material", name: "Material Estimate" },
  { id: "labour", name: "Labour Estimate" },
  { id: "equipment", name: "Equipment Estimate" },
  { id: "maintenance", name: "Maintenance Estimate" },
];

export const DISCIPLINES: { id: EstimationDisciplineId; name: string }[] = [
  { id: "civil-engineering", name: "Civil Engineering" },
  { id: "mechanical-engineering", name: "Mechanical Engineering" },
  { id: "electrical-engineering", name: "Electrical Engineering" },
  { id: "computer-engineering", name: "Computer Engineering" },
  { id: "electronics-telecommunication-engineering", name: "Electronics & Telecommunication" },
  { id: "chemical-engineering", name: "Chemical Engineering" },
  { id: "environmental-engineering", name: "Environmental Engineering" },
  { id: "mining-engineering", name: "Mining Engineering" },
  { id: "marine-engineering", name: "Marine Engineering" },
  { id: "railway-engineering", name: "Railway Engineering" },
  { id: "aerospace-engineering", name: "Aerospace Engineering" },
  { id: "industrial-engineering", name: "Industrial Engineering" },
  { id: "automation-robotics", name: "Automation & Robotics" },
  { id: "renewable-energy", name: "Renewable Energy" },
  { id: "architecture-planning", name: "Architecture & Planning" },
  { id: "agricultural-engineering", name: "Agricultural Engineering" },
  { id: "oil-gas-engineering", name: "Oil & Gas Engineering" },
  { id: "biomedical-engineering", name: "Biomedical Engineering" },
];

const DISCIPLINE_WORK_ITEMS: Partial<Record<EstimationDisciplineId, string[]>> = {
  "civil-engineering": [
    "Earthwork excavation", "PCC", "RCC work", "Reinforcement steel",
    "Formwork", "Brick masonry", "Plastering", "Flooring", "Waterproofing",
  ],
  "mechanical-engineering": [
    "Piping", "Valves & fittings", "Insulation", "Equipment installation",
    "Testing & commissioning", "HVAC ducting",
  ],
  "electrical-engineering": [
    "Cable laying", "Conduit work", "Panel installation", "Earthing",
    "Lighting fixtures", "Testing",
  ],
  "chemical-engineering": [
    "Equipment supply", "Piping & instrumentation", "Insulation",
    "Civil foundations", "Commissioning",
  ],
  "mining-engineering": [
    "Drilling", "Blasting", "Haul road", "Ventilation equipment",
    "Safety systems",
  ],
  "railway-engineering": [
    "Track laying", "Ballast", "Sleepers", "Signalling equipment",
    "Station works",
  ],
  "renewable-energy": [
    "Solar panels", "Inverters", "Mounting structures", "Cabling",
    "Grid connection",
  ],
  "oil-gas-engineering": [
    "Pipeline laying", "Welding", "Coating", "Valve stations",
    "Testing & commissioning",
  ],
};

const DEFAULT_WORK_ITEMS = [
  "Site preparation", "Main works", "Finishing", "Testing",
  "Contingency allowance",
];

const buildTemplate = (
  discipline: (typeof DISCIPLINES)[number],
  estType: (typeof ESTIMATION_TYPES)[number]
): EstimateTemplate => ({
  id: `${discipline.id}--${estType.id}`,
  title: `${discipline.name} — ${estType.name}`,
  estimationType: estType.id,
  estimationTypeName: estType.name,
  disciplineId: discipline.id,
  disciplineName: discipline.name,
  suggestedWorkItems:
    DISCIPLINE_WORK_ITEMS[discipline.id] ?? DEFAULT_WORK_ITEMS,
  suggestedUnits: ["cum", "sqm", "m", "kg", "nos"],
  measurementMethods: [
    "From engineering drawings",
    "From site measurements",
    "From BOQ schedule",
    "Standard rate analysis",
  ],
});

export const ESTIMATE_TEMPLATES: EstimateTemplate[] = DISCIPLINES.flatMap(
  (discipline) => ESTIMATION_TYPES.map((type) => buildTemplate(discipline, type))
);

export const getEstimateTemplate = (id: string): EstimateTemplate | null =>
  ESTIMATE_TEMPLATES.find((t) => t.id === id) ?? null;

export const resolveEstimationType = (text: string): EstimationTypeId | null => {
  const normalized = text.toLowerCase();
  for (const type of ESTIMATION_TYPES) {
    if (
      normalized.includes(type.name.toLowerCase()) ||
      normalized.includes(type.id.replace(/-/g, " "))
    ) return type.id;
  }
  if (/boq|bill\s+of\s+quantities/i.test(normalized)) return "boq";
  if (/preliminary|rough/i.test(normalized)) return "preliminary";
  if (/detailed/i.test(normalized)) return "detailed";
  if (/budget/i.test(normalized)) return "budget";
  if (/material/i.test(normalized)) return "material";
  if (/labour|labor/i.test(normalized)) return "labour";
  if (/equipment/i.test(normalized)) return "equipment";
  if (/maintenance/i.test(normalized)) return "maintenance";
  return null;
};

export const formatLibrarySummary = (): string =>
  `Estimation Library: ${ESTIMATE_TEMPLATES.length} templates (${DISCIPLINES.length} disciplines × ${ESTIMATION_TYPES.length} types)`;

const STORAGE_KEY = "sarathi.estimation.estimates";
const ACTIVE_KEY = "sarathi.estimation.active";

let estimateStore: EngineeringEstimate[] = [];
let activeEstimateId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    estimateStore = raw ? (JSON.parse(raw) as EngineeringEstimate[]) : [];
    activeEstimateId = localStorage.getItem(ACTIVE_KEY);
  } catch {
    estimateStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estimateStore.slice(0, 100)));
  if (activeEstimateId) {
    localStorage.setItem(ACTIVE_KEY, activeEstimateId);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
};

export const createEstimate = (
  template: EstimateTemplate,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null,
  projectName: string | null
): EngineeringEstimate => {
  hydrate();
  const now = Date.now();
  const estimate: EngineeringEstimate = {
    id: crypto.randomUUID(),
    title: template.title,
    estimationType: template.estimationType,
    estimationTypeName: template.estimationTypeName,
    disciplineId: disciplineId ?? template.disciplineId,
    disciplineName: disciplineName ?? template.disciplineName,
    projectName,
    conversationId,
    items: template.suggestedWorkItems.slice(0, 6).map((desc, i) => ({
      id: crypto.randomUUID(),
      itemNo: `${i + 1}`,
      description: desc,
      unit: template.suggestedUnits[i % template.suggestedUnits.length],
      quantity: 0,
      rate: null,
      amount: null,
      category: "general",
      measurementMethod: template.measurementMethods[0],
      remarks: "Quantity to be measured",
    })),
    materialCost: 0,
    labourCost: 0,
    equipmentCost: 0,
    indirectCost: 0,
    contingencyPercent: 10,
    totalCost: 0,
    engineeringRemarks: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  estimateStore.unshift(estimate);
  activeEstimateId = estimate.id;
  persist();
  return estimate;
};

export const getActiveEstimate = (): EngineeringEstimate | null => {
  hydrate();
  if (!activeEstimateId) return null;
  return estimateStore.find((e) => e.id === activeEstimateId) ?? null;
};

export const updateEstimate = (estimate: EngineeringEstimate): void => {
  hydrate();
  const index = estimateStore.findIndex((e) => e.id === estimate.id);
  if (index >= 0) {
    estimateStore[index] = { ...estimate, updatedAt: Date.now() };
    persist();
  }
};

export const listEstimates = (): EngineeringEstimate[] => {
  hydrate();
  return estimateStore;
};

export const searchEstimateTemplates = (
  keyword: string,
  disciplineId?: string | null
): EstimateTemplate[] => {
  let templates = [...ESTIMATE_TEMPLATES];
  if (disciplineId) {
    templates = templates.filter((t) => t.disciplineId === disciplineId);
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    templates = templates.filter(
      (t) =>
        t.title.toLowerCase().includes(kw) ||
        t.estimationTypeName.toLowerCase().includes(kw)
    );
  }
  return templates.slice(0, 10);
};
