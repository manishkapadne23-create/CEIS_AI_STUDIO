import type { DesignSession, DesignTemplate } from "./types";

const SESSIONS_KEY = "sarathi.design.sessions";
const ACTIVE_KEY = "sarathi.design.active";
const RECENT_KEY = "sarathi.design.recent";
const FAVORITES_KEY = "sarathi.design.favorites";

let sessionStore: DesignSession[] = [];
let activeSessionId: string | null = null;
let recentIds: string[] = [];
let favoriteIds: Set<string> = new Set();
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    sessionStore = raw ? (JSON.parse(raw) as DesignSession[]) : [];
    activeSessionId = localStorage.getItem(ACTIVE_KEY);
    const recentRaw = localStorage.getItem(RECENT_KEY);
    recentIds = recentRaw ? (JSON.parse(recentRaw) as string[]) : [];
    const favRaw = localStorage.getItem(FAVORITES_KEY);
    favoriteIds = new Set(favRaw ? (JSON.parse(favRaw) as string[]) : []);
  } catch {
    sessionStore = [];
    recentIds = [];
    favoriteIds = new Set();
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionStore.slice(0, 100)));
  if (activeSessionId) {
    localStorage.setItem(ACTIVE_KEY, activeSessionId);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds.slice(0, 50)));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteIds]));
};

export const startDesignSession = (
  template: DesignTemplate,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null
): DesignSession => {
  hydrate();
  const now = Date.now();
  const session: DesignSession = {
    id: crypto.randomUUID(),
    templateId: template.id,
    title: template.title,
    disciplineId: disciplineId ?? template.disciplineId,
    disciplineName: disciplineName ?? template.disciplineName,
    category: template.category,
    conversationId,
    currentStepIndex: 0,
    completedStepIds: [],
    stepData: {},
    revisions: [{ revision: "Rev 0", date: new Date().toISOString().slice(0, 10), description: "Design initiated" }],
    status: "in-progress",
    createdAt: now,
    updatedAt: now,
  };
  sessionStore.unshift(session);
  activeSessionId = session.id;
  recentIds = [session.id, ...recentIds.filter((id) => id !== session.id)].slice(0, 50);
  persist();
  return session;
};

export const getActiveDesignSession = (): DesignSession | null => {
  hydrate();
  if (!activeSessionId) return null;
  return sessionStore.find((s) => s.id === activeSessionId) ?? null;
};

export const getDesignSession = (sessionId: string): DesignSession | null => {
  hydrate();
  return sessionStore.find((s) => s.id === sessionId) ?? null;
};

export const updateStepData = (
  sessionId: string,
  stepId: DesignSession["completedStepIds"][number],
  data: string
): DesignSession | null => {
  hydrate();
  const index = sessionStore.findIndex((s) => s.id === sessionId);
  if (index < 0) return null;
  sessionStore[index] = {
    ...sessionStore[index],
    stepData: { ...sessionStore[index].stepData, [stepId]: data },
    updatedAt: Date.now(),
  };
  persist();
  return sessionStore[index];
};

export const advanceDesignStep = (
  sessionId: string,
  template: DesignTemplate
): DesignSession | null => {
  hydrate();
  const index = sessionStore.findIndex((s) => s.id === sessionId);
  if (index < 0) return null;

  const session = sessionStore[index];
  const currentStep = template.steps[session.currentStepIndex];
  const completedStepIds = currentStep
    ? [...new Set([...session.completedStepIds, currentStep.id])]
    : session.completedStepIds;

  const nextIndex = Math.min(
    session.currentStepIndex + 1,
    template.steps.length - 1
  );
  const allComplete = completedStepIds.length >= template.steps.length;

  sessionStore[index] = {
    ...session,
    completedStepIds,
    currentStepIndex: allComplete ? session.currentStepIndex : nextIndex,
    status: allComplete ? "completed" : "in-progress",
    updatedAt: Date.now(),
  };
  persist();
  return sessionStore[index];
};

export const pauseDesignSession = (sessionId: string): DesignSession | null => {
  hydrate();
  const index = sessionStore.findIndex((s) => s.id === sessionId);
  if (index < 0) return null;
  sessionStore[index] = { ...sessionStore[index], status: "paused", updatedAt: Date.now() };
  persist();
  return sessionStore[index];
};

export const saveDesignSession = (sessionId: string): boolean => {
  hydrate();
  const session = sessionStore.find((s) => s.id === sessionId);
  if (!session) return false;
  session.updatedAt = Date.now();
  persist();
  return true;
};

export const addFavoriteDesign = (sessionId: string): boolean => {
  hydrate();
  if (!sessionStore.some((s) => s.id === sessionId)) return false;
  favoriteIds.add(sessionId);
  persist();
  return true;
};

export const getRecentDesigns = (): DesignSession[] => {
  hydrate();
  return recentIds
    .map((id) => sessionStore.find((s) => s.id === id))
    .filter((s): s is DesignSession => s !== undefined);
};

export const getFavoriteDesigns = (): DesignSession[] => {
  hydrate();
  return sessionStore.filter((s) => favoriteIds.has(s.id));
};

export const getSavedDesigns = (): DesignSession[] => {
  hydrate();
  return sessionStore.filter((s) => s.status === "completed" || s.status === "paused");
};

export const addRevision = (
  sessionId: string,
  description: string
): DesignSession | null => {
  hydrate();
  const index = sessionStore.findIndex((s) => s.id === sessionId);
  if (index < 0) return null;
  const rev = sessionStore[index].revisions.length;
  sessionStore[index] = {
    ...sessionStore[index],
    revisions: [
      ...sessionStore[index].revisions,
      {
        revision: `Rev ${rev}`,
        date: new Date().toISOString().slice(0, 10),
        description,
      },
    ],
    updatedAt: Date.now(),
  };
  persist();
  return sessionStore[index];
};
