import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import type { AuditType, DisciplineChecklist, ReviewCriterion } from "./types";

const BASE_CRITERIA: ReviewCriterion[] = [
  { id: "completeness", label: "Completeness", category: "completeness", description: "All required sections, inputs, and deliverables present" },
  { id: "consistency", label: "Consistency", category: "consistency", description: "Internal consistency of values, units, and references" },
  { id: "technical", label: "Technical Issues", category: "technical-issue", description: "Engineering correctness and methodology" },
  { id: "missing-info", label: "Missing Information", category: "missing-information", description: "Gaps in data, assumptions, or supporting documents" },
  { id: "conflicts", label: "Conflicting Information", category: "conflicting-information", description: "Contradictions between sections or documents" },
  { id: "standards", label: "Standards References", category: "standards-reference", description: "Applicable codes and standards correctly cited" },
  { id: "best-practice", label: "Best Practices", category: "best-practice", description: "Alignment with industry best practices" },
  { id: "constructability", label: "Constructability", category: "constructability", description: "Buildability and site execution feasibility" },
  { id: "maintainability", label: "Maintainability", category: "maintainability", description: "Service life and maintenance considerations" },
  { id: "safety", label: "Safety", category: "safety", description: "Safety requirements and hazard controls" },
];

const AUDIT_TYPE_EXTRAS: Partial<Record<AuditType, ReviewCriterion[]>> = {
  "drawing-review": [
    { id: "drawing-scale", label: "Drawing Scale & Dimensions", category: "technical-issue", description: "Scales, dimensions, and annotation completeness" },
    { id: "drawing-title", label: "Title Block & Revision", category: "completeness", description: "Title block, revision history, and drawing number" },
  ],
  "boq-review": [
    { id: "boq-units", label: "BOQ Units & Descriptions", category: "consistency", description: "Item descriptions, units, and measurement rules" },
    { id: "boq-rates", label: "Rate Analysis Basis", category: "technical-issue", description: "Rate build-up and market justification" },
  ],
  "safety-audit": [
    { id: "hira", label: "HIRA / Risk Assessment", category: "safety", description: "Hazard identification and risk assessment completeness" },
    { id: "ppe", label: "PPE & Emergency", category: "safety", description: "PPE requirements and emergency procedures" },
  ],
  "qa-qc-audit": [
    { id: "itp", label: "ITP / Hold Points", category: "best-practice", description: "Inspection and test plan with hold/witness points" },
    { id: "ncr", label: "NCR Process", category: "best-practice", description: "Non-conformance reporting and closure process" },
  ],
};

const DISCIPLINE_EXTRAS: Partial<Record<string, ReviewCriterion[]>> = {
  "civil-engineering": [
    { id: "civil-structural", label: "Structural Adequacy", category: "technical-issue", description: "Structural design basis and load combinations" },
    { id: "civil-geotech", label: "Geotechnical Basis", category: "technical-issue", description: "Soil investigation and foundation design basis" },
  ],
  "mechanical-engineering": [
    { id: "mech-materials", label: "Material Selection", category: "technical-issue", description: "Material grades and compatibility" },
    { id: "mech-maintenance", label: "Maintainability Access", category: "maintainability", description: "Maintenance access and spare parts" },
  ],
  "electrical-engineering": [
    { id: "elec-protection", label: "Protection & Earthing", category: "safety", description: "Protection coordination and earthing design" },
    { id: "elec-load", label: "Load Calculations", category: "technical-issue", description: "Load schedule and diversity factors" },
  ],
  "chemical-engineering": [
    { id: "chem-process", label: "Process Safety", category: "safety", description: "HAZOP, P&ID consistency, relief systems" },
  ],
  "environmental-engineering": [
    { id: "env-impact", label: "Environmental Impact", category: "best-practice", description: "EIA compliance and mitigation measures" },
  ],
  "oil-gas-engineering": [
    { id: "og-safety", label: "Process Safety Management", category: "safety", description: "API/ASME compliance and safety systems" },
  ],
};

export const getDisciplineChecklist = (
  disciplineId: string | null,
  disciplineName: string | null,
  auditType: AuditType
): DisciplineChecklist | null => {
  const discipline =
    DISCIPLINE_DEFINITIONS.find((d) => d.id === disciplineId) ??
    DISCIPLINE_DEFINITIONS.find((d) => d.name === disciplineName);

  if (!discipline) {
    return {
      disciplineId: "general",
      disciplineName: disciplineName ?? "General Engineering",
      auditType,
      items: [...BASE_CRITERIA, ...(AUDIT_TYPE_EXTRAS[auditType] ?? [])],
    };
  }

  const items = [
    ...BASE_CRITERIA,
    ...(AUDIT_TYPE_EXTRAS[auditType] ?? []),
    ...(DISCIPLINE_EXTRAS[discipline.id] ?? []),
  ];

  return {
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    auditType,
    items,
  };
};

export const formatChecklistForPrompt = (
  checklist: DisciplineChecklist | null
): string => {
  if (!checklist) return "No discipline checklist available.";

  return [
    `Discipline: ${checklist.disciplineName}`,
    `Audit type: ${checklist.auditType}`,
    "Checklist items:",
    ...checklist.items.map(
      (item, index) =>
        `${index + 1}. [${item.category}] ${item.label}: ${item.description}`
    ),
  ].join("\n");
};

export const listSupportedDisciplines = (): string[] =>
  DISCIPLINE_DEFINITIONS.map((d) => d.name);
