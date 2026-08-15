import type { ModuleWorkspaceItem } from "../types";

export const filterModuleItems = (
  items: ModuleWorkspaceItem[],
  query: string
): ModuleWorkspaceItem[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [item.title, item.description, item.badge]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};

export const createPlaceholderItems = (
  prefix: string,
  labels: string[]
): ModuleWorkspaceItem[] =>
  labels.map((label) => ({
    id: `${prefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: label,
    description: `${label} will be available in a future release.`,
    badge: "Planned",
  }));
