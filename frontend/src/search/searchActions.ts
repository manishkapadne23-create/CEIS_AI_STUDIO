import { createBookmark } from "../assistant/bookmarkManager";
import { disciplineIdToSlug, getChatRouteFromWorkspace } from "../navigation/disciplineSlugs";
import type { EngineeringSearchResult } from "../sarathi/types";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { UniversalSearchResult } from "./types";

export interface SearchActionContext {
  navigate: (path: string) => void;
  selectDiscipline: (disciplineId: string, disciplineName: string) => void;
  openModule: (moduleId: WorkspaceCategoryId) => void;
  selectChat: (chatId: string) => void;
  openStandardByResource?: (disciplineId: string, resourceId: string) => void;
}

export const buildResultDeepLink = (result: UniversalSearchResult): string => {
  if (result.deepLink) {
    if (result.type === "conversation" && result.resourceId) {
      return `/chat?conversation=${result.resourceId}`;
    }
    return result.deepLink;
  }

  if (result.disciplineId && result.moduleId) {
    return `/chat/${disciplineIdToSlug(result.disciplineId)}/${result.moduleId}`;
  }

  if (result.disciplineId) {
    return `/chat/${disciplineIdToSlug(result.disciplineId)}`;
  }

  return "/search";
};

export const copySearchResultLink = async (
  result: UniversalSearchResult
): Promise<boolean> => {
  const link = `${window.location.origin}${buildResultDeepLink(result)}`;
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    return false;
  }
};

export const bookmarkSearchResult = (
  result: UniversalSearchResult
): void => {
  const typeMap: Record<string, Parameters<typeof createBookmark>[0]["type"]> = {
    standard: "standard",
    document: "document",
    calculator: "calculator",
    report: "report",
    template: "template",
    learning: "learning-resource",
    knowledge: "learning-resource",
    conversation: "ai-conversation",
  };

  createBookmark({
    type: typeMap[result.type] ?? "standard",
    title: result.title,
    resourceId: result.resourceId ?? null,
    disciplineId: result.disciplineId,
    conversationId: result.type === "conversation" ? result.resourceId ?? null : null,
  });
};

export const toEngineeringSearchResult = (
  result: UniversalSearchResult
): EngineeringSearchResult | null => {
  if (
    result.type === "discipline" ||
    result.type === "standard" ||
    result.type === "calculator" ||
    result.type === "tool" ||
    result.type === "workflow" ||
    result.type === "knowledge"
  ) {
    return {
      id: result.id,
      type: result.type,
      title: result.title,
      subtitle: result.subtitle,
      disciplineId: result.disciplineId ?? "",
      disciplineName: result.disciplineName ?? "",
      resourceId: result.resourceId,
    };
  }
  return null;
};

export const executeSearchResultAction = (
  result: UniversalSearchResult,
  context: SearchActionContext,
  action: "open" | "preview" = "open"
): void => {
  if (action === "preview") {
    void copySearchResultLink(result);
    return;
  }

  switch (result.type) {
    case "discipline":
      if (result.disciplineId && result.disciplineName) {
        context.selectDiscipline(result.disciplineId, result.disciplineName);
        context.navigate(`/chat/${disciplineIdToSlug(result.disciplineId)}`);
      }
      break;
    case "standard":
      if (result.disciplineId && result.disciplineName) {
        context.selectDiscipline(result.disciplineId, result.disciplineName);
        context.openModule("standards");
        context.openStandardByResource?.(
          result.disciplineId,
          result.resourceId ?? ""
        );
        context.navigate(
          `/chat/${disciplineIdToSlug(result.disciplineId)}/standards`
        );
      }
      break;
    case "calculator":
      if (result.disciplineId && result.disciplineName) {
        context.selectDiscipline(result.disciplineId, result.disciplineName);
        context.openModule("calculators");
        context.navigate(
          `/chat/${disciplineIdToSlug(result.disciplineId)}/calculators`
        );
      }
      break;
    case "tool":
    case "template":
      if (result.disciplineId && result.disciplineName) {
        context.selectDiscipline(result.disciplineId, result.disciplineName);
        context.openModule(result.moduleId ?? "professional-tools");
        context.navigate(
          `/chat/${disciplineIdToSlug(result.disciplineId)}/${result.moduleId ?? "professional-tools"}`
        );
      }
      break;
    case "workflow":
    case "learning":
    case "knowledge":
      if (result.disciplineId && result.disciplineName) {
        context.selectDiscipline(result.disciplineId, result.disciplineName);
        context.openModule(result.moduleId ?? "learning-hub");
        context.navigate(
          `/chat/${disciplineIdToSlug(result.disciplineId)}/${result.moduleId ?? "learning-hub"}`
        );
      }
      break;
    case "document":
      context.navigate("/documents");
      break;
    case "conversation":
      if (result.resourceId) {
        context.selectChat(result.resourceId);
        context.navigate(getChatRouteFromWorkspace());
      }
      break;
    case "engineering-hub":
      context.navigate(result.deepLink ?? "/engineering-hub");
      break;
    case "bookmark":
    case "note":
    case "report":
      context.navigate(result.deepLink ?? getChatRouteFromWorkspace());
      break;
    default:
      context.navigate(buildResultDeepLink(result));
  }
};

export const shareSearchResult = async (
  result: UniversalSearchResult
): Promise<boolean> => {
  const url = `${window.location.origin}${buildResultDeepLink(result)}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: result.title,
        text: result.subtitle ?? result.title,
        url,
      });
      return true;
    } catch {
      return copySearchResultLink(result);
    }
  }
  return copySearchResultLink(result);
};
