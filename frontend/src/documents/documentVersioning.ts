import type {
  DocumentVersionRecord,
  EngineeringDocumentRecord,
  EngineeringDocumentStatus,
} from "./types";

const versionStore = new Map<string, DocumentVersionRecord[]>();

export const recordDocumentVersion = (
  document: EngineeringDocumentRecord,
  changeNote: string,
  status: EngineeringDocumentStatus = "indexed"
): DocumentVersionRecord => {
  const record: DocumentVersionRecord = {
    id: crypto.randomUUID(),
    documentId: document.id,
    version: document.version,
    status,
    uploadedAt: document.uploadDate,
    author: document.author,
    changeNote,
    isLatest: true,
    isSuperseded: false,
  };

  const history = versionStore.get(document.id) ?? [];
  const updatedHistory = history.map((entry) => ({
    ...entry,
    isLatest: false,
    isSuperseded: entry.isLatest,
  }));

  versionStore.set(document.id, [record, ...updatedHistory].slice(0, 20));
  return record;
};

export const getDocumentVersionHistory = (
  documentId: string
): DocumentVersionRecord[] => versionStore.get(documentId) ?? [];

export const getLatestDocumentVersion = (
  documentId: string
): DocumentVersionRecord | null =>
  getDocumentVersionHistory(documentId).find((entry) => entry.isLatest) ?? null;

export const createDocumentRevision = (
  document: EngineeringDocumentRecord,
  changeNote: string
): { document: EngineeringDocumentRecord; version: DocumentVersionRecord } => {
  const parts = document.version.split(".");
  parts[1] = String(Number(parts[1] ?? 0) + 1);
  const newVersion = parts.join(".");

  const revised: EngineeringDocumentRecord = {
    ...document,
    version: newVersion,
    status: "indexed",
    uploadDate: Date.now(),
    updatedAt: Date.now(),
    latestVersionId: document.id,
  };

  const versionRecord = recordDocumentVersion(revised, changeNote, "indexed");
  return { document: revised, version: versionRecord };
};

export const markDocumentSuperseded = (
  documentId: string,
  changeNote: string
): void => {
  const history = versionStore.get(documentId) ?? [];
  versionStore.set(
    documentId,
    history.map((entry) => ({
      ...entry,
      isSuperseded: true,
      isLatest: false,
      status: "superseded" as EngineeringDocumentStatus,
      changeNote: entry.isLatest ? changeNote : entry.changeNote,
    }))
  );
};

export const formatVersionSummary = (
  document: EngineeringDocumentRecord
): string => {
  const history = getDocumentVersionHistory(document.id);

  return [
    `Current version: ${document.version}`,
    `Original ID: ${document.originalVersionId}`,
    `Latest ID: ${document.latestVersionId}`,
    `Revision count: ${history.length}`,
    history.length > 0
      ? `Latest change: ${history[0].changeNote}`
      : "No revision history recorded",
  ].join("\n");
};
