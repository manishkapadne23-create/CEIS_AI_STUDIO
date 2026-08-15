import type { CopilotSuggestion } from "../copilot/types";
import type {
  ProjectArtifact,
  ProjectArtifactType,
  ProjectMemoryState,
  ProjectWorkflowRecord,
} from "./types";
import {
  appendProjectActivity,
  getStoredProjectMemory,
  saveProjectArtifact,
  saveProjectMemory,
  saveStoredProject,
} from "./projectStorage";
import { getStoredProject } from "./projectStorage";

export interface RecordProjectChatInput {
  projectId: string;
  conversationId: string;
  title: string;
  lastMessagePreview: string;
}

export interface SaveToProjectInput {
  projectId: string;
  type: ProjectArtifactType;
  title: string;
  content: string;
  conversationId?: string;
  messageId?: string;
  resourceId?: string;
  tags?: string[];
  pinned?: boolean;
  bookmarked?: boolean;
}

export const bindConversationToProject = (
  input: RecordProjectChatInput
): void => {
  const memory = getStoredProjectMemory(input.projectId);
  const conversationIds = memory.chatConversationIds.includes(
    input.conversationId
  )
    ? memory.chatConversationIds
    : [input.conversationId, ...memory.chatConversationIds];

  saveProjectMemory({
    ...memory,
    chatConversationIds: conversationIds.slice(0, 50),
    lastActivityAt: Date.now(),
  });

  appendProjectActivity({
    id: crypto.randomUUID(),
    projectId: input.projectId,
    type: "chat",
    title: input.title,
    summary: input.lastMessagePreview.slice(0, 160),
    timestamp: Date.now(),
  });

  const project = getStoredProject(input.projectId);
  if (project) {
    saveStoredProject({ ...project, updatedAt: Date.now() });
  }
};

export const saveItemToProject = (
  input: SaveToProjectInput
): ProjectArtifact => {
  const now = Date.now();
  const artifact: ProjectArtifact = {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    type: input.type,
    title: input.title,
    content: input.content,
    conversationId: input.conversationId,
    messageId: input.messageId,
    resourceId: input.resourceId,
    tags: input.tags ?? [],
    pinned: input.pinned ?? false,
    bookmarked: input.bookmarked ?? false,
    createdAt: now,
    updatedAt: now,
  };

  saveProjectArtifact(input.projectId, artifact);

  if (input.type === "standard") {
    const memory = getStoredProjectMemory(input.projectId);
    const standards = Array.from(
      new Set([...memory.standardsUsed, input.title])
    ).slice(0, 40);
    saveProjectMemory({ ...memory, standardsUsed: standards });
  }

  appendProjectActivity({
    id: crypto.randomUUID(),
    projectId: input.projectId,
    type: input.type,
    title: `Saved: ${input.title}`,
    summary: input.content.slice(0, 120),
    timestamp: now,
  });

  return artifact;
};

export const pinProjectArtifact = (
  projectId: string,
  artifactId: string,
  pinned: boolean
): ProjectArtifact | null => {
  const memory = getStoredProjectMemory(projectId);
  const artifact = getAllArtifacts(memory).find((item) => item.id === artifactId);
  if (!artifact) return null;

  const updated = { ...artifact, pinned, updatedAt: Date.now() };
  saveProjectArtifact(projectId, updated);
  return updated;
};

export const bookmarkProjectArtifact = (
  projectId: string,
  artifactId: string,
  bookmarked: boolean
): ProjectArtifact | null => {
  const memory = getStoredProjectMemory(projectId);
  const artifact = getAllArtifacts(memory).find((item) => item.id === artifactId);
  if (!artifact) return null;

  const updated = { ...artifact, bookmarked, updatedAt: Date.now() };
  saveProjectArtifact(projectId, updated);
  return updated;
};

export const tagProjectArtifact = (
  projectId: string,
  artifactId: string,
  tags: string[]
): ProjectArtifact | null => {
  const memory = getStoredProjectMemory(projectId);
  const artifact = getAllArtifacts(memory).find((item) => item.id === artifactId);
  if (!artifact) return null;

  const updated = { ...artifact, tags, updatedAt: Date.now() };
  saveProjectArtifact(projectId, updated);
  return updated;
};

export const recordProjectStandards = (
  projectId: string,
  standards: string[]
): void => {
  if (standards.length === 0) return;
  const memory = getStoredProjectMemory(projectId);
  saveProjectMemory({
    ...memory,
    standardsUsed: Array.from(
      new Set([...memory.standardsUsed, ...standards])
    ).slice(0, 50),
  });
};

export const recordProjectWorkflow = (
  projectId: string,
  workflow: ProjectWorkflowRecord
): void => {
  const memory = getStoredProjectMemory(projectId);
  const workflows = [
    workflow,
    ...memory.workflows.filter((w) => w.workflowId !== workflow.workflowId),
  ].slice(0, 20);

  saveProjectMemory({ ...memory, workflows });
};

export const recordProjectRecommendations = (
  projectId: string,
  recommendations: CopilotSuggestion[]
): void => {
  if (recommendations.length === 0) return;

  const memory = getStoredProjectMemory(projectId);
  const aiRecommendations = [
    ...recommendations.map((rec) => ({
      id: crypto.randomUUID(),
      message: `${rec.title}: ${rec.description}`,
      source: "copilot",
      timestamp: Date.now(),
    })),
    ...memory.aiRecommendations,
  ].slice(0, 30);

  saveProjectMemory({ ...memory, aiRecommendations });
};

export const getProjectMemory = (
  projectId: string
): ProjectMemoryState => getStoredProjectMemory(projectId);

export const getAllArtifacts = (memory: ProjectMemoryState): ProjectArtifact[] =>
  [
    ...memory.uploadedDocuments,
    ...memory.calculations,
    ...memory.reports,
    ...memory.templates,
    ...memory.generatedFiles,
    ...memory.savedOutputs,
  ].sort((a, b) => b.updatedAt - a.updatedAt);

export const formatProjectMemorySummary = (
  projectName: string,
  memory: ProjectMemoryState
): string => {
  const lines = [
    "========================================",
    "Active Engineering Project Workspace",
    "========================================",
    `Project: ${projectName}`,
    `Conversations: ${memory.chatConversationIds.length}`,
    `Documents: ${memory.uploadedDocuments.length}`,
    `Calculations: ${memory.calculations.length}`,
    `Reports: ${memory.reports.length}`,
    `Templates: ${memory.templates.length}`,
    `Generated files: ${memory.generatedFiles.length}`,
    `Workflows: ${memory.workflows.length}`,
  ];

  if (memory.standardsUsed.length > 0) {
    lines.push(`Standards used: ${memory.standardsUsed.join(", ")}`);
  }

  const recentRecs = memory.aiRecommendations.slice(0, 3);
  if (recentRecs.length > 0) {
    lines.push("", "Recent AI recommendations:");
    for (const rec of recentRecs) {
      lines.push(`  • ${rec.message}`);
    }
  }

  const activeWorkflow = memory.workflows[0];
  if (activeWorkflow) {
    lines.push(
      "",
      `Active workflow: ${activeWorkflow.workflowTitle} (${activeWorkflow.status})`
    );
  }

  lines.push(
    "",
    "Continue all engineering work in the context of this project unless the user explicitly changes project."
  );

  return lines.join("\n");
};
