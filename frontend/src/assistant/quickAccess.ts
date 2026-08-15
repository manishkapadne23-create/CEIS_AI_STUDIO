import { listDocuments } from "../documents";
import { getFrequentByType } from "../intelligence/learningEngine";
import { listWorkspaceItems } from "../actions/workspaceSaver";
import { listBookmarks } from "./bookmarkManager";
import type { QuickAccessSnapshot } from "./types";

export const buildQuickAccessSnapshot = (
  conversationId: string
): QuickAccessSnapshot => {
  const recentStandards = getFrequentByType("standard", 5).map((r) => r.label);
  const recentCalculations = [
    ...getFrequentByType("calculator", 4).map((r) => r.label),
    ...listWorkspaceItems("calculations").slice(0, 3).map((i) => i.title),
  ];
  const recentReports = listWorkspaceItems("reports")
    .slice(0, 5)
    .map((i) => i.title);
  const recentDocuments = listDocuments()
    .slice(0, 5)
    .map((d) => d.name);
  const bookmarkConversations = listBookmarks("ai-conversation")
    .slice(0, 3)
    .map((b) => b.title);

  return {
    recentConversations: [
      conversationId,
      ...bookmarkConversations,
    ].slice(0, 5),
    recentDocuments,
    recentReports,
    recentCalculations: [...new Set(recentCalculations)].slice(0, 6),
    recentStandards,
  };
};

export const formatQuickAccessForPrompt = (
  snapshot: QuickAccessSnapshot
): string =>
  [
    `Recent conversations: ${snapshot.recentConversations.join(", ") || "none"}`,
    `Recent documents: ${snapshot.recentDocuments.join(", ") || "none"}`,
    `Recent reports: ${snapshot.recentReports.join(", ") || "none"}`,
    `Recent calculations: ${snapshot.recentCalculations.join(", ") || "none"}`,
    `Recent standards: ${snapshot.recentStandards.join(", ") || "none"}`,
  ].join("\n");
