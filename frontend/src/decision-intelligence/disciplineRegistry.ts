export interface DecisionDisciplineDefinition {
  id: string;
  name: string;
  slug: string;
  decisionCriteria: string[];
  comparisonFocus: string[];
}

export const DECISION_DISCIPLINES: DecisionDisciplineDefinition[] = [
  {
    id: "civil-engineering",
    name: "Civil Engineering",
    slug: "civil",
    decisionCriteria: ["Structural safety", "Durability", "Constructability", "Life-cycle cost"],
    comparisonFocus: ["materials", "construction-methods", "design-alternatives"],
  },
  {
    id: "mechanical-engineering",
    name: "Mechanical Engineering",
    slug: "mechanical",
    decisionCriteria: ["Performance", "Efficiency", "Maintainability", "Safety"],
    comparisonFocus: ["equipment", "technologies", "materials"],
  },
  {
    id: "electrical-engineering",
    name: "Electrical Engineering",
    slug: "electrical",
    decisionCriteria: ["Reliability", "Protection", "Efficiency", "Compliance"],
    comparisonFocus: ["equipment", "standards", "technologies"],
  },
  {
    id: "computer-engineering",
    name: "Computer Engineering",
    slug: "computer",
    decisionCriteria: ["Scalability", "Security", "Performance", "Maintainability"],
    comparisonFocus: ["software", "technologies", "design-alternatives"],
  },
  {
    id: "electronics-telecommunication-engineering",
    name: "Electronics & Telecommunication",
    slug: "electronics",
    decisionCriteria: ["Signal integrity", "Bandwidth", "Reliability", "Standards compliance"],
    comparisonFocus: ["equipment", "technologies", "standards"],
  },
  {
    id: "chemical-engineering",
    name: "Chemical Engineering",
    slug: "chemical",
    decisionCriteria: ["Process safety", "Yield", "Environmental impact", "Operability"],
    comparisonFocus: ["technologies", "equipment", "materials"],
  },
  {
    id: "environmental-engineering",
    name: "Environmental Engineering",
    slug: "environmental",
    decisionCriteria: ["Environmental compliance", "Treatment efficiency", "Sustainability", "Risk"],
    comparisonFocus: ["technologies", "standards", "design-alternatives"],
  },
  {
    id: "mining-engineering",
    name: "Mining Engineering",
    slug: "mining",
    decisionCriteria: ["Safety", "Recovery", "Ground stability", "Economics"],
    comparisonFocus: ["construction-methods", "equipment", "technologies"],
  },
  {
    id: "marine-engineering",
    name: "Marine Engineering",
    slug: "marine",
    decisionCriteria: ["Seaworthiness", "Corrosion resistance", "Operational safety", "Regulatory compliance"],
    comparisonFocus: ["materials", "equipment", "standards"],
  },
  {
    id: "railway-engineering",
    name: "Railway Engineering",
    slug: "railway",
    decisionCriteria: ["Safety", "Capacity", "Maintainability", "Standards compliance"],
    comparisonFocus: ["design-alternatives", "construction-methods", "standards"],
  },
  {
    id: "aerospace-engineering",
    name: "Aerospace Engineering",
    slug: "aerospace",
    decisionCriteria: ["Weight", "Reliability", "Certification", "Performance"],
    comparisonFocus: ["materials", "technologies", "design-alternatives"],
  },
  {
    id: "industrial-engineering",
    name: "Industrial Engineering",
    slug: "industrial",
    decisionCriteria: ["Productivity", "Quality", "Cost", "Ergonomics"],
    comparisonFocus: ["technologies", "equipment", "software"],
  },
  {
    id: "automation-robotics",
    name: "Automation & Robotics",
    slug: "automation",
    decisionCriteria: ["Automation level", "Integration", "Safety", "ROI"],
    comparisonFocus: ["technologies", "equipment", "software"],
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy",
    slug: "renewable",
    decisionCriteria: ["Energy yield", "Grid integration", "Life-cycle cost", "Environmental benefit"],
    comparisonFocus: ["technologies", "equipment", "design-alternatives"],
  },
  {
    id: "architecture-planning",
    name: "Architecture & Planning",
    slug: "architecture",
    decisionCriteria: ["Functionality", "Aesthetics", "Sustainability", "Constructability"],
    comparisonFocus: ["materials", "design-alternatives", "standards"],
  },
  {
    id: "agricultural-engineering",
    name: "Agricultural Engineering",
    slug: "agricultural",
    decisionCriteria: ["Productivity", "Water efficiency", "Durability", "Cost"],
    comparisonFocus: ["equipment", "technologies", "materials"],
  },
  {
    id: "oil-gas-engineering",
    name: "Oil & Gas Engineering",
    slug: "oilgas",
    decisionCriteria: ["Process safety", "Integrity", "Production efficiency", "Environmental compliance"],
    comparisonFocus: ["equipment", "technologies", "standards"],
  },
  {
    id: "biomedical-engineering",
    name: "Biomedical Engineering",
    slug: "biomedical",
    decisionCriteria: ["Biocompatibility", "Safety", "Regulatory compliance", "Clinical efficacy"],
    comparisonFocus: ["materials", "technologies", "standards"],
  },
];

export const getDecisionDiscipline = (
  disciplineId: string | null
): DecisionDisciplineDefinition | null =>
  disciplineId
    ? DECISION_DISCIPLINES.find((discipline) => discipline.id === disciplineId) ?? null
    : null;

export const getDecisionCriteriaForDiscipline = (
  disciplineId: string | null
): string[] =>
  getDecisionDiscipline(disciplineId)?.decisionCriteria ?? [
    "Technical feasibility",
    "Economic viability",
    "Safety",
    "Constructability",
    "Maintainability",
    "Environmental impact",
    "Risk",
    "Life-cycle perspective",
  ];
