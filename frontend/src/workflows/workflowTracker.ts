import { searchWorkflows } from "./workflowRegistry";
import { ALL_WORKFLOW_TEMPLATES } from "./workflowTemplates";
import { getWorkflowTemplate } from "./workflowRegistry";
import type { WorkflowTemplate } from "./types";

const BOOKMARKS_KEY = "sarathi.workflows.bookmarks";

let bookmarkedIds: Set<string> = new Set();
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    bookmarkedIds = new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    bookmarkedIds = new Set();
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarkedIds]));
};

export const bookmarkWorkflow = (workflowId: string): boolean => {
  hydrate();
  if (!getWorkflowTemplate(workflowId)) return false;
  bookmarkedIds.add(workflowId);
  persist();
  return true;
};

export const bookmarkWorkflowByTitle = (title: string): string | null => {
  const found = searchWorkflows(title)[0];
  if (!found) return null;
  bookmarkWorkflow(found.id);
  return `Bookmarked workflow: ${found.title}`;
};

export const getBookmarkedWorkflows = (): WorkflowTemplate[] => {
  hydrate();
  return ALL_WORKFLOW_TEMPLATES.filter((w) => bookmarkedIds.has(w.id));
};

export const shareWorkflow = (workflowId: string): string | null => {
  const template = getWorkflowTemplate(workflowId);
  if (!template) return null;
  return [
    `Engineering Workflow: ${template.title}`,
    `Discipline: ${template.disciplineName}`,
    `Objective: ${template.objective}`,
    `Steps: ${template.activities.length}`,
    `Start with: "Start ${template.title} workflow" in Sarathi AI`,
  ].join("\n");
};

export const shareWorkflowByTitle = (title: string): string | null => {
  const found = searchWorkflows(title)[0];
  if (!found) return null;
  return shareWorkflow(found.id);
};
