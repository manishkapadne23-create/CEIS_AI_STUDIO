import { getWorkflowsByCategory } from "./workflowLibrary";
import { searchWorkflows as registrySearch } from "./workflowRegistry";
import { ALL_WORKFLOW_TEMPLATES } from "./workflowTemplates";
import { getBookmarkedWorkflows } from "./workflowTracker";
import type { WorkflowCategoryId, WorkflowTemplate } from "./types";

export interface WorkflowSearchQuery {
  keyword?: string;
  disciplineId?: string | null;
  category?: WorkflowCategoryId;
  favoritesOnly?: boolean;
  limit?: number;
}

export interface WorkflowSearchResult {
  query: WorkflowSearchQuery;
  workflows: WorkflowTemplate[];
  totalCount: number;
}

const resolveCategoryFromText = (text: string): WorkflowCategoryId | null => {
  const normalized = text.toLowerCase();
  if (/planning/i.test(normalized)) return "planning";
  if (/design/i.test(normalized)) return "design";
  if (/review/i.test(normalized)) return "review";
  if (/approval/i.test(normalized)) return "approval";
  if (/construction/i.test(normalized)) return "construction";
  if (/inspection/i.test(normalized)) return "inspection";
  if (/testing|test/i.test(normalized)) return "testing";
  if (/commission/i.test(normalized)) return "commissioning";
  if (/maintenance|mro/i.test(normalized)) return "maintenance";
  if (/procurement/i.test(normalized)) return "procurement";
  if (/qa|qc|quality/i.test(normalized)) return "qa-qc";
  if (/safety|hazop/i.test(normalized)) return "safety";
  if (/audit/i.test(normalized)) return "audit";
  if (/documentation|eia/i.test(normalized)) return "documentation";
  if (/tender/i.test(normalized)) return "tender";
  if (/contract/i.test(normalized)) return "contract";
  if (/claim/i.test(normalized)) return "claim";
  return null;
};

export const searchWorkflowCatalog = (
  query: WorkflowSearchQuery
): WorkflowSearchResult => {
  let workflows = [...ALL_WORKFLOW_TEMPLATES].filter((w) => w.enabled);

  if (query.disciplineId) {
    workflows = workflows.filter((w) => w.disciplineId === query.disciplineId);
  }

  if (query.category) {
    workflows = workflows.filter((w) => w.category === query.category);
  }

  if (query.favoritesOnly) {
    const bookmarked = new Set(getBookmarkedWorkflows().map((w) => w.id));
    workflows = workflows.filter((w) => bookmarked.has(w.id));
  }

  if (query.keyword) {
    workflows = registrySearch(query.keyword, query.disciplineId);
    if (query.category) {
      workflows = workflows.filter((w) => w.category === query.category);
    }
  }

  const limit = query.limit ?? 10;
  return {
    query,
    workflows: workflows.slice(0, limit),
    totalCount: workflows.length,
  };
};

export const searchFromMessage = (
  message: string,
  disciplineId: string | null
): WorkflowSearchResult => {
  const category = resolveCategoryFromText(message);
  const keywordMatch = message.match(
    /(?:search|find|list)\s+workflows?\s*(?:for\s+)?(.+?)(?:\s+in\s+|\s*$)/i
  );

  return searchWorkflowCatalog({
    keyword: keywordMatch?.[1]?.trim(),
    disciplineId: disciplineId ?? undefined,
    category: category ?? undefined,
    favoritesOnly: /\bbookmark|favorite/i.test(message),
    limit: 10,
  });
};

export const formatSearchResultsForPrompt = (
  result: WorkflowSearchResult
): string => {
  if (result.workflows.length === 0) {
    return "No workflows found. Try 'List workflows' or 'Start [workflow name] workflow'.";
  }

  const lines = result.workflows.map(
    (w, i) =>
      `${i + 1}. ${w.title} (${w.disciplineName}) — ${w.objective.slice(0, 80)}`
  );

  return [
    `Found ${result.totalCount} workflow(s):`,
    ...lines,
    "",
    'Say "Start [workflow name] workflow" to begin guided execution.',
  ].join("\n");
};

export const isWorkflowAutomationQuery = (message: string): boolean =>
  /\b(workflow|workflows|start\s+.+\s+workflow|pause\s+workflow|resume\s+workflow|restart\s+workflow|bookmark\s+workflow|share\s+workflow|workflow\s+report|next\s+step|complete\s+step|list\s+workflows?)\b/i.test(
    message
  );

export const getWorkflowsByCategoryId = (
  categoryId: WorkflowCategoryId
): WorkflowTemplate[] => getWorkflowsByCategory(categoryId);
