import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { WORKSPACE_CATEGORY_DEFINITIONS } from "../workspace/utils/workspaceCategoryConfig";
import { getDisciplineNameFromSlug } from "./disciplineSlugs";
import { isEngineeringHubSection } from "./routeConfig";
import { getMenuIdFromPath, SIDEBAR_MENU_ITEMS } from "./sidebarRoutes";

export interface BreadcrumbSegment {
  label: string;
  path?: string;
}

export const buildGlobalBreadcrumbs = (
  pathname: string,
  options?: {
    disciplineName?: string | null;
    moduleId?: WorkspaceCategoryId | null;
    hubSection?: string | null;
  }
): BreadcrumbSegment[] => {
  const segments: BreadcrumbSegment[] = [{ label: "Home", path: "/dashboard" }];
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (normalized.startsWith("/dashboard/")) {
    const disciplineSlug = normalized.split("/")[2];
    if (disciplineSlug) {
      const disciplineName =
        options?.disciplineName ??
        getDisciplineNameFromSlug(disciplineSlug) ??
        disciplineSlug;
      segments.push({ label: "Dashboard", path: "/dashboard" });
      segments.push({ label: `${disciplineName} Dashboard` });
      return segments;
    }
  }

  if (normalized.startsWith("/chat")) {
    segments.push({ label: "AI Chat", path: "/chat" });
    const parts = normalized.split("/").filter(Boolean);
    const disciplineSlug = parts[1];
    const moduleId = parts[2];

    if (disciplineSlug) {
      const disciplineName =
        options?.disciplineName ?? getDisciplineNameFromSlug(disciplineSlug) ?? disciplineSlug;
      segments.push({
        label: disciplineName,
        path: `/chat/${disciplineSlug}`,
      });
    }

    if (moduleId) {
      const moduleTitle =
        WORKSPACE_CATEGORY_DEFINITIONS.find((module) => module.id === moduleId)?.title ??
        moduleId;
      segments.push({ label: moduleTitle });
    }

    return segments;
  }

  const menuItem = SIDEBAR_MENU_ITEMS.find(
    (item) => normalized === item.route || normalized.startsWith(`${item.route}/`)
  );

  if (menuItem) {
    segments.push({ label: menuItem.title, path: menuItem.route });

    if (normalized.startsWith("/engineering-hub/")) {
      const section = normalized.split("/")[2];
      if (section && isEngineeringHubSection(section)) {
        segments.push({
          label: section.charAt(0).toUpperCase() + section.slice(1),
        });
      }
    }

    if (options?.hubSection && normalized === "/engineering-hub") {
      segments.push({
        label: options.hubSection.charAt(0).toUpperCase() + options.hubSection.slice(1),
      });
    }

    return segments;
  }

  if (normalized.startsWith("/search")) {
    segments.push({ label: "Search" });
    return segments;
  }

  if (normalized.startsWith("/decision-intelligence")) {
    segments.push({ label: "Decision Intelligence" });
    return segments;
  }

  if (normalized.startsWith("/standards-intelligence")) {
    segments.push({ label: "Standards Intelligence" });
    return segments;
  }

  if (normalized.startsWith("/knowledge-graph")) {
    segments.push({ label: "Knowledge Graph" });
    return segments;
  }

  if (normalized.startsWith("/memory")) {
    segments.push({ label: "Engineering Memory" });
    return segments;
  }

  if (normalized === "/engineering") {
    segments.push({ label: "Manage Domains" });
    return segments;
  }

  segments.push({ label: "Page" });
  return segments;
};

export const getActiveMenuFromPath = (pathname: string): string =>
  getMenuIdFromPath(pathname);
