import { DISCIPLINE_DEFINITIONS } from "../knowledge/data/disciplineManifest";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";

const SLUG_OVERRIDES: Record<string, string> = {
  civil: "civil-engineering",
  mechanical: "mechanical-engineering",
  electrical: "electrical-engineering",
  computer: "computer-engineering",
  electronics: "electronics-telecommunication-engineering",
  chemical: "chemical-engineering",
  environmental: "environmental-engineering",
  mining: "mining-engineering",
  marine: "marine-engineering",
  aerospace: "aerospace-engineering",
  railway: "railway-engineering",
  industrial: "industrial-engineering",
  automation: "automation-robotics",
  renewable: "renewable-energy",
  architecture: "architecture-planning",
  agricultural: "agricultural-engineering",
  biomedical: "biomedical-engineering",
  oilgas: "oil-gas-engineering",
};

export const disciplineIdToSlug = (disciplineId: string): string => {
  const override = Object.entries(SLUG_OVERRIDES).find(([, id]) => id === disciplineId);
  if (override) {
    return override[0];
  }
  return disciplineId.replace(/-engineering$/, "").replace(/-telecommunication$/, "");
};

export const disciplineSlugToId = (slug: string): string | null => {
  if (SLUG_OVERRIDES[slug]) {
    return SLUG_OVERRIDES[slug];
  }

  const byId = DISCIPLINE_DEFINITIONS.find(
    (discipline) =>
      discipline.id === slug ||
      discipline.id.replace(/-engineering$/, "") === slug
  );
  return byId?.id ?? null;
};

export const getDisciplineNameFromSlug = (slug: string): string | null => {
  const id = disciplineSlugToId(slug);
  if (!id) {
    return null;
  }
  return DISCIPLINE_DEFINITIONS.find((discipline) => discipline.id === id)?.name ?? null;
};

export const isValidModuleId = (moduleId: string): moduleId is WorkspaceCategoryId =>
  [
    "standards",
    "ai-expert",
    "calculators",
    "professional-tools",
    "documents",
    "learning-hub",
  ].includes(moduleId);

export const buildChatPath = (
  disciplineSlug?: string | null,
  moduleId?: WorkspaceCategoryId | null
): string => {
  if (!disciplineSlug) {
    return "/chat";
  }
  if (!moduleId) {
    return `/chat/${disciplineSlug}`;
  }
  return `/chat/${disciplineSlug}/${moduleId}`;
};

export const buildDashboardPath = (disciplineSlug?: string | null): string => {
  if (!disciplineSlug) {
    return "/dashboard";
  }
  return `/dashboard/${disciplineSlug}`;
};

export const getChatRouteFromWorkspace = (): string => {
  const raw = readPersistedString(PERSISTED_KEYS.workspaceNavigation);
  if (!raw) {
    return "/chat";
  }

  try {
    const state = JSON.parse(raw) as {
      disciplineSlug?: string | null;
      moduleId?: WorkspaceCategoryId | null;
    };
    return buildChatPath(state.disciplineSlug, state.moduleId);
  } catch {
    return "/chat";
  }
};

export const getDashboardRouteFromWorkspace = (): string => {
  const raw = readPersistedString(PERSISTED_KEYS.workspaceNavigation);
  if (!raw) {
    return "/dashboard";
  }

  try {
    const state = JSON.parse(raw) as { disciplineSlug?: string | null };
    return buildDashboardPath(state.disciplineSlug);
  } catch {
    return "/dashboard";
  }
};
