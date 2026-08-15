import type { EngineeringRecommendation } from "./types";

const DISCIPLINE_RECOMMENDATIONS: Record<string, EngineeringRecommendation[]> = {
  "civil-engineering": [
    { category: "standard", title: "IS 456 — Concrete Design", description: "Essential for RCC design work", action: "Open Standards: IS 456" },
    { category: "calculator", title: "Beam Design Calculator", description: "Quick flexural design checks", action: "Open Calculator: Beam Design" },
    { category: "template", title: "Structural Design Report", description: "Standard report format", action: "Generate Report: Structural Design" },
    { category: "workflow", title: "Bridge Design Workflow", description: "Step-by-step bridge design", action: "Start workflow: Bridge Design" },
  ],
  "mechanical-engineering": [
    { category: "standard", title: "ASME B31.3 — Piping", description: "Process piping design code", action: "Open Standards: ASME B31.3" },
    { category: "calculator", title: "Heat Exchanger Sizing", description: "Thermal design calculations", action: "Open Calculator: Heat Exchanger" },
    { category: "template", title: "Equipment Datasheet", description: "Mechanical equipment documentation", action: "Search templates: Equipment Datasheet" },
    { category: "workflow", title: "HVAC Design Workflow", description: "Building services design process", action: "Start workflow: HVAC Design" },
  ],
  "electrical-engineering": [
    { category: "standard", title: "IEC 60364 — Electrical Installations", description: "Low voltage installation standards", action: "Open Standards: IEC 60364" },
    { category: "calculator", title: "Cable Sizing Calculator", description: "Conductor ampacity and voltage drop", action: "Open Calculator: Cable Sizing" },
    { category: "tool", title: "Load Flow Analysis", description: "Power system analysis tool", action: "Open professional tool: Load Flow" },
    { category: "learning", title: "Power Systems Fundamentals", description: "NPTEL course recommendation", action: "Learning roadmap: 90-day electrical" },
  ],
};

const GENERAL_RECOMMENDATIONS: EngineeringRecommendation[] = [
  { category: "standard", title: "ISO 9001 — Quality Management", description: "QA/QC framework for engineering deliverables", action: "Open Standards: ISO 9001" },
  { category: "calculator", title: "Unit Converter", description: "Engineering unit conversions", action: "Open Calculator: Unit Converter" },
  { category: "tool", title: "Decision Support Engine", description: "Compare engineering alternatives", action: "Ask: Compare design options" },
  { category: "learning", title: "AI Mentor — Skill Development", description: "Personalized career guidance", action: "Start mentor: Career growth" },
  { category: "template", title: "Technical Report Template", description: "Standard engineering report format", action: "Search templates: Technical Report" },
  { category: "workflow", title: "Design Review Workflow", description: "Structured design verification", action: "Start workflow: Design Review" },
];

export const getRecommendations = (
  disciplineId: string | null,
  disciplineName: string | null
): EngineeringRecommendation[] => {
  const specific = disciplineId ? DISCIPLINE_RECOMMENDATIONS[disciplineId] ?? [] : [];
  const byName = disciplineName
    ? Object.entries(DISCIPLINE_RECOMMENDATIONS).find(([key]) =>
        disciplineName.toLowerCase().includes(key.replace(/-/g, " ").split(" ")[0])
      )?.[1] ?? []
    : [];
  const combined = [...specific, ...byName, ...GENERAL_RECOMMENDATIONS];
  const seen = new Set<string>();
  return combined.filter((r) => {
    if (seen.has(r.title)) return false;
    seen.add(r.title);
    return true;
  }).slice(0, 8);
};

export const formatRecommendations = (
  recommendations: EngineeringRecommendation[]
): string =>
  [
    "ENGINEERING INSIGHTS — Recommendations",
    "",
    ...recommendations.map(
      (r, i) =>
        [
          `${i + 1}. [${r.category.toUpperCase()}] ${r.title}`,
          `   ${r.description}`,
          `   → ${r.action}`,
        ].join("\n")
    ),
  ].join("\n\n");

export const getSuggestedStandards = (disciplineName: string | null): string[] => {
  const d = (disciplineName ?? "").toLowerCase();
  if (/civil|structural/i.test(d)) return ["IS 456", "IS 800", "IS 1893", "IRC codes"];
  if (/mechanical/i.test(d)) return ["ASME B31.3", "ASME VIII", "API 650", "ISO 12100"];
  if (/electrical/i.test(d)) return ["IEC 60364", "IEEE 1584", "IS 3043", "NFPA 70"];
  if (/computer/i.test(d)) return ["ISO 27001", "IEEE 829", "OWASP Top 10"];
  return ["ISO 9001", "ISO 14001", "ISO 45001", "Project-specific codes"];
};

export const getSuggestedCalculators = (disciplineName: string | null): string[] => {
  const d = (disciplineName ?? "").toLowerCase();
  if (/civil/i.test(d)) return ["Beam Design", "Column Design", "Retaining Wall", "Foundation"];
  if (/mechanical/i.test(d)) return ["Heat Exchanger", "Pump Sizing", "Pressure Vessel", "Pipe Flow"];
  if (/electrical/i.test(d)) return ["Cable Sizing", "Voltage Drop", "Short Circuit", "Transformer"];
  return ["Unit Converter", "Material Properties", "Load Calculator"];
};

export const formatInsightsSummary = (
  disciplineId: string | null,
  disciplineName: string | null
): string =>
  [
    "ENGINEERING INSIGHTS",
    `Discipline: ${disciplineName ?? "General Engineering"}`,
    "",
    "Suggested Standards:",
    ...getSuggestedStandards(disciplineName).map((s) => `- ${s}`),
    "",
    "Suggested Calculators:",
    ...getSuggestedCalculators(disciplineName).map((c) => `- ${c}`),
    "",
    formatRecommendations(getRecommendations(disciplineId, disciplineName)),
  ].join("\n");
