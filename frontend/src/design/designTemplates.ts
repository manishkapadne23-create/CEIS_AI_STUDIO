import type {
  DesignCategory,
  DesignDisciplineId,
  DesignStep,
  DesignStepId,
  DesignTemplate,
} from "./types";

export const DESIGN_PROCESS_STEPS: Omit<DesignStep, "requiredInputs" | "guidance">[] = [
  { id: "problem-definition", order: 1, title: "Problem Definition", description: "Define the engineering problem, scope and objectives." },
  { id: "design-criteria", order: 2, title: "Design Criteria", description: "Establish performance, safety and serviceability criteria." },
  { id: "input-parameters", order: 3, title: "Input Parameters", description: "Collect loads, materials, geometry and environmental data." },
  { id: "applicable-standards", order: 4, title: "Applicable Standards", description: "Identify codes, standards and regulatory requirements." },
  { id: "engineering-assumptions", order: 5, title: "Engineering Assumptions", description: "Document simplifying assumptions and boundary conditions." },
  { id: "design-methodology", order: 6, title: "Design Methodology", description: "Select design approach, methods and analysis procedures." },
  { id: "engineering-calculations", order: 7, title: "Engineering Calculations", description: "Perform required engineering calculations and analysis." },
  { id: "alternative-solutions", order: 8, title: "Alternative Solutions", description: "Evaluate design alternatives and trade-offs." },
  { id: "risk-considerations", order: 9, title: "Risk Considerations", description: "Identify design risks, uncertainties and mitigations." },
  { id: "design-validation", order: 10, title: "Design Validation", description: "Validate design against criteria and standards." },
  { id: "engineering-recommendations", order: 11, title: "Engineering Recommendations", description: "Provide professional engineering recommendations." },
  { id: "final-design-summary", order: 12, title: "Final Design Summary", description: "Summarize final design decisions and deliverables." },
];

const STEP_INPUTS: Record<DesignStepId, string[]> = {
  "problem-definition": ["Project scope", "Design objectives", "Constraints"],
  "design-criteria": ["Performance criteria", "Safety factors", "Serviceability limits"],
  "input-parameters": ["Loads", "Material properties", "Geometry", "Environmental data"],
  "applicable-standards": ["National codes", "Project specifications", "Client requirements"],
  "engineering-assumptions": ["Boundary conditions", "Simplifications", "Load combinations"],
  "design-methodology": ["Analysis method", "Software/tools", "Design approach"],
  "engineering-calculations": ["Calculation inputs", "Formulae references", "Results"],
  "alternative-solutions": ["Options considered", "Comparison criteria", "Selected option"],
  "risk-considerations": ["Identified risks", "Uncertainty factors", "Mitigation measures"],
  "design-validation": ["Check results", "Compliance statement", "Review comments"],
  "engineering-recommendations": ["Key recommendations", "Construction notes", "Future actions"],
  "final-design-summary": ["Design decisions", "Deliverables list", "Sign-off readiness"],
};

const STEP_GUIDANCE: Record<DesignStepId, string> = {
  "problem-definition": "Clearly state what needs to be designed and why.",
  "design-criteria": "Reference applicable codes for limit states and safety factors.",
  "input-parameters": "Request any missing loads, materials or site data from the user.",
  "applicable-standards": "Suggest IRC, IS, IEC, ASME or discipline-specific standards.",
  "engineering-assumptions": "Document all assumptions — undocumented assumptions are design risks.",
  "design-methodology": "Recommend analysis methods appropriate to the problem.",
  "engineering-calculations": "Recommend Sarathi calculators and show calculation steps.",
  "alternative-solutions": "Compare at least two viable design options where applicable.",
  "risk-considerations": "Warn about design limitations and failure modes.",
  "design-validation": "Cross-check results against design criteria and standards.",
  "engineering-recommendations": "Provide actionable professional recommendations.",
  "final-design-summary": "Produce a concise design summary suitable for review.",
};

export const DISCIPLINES: { id: DesignDisciplineId; name: string }[] = [
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

const DISCIPLINE_CATEGORIES: Record<DesignDisciplineId, { category: DesignCategory; designs: string[] }> = {
  "civil-engineering": { category: "structural", designs: ["Structural Design", "Foundation Design", "Highway Design", "Bridge Design"] },
  "mechanical-engineering": { category: "mechanical-systems", designs: ["Machine Design", "HVAC Design", "Pressure Vessel Design", "Piping Design"] },
  "electrical-engineering": { category: "electrical-systems", designs: ["Power System Design", "Lighting Design", "Cable Sizing", "Protection Design"] },
  "computer-engineering": { category: "software", designs: ["System Architecture", "Network Design", "Database Design", "API Design"] },
  "electronics-telecommunication-engineering": { category: "network", designs: ["Circuit Design", "PCB Design", "RF Design", "Network Planning"] },
  "chemical-engineering": { category: "process", designs: ["Process Design", "Reactor Design", "Distillation Design", "P&ID Design"] },
  "environmental-engineering": { category: "environmental", designs: ["Water Treatment Design", "Waste Management Design", "EIA Design", "Air Quality Design"] },
  "mining-engineering": { category: "mining", designs: ["Mine Planning Design", "Ventilation Design", "Slope Stability Design", "Haul Road Design"] },
  "marine-engineering": { category: "marine", designs: ["Hull Design", "Propulsion Design", "Marine Systems Design", "Offshore Structure Design"] },
  "railway-engineering": { category: "railway", designs: ["Track Design", "Signalling Design", "Station Design", "Rolling Stock Design"] },
  "aerospace-engineering": { category: "aerospace", designs: ["Aircraft Component Design", "Propulsion Design", "Avionics Design", "Structural Analysis Design"] },
  "industrial-engineering": { category: "industrial", designs: ["Plant Layout Design", "Production System Design", "Ergonomics Design", "Supply Chain Design"] },
  "automation-robotics": { category: "automation", designs: ["PLC System Design", "Robot Cell Design", "SCADA Design", "Control System Design"] },
  "renewable-energy": { category: "renewable", designs: ["Solar PV Design", "Wind Farm Design", "Battery Storage Design", "Grid Integration Design"] },
  "architecture-planning": { category: "architectural", designs: ["Building Design", "Urban Planning Design", "Interior Design", "Landscape Design"] },
  "agricultural-engineering": { category: "agricultural", designs: ["Irrigation Design", "Farm Machinery Design", "Greenhouse Design", "Post-Harvest Design"] },
  "oil-gas-engineering": { category: "oil-gas", designs: ["Pipeline Design", "Separator Design", "Wellhead Design", "Offshore Platform Design"] },
  "biomedical-engineering": { category: "biomedical", designs: ["Medical Device Design", "Prosthetics Design", "Imaging System Design", "Biomaterials Design"] },
};

const buildSteps = (): DesignStep[] =>
  DESIGN_PROCESS_STEPS.map((step) => ({
    ...step,
    requiredInputs: STEP_INPUTS[step.id],
    guidance: STEP_GUIDANCE[step.id],
  }));

const DISCIPLINE_STANDARDS: Partial<Record<DesignDisciplineId, string[]>> = {
  "civil-engineering": ["IRC", "IS:456", "IS:800", "IS:1893", "MoRTH"],
  "mechanical-engineering": ["ASME", "IS:2825", "API 650", "ASHRAE"],
  "electrical-engineering": ["IS:3043", "IEC 60364", "IEEE", "IE Rules"],
  "chemical-engineering": ["ASME", "API", "IS codes", "OSHA PSM"],
  "environmental-engineering": ["CPCB", "MoEFCC", "ISO 14001", "IS:10500"],
  "mining-engineering": ["DGMS", "Mine Rules", "ISO 45001"],
  "marine-engineering": ["SOLAS", "Class rules", "IMO"],
  "railway-engineering": ["RDSO", "IRS", "Indian Railways"],
  "aerospace-engineering": ["FAR/CS", "AS9100", "MIL-STD"],
  "renewable-energy": ["IEC 61400", "IEC 62446", "MNRE"],
  "oil-gas-engineering": ["ASME B31", "API", "NFPA"],
  "biomedical-engineering": ["ISO 13485", "IEC 60601", "ISO 14971"],
};

const buildTemplate = (
  discipline: (typeof DISCIPLINES)[number],
  designTitle: string
): DesignTemplate => {
  const config = DISCIPLINE_CATEGORIES[discipline.id];
  return {
    id: `${discipline.id}--${designTitle.toLowerCase().replace(/\s+/g, "-")}`,
    title: `${discipline.name} — ${designTitle}`,
    category: config.category,
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    description: `AI-assisted ${designTitle.toLowerCase()} guidance for ${discipline.name.toLowerCase()}.`,
    steps: buildSteps(),
    suggestedStandards: DISCIPLINE_STANDARDS[discipline.id] ?? ["Applicable national codes", "Project specifications"],
    suggestedCalculators: [`${designTitle} calculator`, "Unit conversion tools"],
    suggestedTools: ["Professional engineering tools", "Design checklists"],
    suggestedTemplates: ["Design report template", "Calculation sheet template"],
  };
};

export const DESIGN_TEMPLATES: DesignTemplate[] = DISCIPLINES.flatMap((discipline) =>
  DISCIPLINE_CATEGORIES[discipline.id].designs.map((design) =>
    buildTemplate(discipline, design)
  )
);

export const getDesignTemplate = (templateId: string): DesignTemplate | null =>
  DESIGN_TEMPLATES.find((t) => t.id === templateId) ?? null;

export const findDesignTemplate = (query: string): DesignTemplate | null => {
  const normalized = query.toLowerCase();
  return (
    DESIGN_TEMPLATES.find(
      (t) =>
        t.title.toLowerCase().includes(normalized) ||
        t.description.toLowerCase().includes(normalized)
    ) ?? null
  );
};

export const listTemplatesForDiscipline = (
  disciplineId: string
): DesignTemplate[] =>
  DESIGN_TEMPLATES.filter((t) => t.disciplineId === disciplineId);

export const formatLibrarySummary = (): string =>
  `Design Wizard Library: ${DESIGN_TEMPLATES.length} design templates across ${DISCIPLINES.length} disciplines, ${DESIGN_PROCESS_STEPS.length} steps per design`;

export const resolveCategoryFromText = (text: string): DesignCategory | null => {
  const normalized = text.toLowerCase();
  if (/structural|bridge|foundation/i.test(normalized)) return "structural";
  if (/geotechnical|soil/i.test(normalized)) return "geotechnical";
  if (/highway|transport/i.test(normalized)) return "transportation";
  if (/hydraulic|water/i.test(normalized)) return "hydraulic";
  if (/mechanical|hvac|machine/i.test(normalized)) return "mechanical-systems";
  if (/electrical|power|cable/i.test(normalized)) return "electrical-systems";
  if (/process|chemical/i.test(normalized)) return "process";
  if (/solar|wind|renewable/i.test(normalized)) return "renewable";
  if (/pipeline|oil|gas/i.test(normalized)) return "oil-gas";
  if (/biomedical|medical/i.test(normalized)) return "biomedical";
  return null;
};
