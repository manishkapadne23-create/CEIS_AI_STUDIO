import disciplineRegistry from "../knowledge/config/disciplineRegistry.json";
import { ALL_WORKFLOW_TEMPLATES } from "./workflowTemplates";
import type { WorkflowCategoryId, WorkflowTemplate } from "./types";

export const WORKFLOW_CATEGORIES: {
  id: WorkflowCategoryId;
  name: string;
}[] = [
  { id: "planning", name: "Planning Workflow" },
  { id: "design", name: "Design Workflow" },
  { id: "review", name: "Review Workflow" },
  { id: "approval", name: "Approval Workflow" },
  { id: "construction", name: "Construction Workflow" },
  { id: "inspection", name: "Inspection Workflow" },
  { id: "testing", name: "Testing Workflow" },
  { id: "commissioning", name: "Commissioning Workflow" },
  { id: "maintenance", name: "Maintenance Workflow" },
  { id: "procurement", name: "Procurement Workflow" },
  { id: "qa-qc", name: "QA/QC Workflow" },
  { id: "safety", name: "Safety Workflow" },
  { id: "audit", name: "Audit Workflow" },
  { id: "documentation", name: "Documentation Workflow" },
  { id: "tender", name: "Tender Workflow" },
  { id: "contract", name: "Contract Workflow" },
  { id: "claim", name: "Claim Workflow" },
];

export const getWorkflowLibrary = (): WorkflowTemplate[] =>
  ALL_WORKFLOW_TEMPLATES.filter((w) => w.enabled);

export const getLibraryStats = (): {
  totalWorkflows: number;
  disciplineCount: number;
  categoryCount: number;
} => {
  const disciplines = new Set(ALL_WORKFLOW_TEMPLATES.map((w) => w.disciplineId));
  return {
    totalWorkflows: ALL_WORKFLOW_TEMPLATES.length,
    disciplineCount: disciplines.size,
    categoryCount: WORKFLOW_CATEGORIES.length,
  };
};

export const listDisciplinesWithWorkflows = (): {
  id: string;
  name: string;
  workflowCount: number;
}[] =>
  disciplineRegistry.disciplines.map((discipline) => ({
    id: discipline.id,
    name: discipline.name,
    workflowCount: ALL_WORKFLOW_TEMPLATES.filter(
      (w) => w.disciplineId === discipline.id
    ).length,
  }));

export const getWorkflowsByCategory = (
  categoryId: WorkflowCategoryId
): WorkflowTemplate[] =>
  ALL_WORKFLOW_TEMPLATES.filter((w) => w.category === categoryId);

export const formatLibrarySummaryForPrompt = (): string => {
  const stats = getLibraryStats();
  return [
    `Engineering Workflow Library: ${stats.totalWorkflows} workflows`,
    `Disciplines: ${stats.disciplineCount}`,
    `Categories: ${stats.categoryCount}`,
  ].join(" | ");
};

export const formatWorkflowStructureForPrompt = (
  template: WorkflowTemplate
): string =>
  [
    `Workflow: ${template.title}`,
    `Category: ${template.category ?? "general"}`,
    `Objective: ${template.objective}`,
    `Scope: ${template.scope ?? template.overview}`,
    `Inputs: ${(template.inputs ?? template.prerequisites).join("; ")}`,
    `Steps: ${template.activities.length}`,
    `Standards: ${template.requiredStandards.join(", ")}`,
    `Documents: ${template.requiredDocuments.join(", ")}`,
    `Calculators: ${template.requiredCalculations.join(", ")}`,
    `Tools: ${template.professionalTools.join(", ")}`,
    `Quality: ${template.qualityChecks.join("; ")}`,
    `Safety: ${(template.safetyCheckpoints ?? []).join("; ")}`,
    `Deliverables: ${template.outputs.join(", ")}`,
  ].join("\n");
