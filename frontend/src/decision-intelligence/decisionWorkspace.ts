import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { DecisionIntelligenceCategory, DecisionWorkspaceSession } from "./types";

const MAX_SESSIONS = 30;

const loadSessions = (): DecisionWorkspaceSession[] => {
  const raw = readPersistedString(PERSISTED_KEYS.decisionWorkspace);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as DecisionWorkspaceSession[];
  } catch {
    return [];
  }
};

const saveSessions = (sessions: DecisionWorkspaceSession[]): void => {
  writePersistedString(
    PERSISTED_KEYS.decisionWorkspace,
    JSON.stringify(sessions.slice(0, MAX_SESSIONS))
  );
};

export const listDecisionSessions = (): DecisionWorkspaceSession[] =>
  loadSessions().sort((a, b) => b.updatedAt - a.updatedAt);

export const getDecisionSession = (sessionId: string): DecisionWorkspaceSession | null =>
  loadSessions().find((session) => session.id === sessionId) ?? null;

export const createDecisionSession = (input: {
  title: string;
  problemStatement: string;
  disciplineId: string | null;
  disciplineName: string | null;
  alternatives?: string[];
  category?: DecisionIntelligenceCategory | null;
}): DecisionWorkspaceSession => {
  const now = Date.now();
  const session: DecisionWorkspaceSession = {
    id: crypto.randomUUID(),
    title: input.title.slice(0, 120),
    problemStatement: input.problemStatement,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    alternatives: input.alternatives ?? [],
    category: input.category ?? null,
    createdAt: now,
    updatedAt: now,
  };

  saveSessions([session, ...loadSessions()]);
  return session;
};

export const updateDecisionSession = (
  sessionId: string,
  patch: Partial<DecisionWorkspaceSession>
): DecisionWorkspaceSession | null => {
  const sessions = loadSessions();
  const index = sessions.findIndex((session) => session.id === sessionId);
  if (index < 0) {
    return null;
  }

  sessions[index] = {
    ...sessions[index],
    ...patch,
    updatedAt: Date.now(),
  };
  saveSessions(sessions);
  return sessions[index];
};

export const deleteDecisionSession = (sessionId: string): void => {
  saveSessions(loadSessions().filter((session) => session.id !== sessionId));
};
