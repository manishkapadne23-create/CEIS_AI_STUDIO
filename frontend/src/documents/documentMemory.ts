import { getActiveProject } from "../projects";
import type { EngineeringDocumentRecord } from "./types";

const STORAGE_KEY = "sarathi.documents.library";

let documentStore: EngineeringDocumentRecord[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    documentStore = raw ? (JSON.parse(raw) as EngineeringDocumentRecord[]) : [];
  } catch {
    documentStore = [];
  }

  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documentStore));
};

export const listDocuments = (): EngineeringDocumentRecord[] => {
  hydrate();
  return [...documentStore].sort((a, b) => b.uploadDate - a.uploadDate);
};

export const getDocument = (documentId: string): EngineeringDocumentRecord | null => {
  hydrate();
  return documentStore.find((doc) => doc.id === documentId) ?? null;
};

export const saveDocument = (document: EngineeringDocumentRecord): void => {
  hydrate();
  const index = documentStore.findIndex((doc) => doc.id === document.id);
  if (index >= 0) {
    documentStore[index] = document;
  } else {
    documentStore.unshift(document);
  }
  persist();
};

export const deleteDocument = (documentId: string): boolean => {
  hydrate();
  const before = documentStore.length;
  documentStore = documentStore.filter((doc) => doc.id !== documentId);
  if (documentStore.length !== before) {
    persist();
    return true;
  }
  return false;
};

export const getDocumentsByDiscipline = (
  disciplineId: string
): EngineeringDocumentRecord[] =>
  listDocuments().filter((doc) => doc.disciplineId === disciplineId);

export const getDocumentsByProject = (
  projectId: string
): EngineeringDocumentRecord[] =>
  listDocuments().filter((doc) => doc.projectIds.includes(projectId));

export const getActiveDocuments = (
  documentIds?: string[]
): EngineeringDocumentRecord[] => {
  const all = listDocuments();
  if (!documentIds || documentIds.length === 0) {
    const activeProject = getActiveProject();
    if (activeProject) {
      return all.filter((doc) => doc.projectIds.includes(activeProject.id)).slice(0, 5);
    }
    return all.filter((doc) => doc.status === "indexed").slice(0, 3);
  }

  return documentIds
    .map((id) => getDocument(id))
    .filter((doc): doc is EngineeringDocumentRecord => doc !== null);
};

export const linkDocumentToProject = (
  documentId: string,
  projectId: string,
  projectName: string
): EngineeringDocumentRecord | null => {
  const doc = getDocument(documentId);
  if (!doc) return null;

  const updated: EngineeringDocumentRecord = {
    ...doc,
    projectIds: doc.projectIds.includes(projectId)
      ? doc.projectIds
      : [...doc.projectIds, projectId],
    projectNames: doc.projectNames.includes(projectName)
      ? doc.projectNames
      : [...doc.projectNames, projectName],
    updatedAt: Date.now(),
  };

  saveDocument(updated);
  return updated;
};

export const linkDocumentToWorkflow = (
  documentId: string,
  workflowId: string
): EngineeringDocumentRecord | null => {
  const doc = getDocument(documentId);
  if (!doc) return null;

  const updated: EngineeringDocumentRecord = {
    ...doc,
    workflowIds: doc.workflowIds.includes(workflowId)
      ? doc.workflowIds
      : [...doc.workflowIds, workflowId],
    updatedAt: Date.now(),
  };

  saveDocument(updated);
  return updated;
};

export const getDocumentMemorySummary = (): string => {
  const docs = listDocuments();
  if (docs.length === 0) {
    return "Document library: empty";
  }

  return [
    `Document library: ${docs.length} documents`,
    `Latest: ${docs[0]?.name ?? "none"}`,
    `Indexed: ${docs.filter((d) => d.status === "indexed").length}`,
  ].join(" | ");
};
