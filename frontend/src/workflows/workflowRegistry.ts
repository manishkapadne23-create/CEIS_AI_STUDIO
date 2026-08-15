import disciplineRegistry from "../knowledge/config/disciplineRegistry.json";
import { ALL_WORKFLOW_TEMPLATES } from "./workflowTemplates";
import type { WorkflowTemplate } from "./types";

const templateMap = ALL_WORKFLOW_TEMPLATES.reduce<
  Record<string, WorkflowTemplate>
>((accumulator, template) => {
  accumulator[template.id] = template;
  return accumulator;
}, {});

const byDisciplineMap = ALL_WORKFLOW_TEMPLATES.reduce<
  Record<string, WorkflowTemplate[]>
>((accumulator, template) => {
  if (!accumulator[template.disciplineId]) {
    accumulator[template.disciplineId] = [];
  }
  accumulator[template.disciplineId].push(template);
  return accumulator;
}, {});

export const getWorkflowTemplate = (
  workflowId: string
): WorkflowTemplate | null => templateMap[workflowId] ?? null;

export const getWorkflowsForDiscipline = (
  disciplineId: string | null,
  disciplineName?: string | null
): WorkflowTemplate[] => {
  if (disciplineId && byDisciplineMap[disciplineId]) {
    return byDisciplineMap[disciplineId];
  }

  if (disciplineName) {
    const match = disciplineRegistry.disciplines.find(
      (discipline) =>
        discipline.name.toLowerCase() === disciplineName.toLowerCase()
    );
    if (match) return byDisciplineMap[match.id] ?? [];
  }

  return [];
};

export const listAllWorkflowTemplates = (): WorkflowTemplate[] =>
  ALL_WORKFLOW_TEMPLATES;

export const listDisciplineIdsWithWorkflows = (): string[] =>
  Object.keys(byDisciplineMap);

export const searchWorkflows = (
  query: string,
  disciplineId?: string | null
): WorkflowTemplate[] => {
  const normalized = query.trim().toLowerCase();
  const pool = disciplineId
    ? getWorkflowsForDiscipline(disciplineId)
    : ALL_WORKFLOW_TEMPLATES;

  if (!normalized) return pool;

  return pool.filter(
    (workflow) =>
      workflow.title.toLowerCase().includes(normalized) ||
      workflow.overview.toLowerCase().includes(normalized) ||
      workflow.objective.toLowerCase().includes(normalized)
  );
};

export const resolveWorkflowFromMessage = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null
): WorkflowTemplate | null => {
  const normalized = message.trim().toLowerCase();
  const workflows = getWorkflowsForDiscipline(disciplineId, disciplineName);

  const startPatterns = [
    /start\s+(.+?)\s+workflow/i,
    /begin\s+(.+?)\s+workflow/i,
    /open\s+(.+?)\s+workflow/i,
  ];

  for (const pattern of startPatterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const query = match[1].trim();
      const found = searchWorkflows(query, disciplineId)[0];
      if (found) return found;
    }
  }

  return (
    workflows.find(
      (workflow) =>
        normalized.includes(workflow.title.toLowerCase()) ||
        normalized.includes(workflow.id.replace(/-/g, " "))
    ) ?? null
  );
};
