import type {
  EngineeringProject,
  ProjectActivityRecord,
  ProjectArtifact,
  ProjectMemoryState,
} from "./types";

const STORAGE_KEYS = {
  projects: "sarathi.projects.registry",
  memories: "sarathi.projects.memories",
  activities: "sarathi.projects.activities",
  activeProjectId: "sarathi.projects.activeId",
} as const;

const projectStore = new Map<string, EngineeringProject>();
const memoryStore = new Map<string, ProjectMemoryState>();
const activityStore = new Map<string, ProjectActivityRecord[]>();
let activeProjectId: string | null = null;
let hydrated = false;

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
};

export const hydrateProjectStorage = (): void => {
  if (hydrated) return;

  const projects = readJson<EngineeringProject[]>(STORAGE_KEYS.projects, []);
  for (const project of projects) {
    projectStore.set(project.id, project);
  }

  const memories = readJson<ProjectMemoryState[]>(STORAGE_KEYS.memories, []);
  for (const memory of memories) {
    memoryStore.set(memory.projectId, memory);
  }

  const activities = readJson<Record<string, ProjectActivityRecord[]>>(
    STORAGE_KEYS.activities,
    {}
  );
  for (const [projectId, records] of Object.entries(activities)) {
    activityStore.set(projectId, records);
  }

  activeProjectId = readJson<string | null>(STORAGE_KEYS.activeProjectId, null);
  hydrated = true;
};

const persistProjects = (): void => {
  writeJson(STORAGE_KEYS.projects, Array.from(projectStore.values()));
};

const persistMemories = (): void => {
  writeJson(STORAGE_KEYS.memories, Array.from(memoryStore.values()));
};

const persistActivities = (): void => {
  const record: Record<string, ProjectActivityRecord[]> = {};
  for (const [projectId, items] of activityStore.entries()) {
    record[projectId] = items;
  }
  writeJson(STORAGE_KEYS.activities, record);
};

export const persistActiveProjectId = (projectId: string | null): void => {
  activeProjectId = projectId;
  writeJson(STORAGE_KEYS.activeProjectId, projectId);
};

export const getActiveProjectId = (): string | null => {
  hydrateProjectStorage();
  return activeProjectId;
};

export const getStoredProject = (projectId: string): EngineeringProject | null => {
  hydrateProjectStorage();
  return projectStore.get(projectId) ?? null;
};

export const listStoredProjects = (): EngineeringProject[] => {
  hydrateProjectStorage();
  return Array.from(projectStore.values()).sort(
    (a, b) => b.updatedAt - a.updatedAt
  );
};

export const saveStoredProject = (project: EngineeringProject): void => {
  hydrateProjectStorage();
  projectStore.set(project.id, project);
  persistProjects();
};

export const deleteStoredProject = (projectId: string): boolean => {
  hydrateProjectStorage();
  const deleted = projectStore.delete(projectId);
  memoryStore.delete(projectId);
  activityStore.delete(projectId);
  if (activeProjectId === projectId) {
    persistActiveProjectId(null);
  }
  persistProjects();
  persistMemories();
  persistActivities();
  return deleted;
};

export const createEmptyProjectMemory = (
  projectId: string
): ProjectMemoryState => ({
  projectId,
  chatConversationIds: [],
  uploadedDocuments: [],
  standardsUsed: [],
  calculations: [],
  reports: [],
  templates: [],
  generatedFiles: [],
  savedOutputs: [],
  workflows: [],
  aiRecommendations: [],
  lastActivityAt: Date.now(),
});

export const getStoredProjectMemory = (
  projectId: string
): ProjectMemoryState => {
  hydrateProjectStorage();
  const existing = memoryStore.get(projectId);
  if (existing) return existing;
  const created = createEmptyProjectMemory(projectId);
  memoryStore.set(projectId, created);
  persistMemories();
  return created;
};

export const saveProjectMemory = (memory: ProjectMemoryState): void => {
  hydrateProjectStorage();
  memoryStore.set(memory.projectId, {
    ...memory,
    lastActivityAt: Date.now(),
  });
  persistMemories();
};

export const appendProjectActivity = (
  record: ProjectActivityRecord
): void => {
  hydrateProjectStorage();
  const existing = activityStore.get(record.projectId) ?? [];
  activityStore.set(record.projectId, [record, ...existing].slice(0, 200));
  persistActivities();
};

export const getProjectActivities = (
  projectId: string,
  limit = 20
): ProjectActivityRecord[] => {
  hydrateProjectStorage();
  return (activityStore.get(projectId) ?? []).slice(0, limit);
};

export const saveProjectArtifact = (
  projectId: string,
  artifact: ProjectArtifact
): void => {
  const memory = getStoredProjectMemory(projectId);

  const upsert = (list: ProjectArtifact[]) => {
    const index = list.findIndex((item) => item.id === artifact.id);
    if (index >= 0) {
      const next = [...list];
      next[index] = artifact;
      return next;
    }
    return [artifact, ...list];
  };

  const updated: ProjectMemoryState = { ...memory };

  switch (artifact.type) {
    case "document":
      updated.uploadedDocuments = upsert(memory.uploadedDocuments);
      break;
    case "calculation":
      updated.calculations = upsert(memory.calculations);
      break;
    case "report":
      updated.reports = upsert(memory.reports);
      break;
    case "template":
      updated.templates = upsert(memory.templates);
      break;
    case "generated-file":
      updated.generatedFiles = upsert(memory.generatedFiles);
      break;
    case "saved-output":
      updated.savedOutputs = upsert(memory.savedOutputs);
      break;
    default:
      updated.savedOutputs = upsert(memory.savedOutputs);
  }

  saveProjectMemory(updated);
};

export const resetProjectStorage = (): void => {
  projectStore.clear();
  memoryStore.clear();
  activityStore.clear();
  activeProjectId = null;
  hydrated = true;
  try {
    localStorage.removeItem(STORAGE_KEYS.projects);
    localStorage.removeItem(STORAGE_KEYS.memories);
    localStorage.removeItem(STORAGE_KEYS.activities);
    localStorage.removeItem(STORAGE_KEYS.activeProjectId);
  } catch {
    // Ignore.
  }
};
