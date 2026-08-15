import type {
  EngineeringDeliverableType,
  EngineeringOutputType,
  SavedWorkspaceItem,
  WorkspaceSaveCategory,
} from "./types";

const STORAGE_KEY = "sarathi.workspace.savedItems";

const inMemoryStore: SavedWorkspaceItem[] = [];

const readPersistedItems = (): SavedWorkspaceItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedWorkspaceItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writePersistedItems = (items: SavedWorkspaceItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures.
  }
};

const getAllItems = (): SavedWorkspaceItem[] => {
  if (inMemoryStore.length === 0) {
    inMemoryStore.push(...readPersistedItems());
  }
  return inMemoryStore;
};

const persist = (): void => {
  writePersistedItems(inMemoryStore);
};

export interface SaveToWorkspaceInput {
  title: string;
  content: string;
  category: WorkspaceSaveCategory;
  disciplineId?: string | null;
  disciplineName?: string | null;
  deliverableType?: EngineeringDeliverableType;
  outputType?: EngineeringOutputType;
  conversationId?: string;
  messageId?: string;
  projectId?: string;
}

export const saveToWorkspace = (
  input: SaveToWorkspaceInput
): SavedWorkspaceItem => {
  const item: SavedWorkspaceItem = {
    id: crypto.randomUUID(),
    category: input.category,
    title: input.title,
    content: input.content,
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    deliverableType: input.deliverableType,
    outputType: input.outputType,
    conversationId: input.conversationId,
    messageId: input.messageId,
    projectId: input.projectId,
    createdAt: Date.now(),
  };

  getAllItems();
  inMemoryStore.unshift(item);
  persist();

  return item;
};

export const resolveWorkspaceCategory = (
  deliverableType?: EngineeringDeliverableType
): WorkspaceSaveCategory => {
  if (!deliverableType) return "documents";

  if (
    deliverableType === "report" ||
    deliverableType === "dpr-section" ||
    deliverableType === "meeting-minutes" ||
    deliverableType === "risk-assessment" ||
    deliverableType === "technical-presentation"
  ) {
    return "reports";
  }

  if (
    deliverableType === "calculation-sheet" ||
    deliverableType === "estimate" ||
    deliverableType === "boq"
  ) {
    return "calculations";
  }

  if (
    deliverableType === "checklist" ||
    deliverableType === "inspection-format" ||
    deliverableType === "sop" ||
    deliverableType === "test-format" ||
    deliverableType === "method-statement"
  ) {
    return "templates";
  }

  return "documents";
};

export const listWorkspaceItems = (
  category?: WorkspaceSaveCategory
): SavedWorkspaceItem[] => {
  const items = getAllItems();
  return category ? items.filter((item) => item.category === category) : items;
};

export const getWorkspaceItem = (id: string): SavedWorkspaceItem | null =>
  getAllItems().find((item) => item.id === id) ?? null;

export const deleteWorkspaceItem = (id: string): boolean => {
  const index = inMemoryStore.findIndex((item) => item.id === id);
  if (index === -1) return false;
  inMemoryStore.splice(index, 1);
  persist();
  return true;
};

export const clearWorkspaceStore = (): void => {
  inMemoryStore.length = 0;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
};
