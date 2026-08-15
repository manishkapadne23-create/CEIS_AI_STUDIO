import type { ProjectSearchResult } from "./types";
import { getAllArtifacts, getProjectMemory } from "./projectMemory";
import { getProjectActivities } from "./projectStorage";

export type ProjectSearchScope =
  | "all"
  | "documents"
  | "standards"
  | "reports"
  | "calculations"
  | "conversations";

const scoreMatch = (haystack: string, query: string): number => {
  const normalized = query.toLowerCase();
  const text = haystack.toLowerCase();
  if (text.includes(normalized)) {
    return normalized.length / Math.max(text.length, 1) + 1;
  }
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const matched = tokens.filter((token) => text.includes(token)).length;
  return matched / Math.max(tokens.length, 1);
};

export const searchWithinProject = (
  projectId: string,
  query: string,
  scope: ProjectSearchScope = "all",
  limit = 20
): ProjectSearchResult[] => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const memory = getProjectMemory(projectId);
  const results: ProjectSearchResult[] = [];

  const searchArtifacts = (
    items: Array<{ id: string; title: string; content: string; type: ProjectSearchResult["type"] }>,
    type: ProjectSearchResult["type"]
  ) => {
    for (const item of items) {
      const score = Math.max(
        scoreMatch(item.title, trimmed),
        scoreMatch(item.content, trimmed) * 0.8
      );
      if (score > 0.2) {
        results.push({
          id: `search-${type}-${item.id}`,
          projectId,
          type,
          title: item.title,
          snippet: item.content.slice(0, 160),
          score,
          artifactId: item.id,
        });
      }
    }
  };

  if (scope === "all" || scope === "documents") {
    searchArtifacts(memory.uploadedDocuments, "document");
    searchArtifacts(memory.savedOutputs, "document");
  }

  if (scope === "all" || scope === "reports") {
    searchArtifacts(memory.reports, "report");
    searchArtifacts(memory.generatedFiles, "generated-file");
  }

  if (scope === "all" || scope === "calculations") {
    searchArtifacts(memory.calculations, "calculation");
  }

  if (scope === "all" || scope === "standards") {
    for (const standard of memory.standardsUsed) {
      const score = scoreMatch(standard, trimmed);
      if (score > 0.2) {
        results.push({
          id: `search-standard-${standard}`,
          projectId,
          type: "standard",
          title: standard,
          snippet: "Project standard reference",
          score,
        });
      }
    }
    searchArtifacts(memory.templates, "template");
  }

  if (scope === "all" || scope === "conversations") {
    const activities = getProjectActivities(projectId, 50).filter(
      (activity) => activity.type === "chat"
    );
    for (const activity of activities) {
      const score = Math.max(
        scoreMatch(activity.title, trimmed),
        scoreMatch(activity.summary, trimmed)
      );
      if (score > 0.2) {
        results.push({
          id: `search-chat-${activity.id}`,
          projectId,
          type: "conversation",
          title: activity.title,
          snippet: activity.summary,
          score,
        });
      }
    }

    for (const artifact of getAllArtifacts(memory)) {
      if (artifact.type === "chat" || artifact.conversationId) {
        const score = scoreMatch(
          `${artifact.title} ${artifact.content}`,
          trimmed
        );
        if (score > 0.25) {
          results.push({
            id: `search-conv-artifact-${artifact.id}`,
            projectId,
            type: "conversation",
            title: artifact.title,
            snippet: artifact.content.slice(0, 160),
            score,
            conversationId: artifact.conversationId,
            artifactId: artifact.id,
          });
        }
      }
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
