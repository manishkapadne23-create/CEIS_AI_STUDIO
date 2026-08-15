import type {
  WorkflowAIAssistanceType,
  WorkflowCategoryId,
  WorkflowStepActivity,
  WorkflowTemplate,
} from "../types";

export interface WorkflowDefinitionInput {
  id: string;
  disciplineId: string;
  disciplineName: string;
  title: string;
  overview: string;
  objective: string;
  prerequisites: string[];
  activityTitles: Array<{
    title: string;
    description?: string;
    aiAssistance?: WorkflowAIAssistanceType[];
  }>;
  requiredDocuments: string[];
  requiredStandards: string[];
  requiredCalculations: string[];
  professionalTools: string[];
  outputs: string[];
  qualityChecks: string[];
  completionChecklist: string[];
  status?: WorkflowTemplate["status"];
  enabled?: boolean;
  category?: WorkflowCategoryId;
  scope?: string;
  inputs?: string[];
  safetyCheckpoints?: string[];
}

const inferWorkflowCategory = (title: string): WorkflowCategoryId => {
  const text = title.toLowerCase();
  if (/plan|layout|capacity|planning/i.test(text)) return "planning";
  if (/design|dpr|pavement|bridge|circuit|process/i.test(text)) return "design";
  if (/review|hazop|audit/i.test(text)) return "review";
  if (/approval|permit/i.test(text)) return "approval";
  if (/construction|installation/i.test(text)) return "construction";
  if (/inspection|survey|calibration/i.test(text)) return "inspection";
  if (/test|flight\s+test|fat|sat/i.test(text)) return "testing";
  if (/commission/i.test(text)) return "commissioning";
  if (/maintenance|mro|repair|drydock/i.test(text)) return "maintenance";
  if (/procurement|equipment/i.test(text)) return "procurement";
  if (/quality|qa|qc/i.test(text)) return "qa-qc";
  if (/safety|hazop|clinical\s+safety/i.test(text)) return "safety";
  if (/eia|environmental/i.test(text)) return "documentation";
  if (/tender/i.test(text)) return "tender";
  if (/contract/i.test(text)) return "contract";
  if (/claim/i.test(text)) return "claim";
  return "planning";
};

const DEFAULT_AI_ASSISTANCE: WorkflowAIAssistanceType[] = [
  "next-step",
  "suggest-standard",
  "generate-checklist",
  "create-report",
  "review-step",
];

export const buildWorkflowTemplate = (
  input: WorkflowDefinitionInput
): WorkflowTemplate => {
  const activities: WorkflowStepActivity[] = input.activityTitles.map(
    (activity, index) => ({
      id: `${input.id}-step-${index + 1}`,
      order: index + 1,
      title: activity.title,
      description:
        activity.description ??
        `Complete ${activity.title.toLowerCase()} as part of the ${input.title} workflow.`,
      requiredDocuments: input.requiredDocuments,
      requiredStandards: input.requiredStandards,
      requiredCalculations:
        index === input.activityTitles.length - 2
          ? input.requiredCalculations
          : input.requiredCalculations.slice(0, 2),
      professionalTools: input.professionalTools,
      outputs: index === input.activityTitles.length - 1 ? input.outputs : [],
      qualityChecks:
        index >= input.activityTitles.length - 2 ? input.qualityChecks : [],
      aiAssistance: activity.aiAssistance ?? DEFAULT_AI_ASSISTANCE,
    })
  );

  return {
    id: input.id,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    title: input.title,
    overview: input.overview,
    objective: input.objective,
    category: input.category ?? inferWorkflowCategory(input.title),
    scope: input.scope ?? input.overview,
    inputs: input.inputs ?? input.prerequisites,
    prerequisites: input.prerequisites,
    activities,
    requiredDocuments: input.requiredDocuments,
    requiredStandards: input.requiredStandards,
    requiredCalculations: input.requiredCalculations,
    professionalTools: input.professionalTools,
    outputs: input.outputs,
    qualityChecks: input.qualityChecks,
    safetyCheckpoints:
      input.safetyCheckpoints ??
      (inferWorkflowCategory(input.title) === "safety"
        ? input.qualityChecks
        : ["PPE compliance", "Hazard identification", "Emergency procedures"]),
    completionChecklist: input.completionChecklist,
    status: input.status ?? "available",
    enabled: input.enabled ?? true,
  };
};

export const formatWorkflowTemplateSummary = (
  template: WorkflowTemplate
): string => {
  const lines = [
    `Workflow: ${template.title}`,
    `Discipline: ${template.disciplineName}`,
    `Objective: ${template.objective}`,
    `Steps: ${template.activities.length}`,
    `Prerequisites: ${template.prerequisites.join("; ")}`,
    `Outputs: ${template.outputs.join("; ")}`,
  ];
  return lines.join("\n");
};
