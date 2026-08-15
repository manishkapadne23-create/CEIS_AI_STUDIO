import type { ProjectActivityRecord, ProjectArtifactType } from "./types";
import { appendProjectActivity, getProjectActivities } from "./projectStorage";

export const recordProjectHistory = (
  projectId: string,
  type: ProjectActivityRecord["type"],
  title: string,
  summary: string
): ProjectActivityRecord => {
  const record: ProjectActivityRecord = {
    id: crypto.randomUUID(),
    projectId,
    type,
    title,
    summary,
    timestamp: Date.now(),
  };

  appendProjectActivity(record);
  return record;
};

export const getRecentProjectActivity = (
  projectId: string,
  limit = 15
): ProjectActivityRecord[] => getProjectActivities(projectId, limit);

export const formatActivityTimeline = (
  activities: ProjectActivityRecord[]
): string => {
  if (activities.length === 0) return "No recent project activity.";

  return activities
    .slice(0, 10)
    .map(
      (activity) =>
        `• [${new Date(activity.timestamp).toLocaleString()}] ${activity.title} — ${activity.summary}`
    )
    .join("\n");
};

export type { ProjectArtifactType };
