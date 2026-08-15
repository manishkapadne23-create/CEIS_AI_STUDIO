export interface EngineeringTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "available" | "coming-soon";
}

export const ENGINEERING_TEMPLATES: EngineeringTemplate[] = [
  {
    id: "dpr-template",
    title: "Detailed Project Report (DPR)",
    description:
      "Structured DPR outline for highway and infrastructure schemes.",
    category: "Reports",
    status: "available",
  },
  {
    id: "design-basis",
    title: "Design Basis Report",
    description: "Design assumptions, codes, and criteria documentation.",
    category: "Design",
    status: "available",
  },
  {
    id: "site-inspection",
    title: "Site Inspection Checklist",
    description: "Field inspection checklist for construction supervision.",
    category: "Checklists",
    status: "available",
  },
  {
    id: "boq-template",
    title: "Bill of Quantities (BoQ)",
    description: "Standard BoQ worksheet for civil engineering estimates.",
    category: "Estimation",
    status: "available",
  },
  {
    id: "qa-qc-plan",
    title: "QA/QC Plan",
    description: "Quality assurance and quality control plan template.",
    category: "Quality",
    status: "coming-soon",
  },
  {
    id: "method-statement",
    title: "Method Statement",
    description: "Construction method statement starter for major works.",
    category: "Construction",
    status: "coming-soon",
  },
];
