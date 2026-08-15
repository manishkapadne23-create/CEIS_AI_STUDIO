import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import type { ActivityRecord } from "./types";

const MAX_ACTIVITY = 40;

const loadActivities = (): ActivityRecord[] => {
  const raw = readPersistedString(PERSISTED_KEYS.activityLog);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as ActivityRecord[];
  } catch {
    return [];
  }
};

export const getRecentActivity = (limit = 12): ActivityRecord[] =>
  loadActivities()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);

export const trackActivity = (
  record: Omit<ActivityRecord, "id" | "timestamp"> & { timestamp?: number }
): ActivityRecord => {
  const entry: ActivityRecord = {
    id: crypto.randomUUID(),
    timestamp: record.timestamp ?? Date.now(),
    type: record.type,
    title: record.title,
    resourceId: record.resourceId ?? null,
    disciplineId: record.disciplineId ?? null,
  };

  const next = [
    entry,
    ...loadActivities().filter(
      (item) =>
        !(
          item.type === entry.type &&
          item.resourceId === entry.resourceId &&
          item.title === entry.title
        )
    ),
  ].slice(0, MAX_ACTIVITY);

  writePersistedString(PERSISTED_KEYS.activityLog, JSON.stringify(next));
  return entry;
};

export const clearActivityLog = (): void => {
  writePersistedString(PERSISTED_KEYS.activityLog, JSON.stringify([]));
};

export const getActivityByType = (
  type: ActivityRecord["type"],
  limit = 8
): ActivityRecord[] =>
  getRecentActivity(MAX_ACTIVITY)
    .filter((item) => item.type === type)
    .slice(0, limit);
