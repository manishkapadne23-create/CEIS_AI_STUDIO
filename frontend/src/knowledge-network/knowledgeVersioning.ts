import { getKnowledgeRepository } from "./knowledgeRepository";
import type { KnowledgeEntryStatus, KnowledgeVersionRecord } from "./types";

const versionHistory = new Map<string, KnowledgeVersionRecord[]>();

let syncCounter = 0;

export const recordKnowledgeVersion = (
  entryId: string,
  version: string,
  status: KnowledgeEntryStatus,
  changeNote: string
): KnowledgeVersionRecord => {
  const record: KnowledgeVersionRecord = {
    entryId,
    version,
    status,
    updatedAt: Date.now(),
    changeNote,
  };

  const history = versionHistory.get(entryId) ?? [];
  history.unshift(record);
  versionHistory.set(entryId, history.slice(0, 20));

  return record;
};

export const getKnowledgeVersionHistory = (
  entryId: string
): KnowledgeVersionRecord[] => versionHistory.get(entryId) ?? [];

export const getVersionSummary = (): string => {
  const repository = getKnowledgeRepository();
  const statusCounts = repository.reduce<Record<string, number>>(
    (acc, entry) => {
      acc[entry.status] = (acc[entry.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const newTopics = repository.filter((e) => e.status === "new").length;
  const updated = repository.filter((e) => e.status === "updated").length;
  const deprecated = repository.filter((e) => e.status === "deprecated").length;

  return [
    `Total knowledge entries: ${repository.length}`,
    `Active: ${statusCounts.active ?? 0}`,
    newTopics > 0 ? `New topics: ${newTopics}` : "",
    updated > 0 ? `Updated: ${updated}` : "",
    deprecated > 0 ? `Deprecated: ${deprecated}` : "",
    `Revision records: ${versionHistory.size}`,
    `Last sync counter: ${syncCounter}`,
  ]
    .filter(Boolean)
    .join(" | ");
};

export const markKnowledgeUpdated = (
  entryId: string,
  changeNote: string
): void => {
  recordKnowledgeVersion(entryId, bumpVersion(entryId), "updated", changeNote);
};

export const markKnowledgeDeprecated = (
  entryId: string,
  changeNote: string
): void => {
  recordKnowledgeVersion(entryId, bumpVersion(entryId), "deprecated", changeNote);
};

export const registerNewKnowledgeTopic = (
  entryId: string,
  changeNote: string
): void => {
  recordKnowledgeVersion(entryId, "1.0.0", "new", changeNote);
};

const bumpVersion = (entryId: string): string => {
  const latest = versionHistory.get(entryId)?.[0];
  if (!latest) return "1.0.1";

  const parts = latest.version.split(".").map(Number);
  parts[2] = (parts[2] ?? 0) + 1;
  return parts.join(".");
};

/** Future synchronization hook — increments sync counter for external knowledge feeds. */
export const synchronizeKnowledgeVersions = (): number => {
  syncCounter += 1;
  return syncCounter;
};

export const getKnowledgeSyncCounter = (): number => syncCounter;
