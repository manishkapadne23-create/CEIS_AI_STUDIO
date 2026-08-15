import type {
  DocumentTypeId,
  EngineeringTemplate,
  TemplateCategory,
  TemplateDisciplineId,
} from "./types";

export const DISCIPLINES: { id: TemplateDisciplineId; name: string }[] = [
  { id: "civil-engineering", name: "Civil Engineering" },
  { id: "mechanical-engineering", name: "Mechanical Engineering" },
  { id: "electrical-engineering", name: "Electrical Engineering" },
  { id: "computer-engineering", name: "Computer Engineering" },
  {
    id: "electronics-telecommunication-engineering",
    name: "Electronics & Telecommunication",
  },
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

export const DOCUMENT_TYPES: {
  id: DocumentTypeId;
  name: string;
  category: TemplateCategory;
  sections: string[];
}[] = [
  {
    id: "technical-report",
    name: "Technical Report",
    category: "report",
    sections: [
      "Executive Summary",
      "Introduction",
      "Scope",
      "Methodology",
      "Findings",
      "Conclusions",
      "Recommendations",
      "References",
    ],
  },
  {
    id: "inspection-report",
    name: "Inspection Report",
    category: "report",
    sections: [
      "Inspection Details",
      "Scope of Inspection",
      "Observations",
      "Non-Conformities",
      "Recommendations",
      "Sign-off",
    ],
  },
  {
    id: "site-visit-report",
    name: "Site Visit Report",
    category: "report",
    sections: [
      "Visit Details",
      "Site Conditions",
      "Work Progress",
      "Issues Observed",
      "Action Items",
      "Photographs Log",
    ],
  },
  {
    id: "survey-report",
    name: "Survey Report",
    category: "report",
    sections: [
      "Survey Objectives",
      "Equipment Used",
      "Survey Methodology",
      "Data Processing",
      "Results",
      "Accuracy Statement",
      "Annexures",
    ],
  },
  {
    id: "investigation-report",
    name: "Investigation Report",
    category: "report",
    sections: [
      "Background",
      "Investigation Scope",
      "Data Collection",
      "Analysis",
      "Root Cause",
      "Conclusions",
      "Corrective Actions",
    ],
  },
  {
    id: "design-report",
    name: "Design Report",
    category: "report",
    sections: [
      "Design Basis",
      "Design Criteria",
      "Calculations Summary",
      "Design Drawings Index",
      "Material Specifications",
      "Compliance Statement",
    ],
  },
  {
    id: "calculation-sheet",
    name: "Calculation Sheet",
    category: "calculation",
    sections: [
      "Input Data",
      "Design Assumptions",
      "Formulae & References",
      "Step-by-step Calculations",
      "Results Summary",
      "Checker Comments",
    ],
  },
  {
    id: "method-statement",
    name: "Method Statement",
    category: "planning",
    sections: [
      "Work Description",
      "Resources",
      "Sequence of Operations",
      "Safety Measures",
      "Quality Controls",
      "Environmental Controls",
    ],
  },
  {
    id: "work-procedure",
    name: "Work Procedure",
    category: "planning",
    sections: [
      "Purpose",
      "Scope",
      "Responsibilities",
      "Procedure Steps",
      "Records",
      "Related Documents",
    ],
  },
  {
    id: "quality-plan",
    name: "Quality Plan",
    category: "planning",
    sections: [
      "Quality Objectives",
      "Inspection & Test Plan",
      "Hold Points",
      "Documentation Requirements",
      "Non-Conformance Procedure",
      "Audit Schedule",
    ],
  },
  {
    id: "inspection-checklist",
    name: "Inspection Checklist",
    category: "checklist",
    sections: [
      "Checklist Header",
      "Pre-Inspection",
      "Inspection Items",
      "Measurements",
      "Acceptance Criteria",
      "Inspector Sign-off",
    ],
  },
  {
    id: "safety-checklist",
    name: "Safety Checklist",
    category: "checklist",
    sections: [
      "Work Activity",
      "Hazard Identification",
      "PPE Requirements",
      "Safety Controls",
      "Emergency Procedures",
      "Supervisor Approval",
    ],
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment",
    category: "planning",
    sections: [
      "Activity Description",
      "Hazard Register",
      "Risk Matrix",
      "Control Measures",
      "Residual Risk",
      "Review Schedule",
    ],
  },
  {
    id: "boq",
    name: "BOQ",
    category: "commercial",
    sections: [
      "Project Information",
      "Bill of Quantities Table",
      "Unit Rates",
      "Summary",
      "Notes & Assumptions",
    ],
  },
  {
    id: "estimate",
    name: "Estimate",
    category: "commercial",
    sections: [
      "Estimate Summary",
      "Cost Breakdown",
      "Assumptions",
      "Exclusions",
      "Validity Period",
    ],
  },
  {
    id: "material-approval",
    name: "Material Approval",
    category: "commercial",
    sections: [
      "Material Description",
      "Supplier Details",
      "Test Certificates",
      "Compliance with Specifications",
      "Approval Recommendation",
    ],
  },
  {
    id: "vendor-evaluation",
    name: "Vendor Evaluation",
    category: "commercial",
    sections: [
      "Vendor Profile",
      "Evaluation Criteria",
      "Scoring Matrix",
      "Technical Assessment",
      "Commercial Assessment",
      "Recommendation",
    ],
  },
  {
    id: "meeting-minutes",
    name: "Meeting Minutes",
    category: "communication",
    sections: [
      "Meeting Details",
      "Attendees",
      "Agenda",
      "Discussion Points",
      "Decisions",
      "Action Items",
    ],
  },
  {
    id: "technical-note",
    name: "Technical Note",
    category: "communication",
    sections: [
      "Subject",
      "Background",
      "Technical Discussion",
      "Conclusion",
      "Distribution List",
    ],
  },
  {
    id: "project-proposal",
    name: "Project Proposal",
    category: "proposal",
    sections: [
      "Executive Summary",
      "Project Overview",
      "Technical Approach",
      "Deliverables",
      "Timeline",
      "Budget Estimate",
    ],
  },
  {
    id: "consultancy-proposal",
    name: "Consultancy Proposal",
    category: "proposal",
    sections: [
      "Firm Profile",
      "Understanding of Requirements",
      "Scope of Services",
      "Team Composition",
      "Fee Proposal",
      "Terms & Conditions",
    ],
  },
  {
    id: "presentation-summary",
    name: "Presentation Summary",
    category: "communication",
    sections: [
      "Presentation Title",
      "Key Messages",
      "Slide Summary",
      "Q&A Notes",
      "Follow-up Actions",
    ],
  },
  {
    id: "training-material",
    name: "Training Material",
    category: "communication",
    sections: [
      "Learning Objectives",
      "Course Outline",
      "Module Content",
      "Exercises",
      "Assessment",
      "References",
    ],
  },
  {
    id: "technical-sop",
    name: "Technical SOP",
    category: "procedure",
    sections: [
      "Document Control",
      "Purpose & Scope",
      "Definitions",
      "Procedure",
      "Records",
      "Revision History",
    ],
  },
];

const buildTemplate = (
  discipline: (typeof DISCIPLINES)[number],
  docType: (typeof DOCUMENT_TYPES)[number]
): EngineeringTemplate => ({
  id: `${discipline.id}--${docType.id}`,
  title: `${discipline.name} — ${docType.name}`,
  documentTypeId: docType.id,
  documentTypeName: docType.name,
  disciplineId: discipline.id,
  disciplineName: discipline.name,
  category: docType.category,
  description: `Professional ${docType.name.toLowerCase()} template for ${discipline.name.toLowerCase()} projects.`,
  sections: docType.sections,
  standardsHints: [
    `Applicable ${discipline.name} standards`,
    "Project-specific specifications",
    "National building/regulatory codes",
  ],
  usageCount: 0,
});

export const TEMPLATE_LIBRARY: EngineeringTemplate[] = DISCIPLINES.flatMap(
  (discipline) => DOCUMENT_TYPES.map((docType) => buildTemplate(discipline, docType))
);

export const getTemplateById = (templateId: string): EngineeringTemplate | null =>
  TEMPLATE_LIBRARY.find((t) => t.id === templateId) ?? null;

export const findTemplateByTitle = (
  title: string
): EngineeringTemplate | null => {
  const normalized = title.toLowerCase();
  return (
    TEMPLATE_LIBRARY.find(
      (t) =>
        t.title.toLowerCase().includes(normalized) ||
        t.documentTypeName.toLowerCase().includes(normalized)
    ) ?? null
  );
};

export const listTemplatesForDiscipline = (
  disciplineId: string
): EngineeringTemplate[] =>
  TEMPLATE_LIBRARY.filter((t) => t.disciplineId === disciplineId);

export const resolveDocumentTypeFromText = (
  text: string
): DocumentTypeId | null => {
  const normalized = text.toLowerCase();
  for (const docType of DOCUMENT_TYPES) {
    if (
      normalized.includes(docType.name.toLowerCase()) ||
      normalized.includes(docType.id.replace(/-/g, " "))
    ) {
      return docType.id;
    }
  }
  if (/inspection/i.test(normalized)) return "inspection-report";
  if (/site\s+visit/i.test(normalized)) return "site-visit-report";
  if (/survey/i.test(normalized)) return "survey-report";
  if (/design/i.test(normalized)) return "design-report";
  if (/calculation/i.test(normalized)) return "calculation-sheet";
  if (/method\s+statement/i.test(normalized)) return "method-statement";
  if (/checklist/i.test(normalized)) return "inspection-checklist";
  if (/risk/i.test(normalized)) return "risk-assessment";
  if (/boq|bill\s+of\s+quantities/i.test(normalized)) return "boq";
  if (/proposal/i.test(normalized)) return "project-proposal";
  if (/minutes/i.test(normalized)) return "meeting-minutes";
  if (/sop|procedure/i.test(normalized)) return "technical-sop";
  return null;
};

export const formatLibrarySummaryForPrompt = (): string =>
  [
    `Template Library: ${TEMPLATE_LIBRARY.length} templates`,
    `Disciplines: ${DISCIPLINES.length}`,
    `Document Types: ${DOCUMENT_TYPES.length}`,
  ].join(" | ");
