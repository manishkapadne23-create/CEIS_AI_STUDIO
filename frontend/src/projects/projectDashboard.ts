import type { ProjectDashboardData } from "./types";
import { getAllArtifacts, getProjectMemory } from "./projectMemory";
import { getRecentProjectActivity } from "./projectHistory";
import { getActiveProject } from "./projectManager";
import { getStoredProject } from "./projectStorage";

export const buildProjectDashboard = (
  projectId: string
): ProjectDashboardData | null => {
  const project = getStoredProject(projectId);
  if (!project) return null;

  const memory = getProjectMemory(projectId);
  const recentActivity = getRecentProjectActivity(projectId, 12);
  const allArtifacts = getAllArtifacts(memory);

  const pinnedItems = allArtifacts.filter(
    (item) => item.pinned || item.bookmarked
  ).length;

  const latestDiscussions = recentActivity
    .filter((activity) => activity.type === "chat")
    .slice(0, 5)
    .map((activity) => ({
      conversationId: activity.id,
      title: activity.title,
      lastMessagePreview: activity.summary,
      updatedAt: activity.timestamp,
    }));

  return {
    project,
    memory,
    recentActivity,
    stats: {
      documents:
        memory.uploadedDocuments.length + memory.savedOutputs.length,
      calculations: memory.calculations.length,
      reports: memory.reports.length + memory.generatedFiles.length,
      standards: memory.standardsUsed.length,
      workflows: memory.workflows.length,
      conversations: memory.chatConversationIds.length,
      pinnedItems,
    },
    latestDiscussions,
    workflowStatus: memory.workflows.slice(0, 5),
  };
};

export const formatProjectDashboardSummary = (
  dashboard: ProjectDashboardData
): string => {
  const { project, stats, recentActivity, workflowStatus } = dashboard;

  return [
    "========================================",
    "Project Dashboard",
    "========================================",
    `Project: ${project.name}`,
    `Type: ${project.projectType}`,
    `Discipline: ${project.disciplineName ?? "Not set"}`,
    `Location: ${project.location ?? "Not set"}`,
    `Client: ${project.client ?? "Not set"}`,
    `Status: ${project.status}`,
    "",
    "Stats:",
    `  Documents: ${stats.documents} | Calculations: ${stats.calculations} | Reports: ${stats.reports}`,
    `  Standards: ${stats.standards} | Workflows: ${stats.workflows} | Chats: ${stats.conversations}`,
    "",
    "Recent activity:",
    ...recentActivity.slice(0, 5).map((a) => `  • ${a.title}`),
    "",
    workflowStatus.length > 0
      ? `Workflow status: ${workflowStatus.map((w) => `${w.workflowTitle} (${w.status})`).join("; ")}`
      : "No active workflows in this project.",
  ].join("\n");
};

export const getActiveProjectDashboard = (): ProjectDashboardData | null => {
  const active = getActiveProject();
  return active ? buildProjectDashboard(active.id) : null;
};
