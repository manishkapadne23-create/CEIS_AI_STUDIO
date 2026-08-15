import {
  createEngineeringProject,
  findProjectByName,
  getActiveProject,
  listEngineeringProjects,
  resolveProjectFromMessage,
  setActiveProject,
} from "./projectManager";
import {
  bindConversationToProject,
  formatProjectMemorySummary,
  getProjectMemory,
  recordProjectRecommendations,
  recordProjectStandards,
  saveItemToProject,
} from "./projectMemory";
import {
  formatProjectDashboardSummary,
  getActiveProjectDashboard,
} from "./projectDashboard";
import { searchWithinProject } from "./projectSearch";
import type { CopilotSuggestion } from "../copilot/types";
import type { EngineeringProject } from "./types";

export interface HandleProjectMessageResult {
  project: EngineeringProject | null;
  created: boolean;
  switched: boolean;
  dashboardSummary: string | null;
  memorySummary: string | null;
  searchQuery: string | null;
}

export const handleProjectMessage = (
  message: string,
  context: {
    conversationId: string;
    disciplineId?: string | null;
    disciplineName?: string | null;
    chatTitle?: string;
    lastMessagePreview?: string;
  }
): HandleProjectMessageResult => {
  let project = getActiveProject();
  let created = false;
  let switched = false;

  const createInput = resolveProjectFromMessage(message);
  if (createInput) {
    const existing = findProjectByName(createInput.name);
    if (existing) {
      project = setActiveProject(existing.id);
      switched = true;
    } else {
      project = createEngineeringProject({
        ...createInput,
        disciplineId: context.disciplineId,
        disciplineName: context.disciplineName,
      });
      created = true;
    }
  }

  const listMatch = message.match(/list\s+projects?/i);
  if (listMatch) {
    return {
      project,
      created,
      switched,
      dashboardSummary: null,
      memorySummary: formatProjectsListSummary(),
      searchQuery: null,
    };
  }

  const searchMatch = message.match(
    /search\s+project\s+(?:for\s+)?(.+)/i
  );
  if (searchMatch?.[1] && project) {
    const query = searchMatch[1].trim();
    const results = searchWithinProject(project.id, query);
    return {
      project,
      created,
      switched,
      dashboardSummary: null,
      memorySummary: formatProjectSearchResults(results, query),
      searchQuery: query,
    };
  }

  if (project && context.conversationId) {
    bindConversationToProject({
      projectId: project.id,
      conversationId: context.conversationId,
      title: context.chatTitle ?? "AI Chat",
      lastMessagePreview: context.lastMessagePreview ?? message.slice(0, 120),
    });
  }

  const dashboard = project ? getActiveProjectDashboard() : null;

  return {
    project,
    created,
    switched,
    dashboardSummary: dashboard
      ? formatProjectDashboardSummary(dashboard)
      : null,
    memorySummary: project
      ? formatProjectMemorySummary(project.name, getProjectMemory(project.id))
      : null,
    searchQuery: null,
  };
};

const formatProjectsListSummary = (): string => {
  const projects = listEngineeringProjects();
  if (projects.length === 0) {
    return "No engineering projects yet. Say 'Create project [name]' to start.";
  }
  return [
    "Your engineering projects:",
    ...projects.map(
      (p) => `  • ${p.name} (${p.projectType}) — ${p.location ?? "location TBD"}`
    ),
  ].join("\n");
};

const formatProjectSearchResults = (
  results: ReturnType<typeof searchWithinProject>,
  query: string
): string => {
  if (results.length === 0) {
    return `No project results found for "${query}".`;
  }
  return [
    `Project search results for "${query}":`,
    ...results.slice(0, 8).map((r) => `  • [${r.type}] ${r.title} — ${r.snippet}`),
  ].join("\n");
};

export const recordProjectAITurn = (options: {
  projectId: string;
  userMessage: string;
  assistantContent: string;
  conversationId: string;
  messageId?: string;
  standards?: string[];
  copilotSuggestions?: CopilotSuggestion[];
}): void => {
  if (options.standards?.length) {
    recordProjectStandards(options.projectId, options.standards);
  }

  if (options.copilotSuggestions?.length) {
    recordProjectRecommendations(
      options.projectId,
      options.copilotSuggestions
    );
  }

  saveItemToProject({
    projectId: options.projectId,
    type: "chat",
    title: `AI Discussion — ${new Date().toLocaleDateString()}`,
    content: `User: ${options.userMessage}\n\nAssistant: ${options.assistantContent.slice(0, 800)}`,
    conversationId: options.conversationId,
    messageId: options.messageId,
    tags: ["ai-chat"],
  });
};

export const getActiveProjectContextBlock = (): string => {
  const project = getActiveProject();
  if (!project) return "";

  const dashboard = getActiveProjectDashboard();
  const memory = getProjectMemory(project.id);

  return [
    formatProjectMemorySummary(project.name, memory),
    dashboard ? formatProjectDashboardSummary(dashboard) : "",
  ]
    .filter(Boolean)
    .join("\n\n");
};
