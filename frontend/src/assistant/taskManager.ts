import type {
  CreateTaskInput,
  EngineeringTask,
  EngineeringTaskCategory,
  TaskPriority,
} from "./types";

const STORAGE_KEY = "sarathi.assistant.tasks";

let taskStore: EngineeringTask[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    taskStore = raw ? (JSON.parse(raw) as EngineeringTask[]) : [];
  } catch {
    taskStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskStore.slice(0, 300)));
};

const inferCategory = (name: string): EngineeringTaskCategory => {
  const text = name.toLowerCase();
  if (/inspect|checklist|qa/i.test(text)) return "inspection";
  if (/study|learn|course/i.test(text)) return "study";
  if (/document|report|dpr|spec/i.test(text)) return "documentation";
  if (/calculate|design|analysis/i.test(text)) return "technical";
  if (/personal|admin/i.test(text)) return "personal";
  return "engineering";
};

const inferPriority = (name: string): TaskPriority => {
  const text = name.toLowerCase();
  if (/critical|urgent|asap/i.test(text)) return "critical";
  if (/high\s+priority|important/i.test(text)) return "high";
  if (/low\s+priority|optional/i.test(text)) return "low";
  return "medium";
};

export const createTask = (input: CreateTaskInput): EngineeringTask => {
  hydrate();
  const now = Date.now();
  const task: EngineeringTask = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    category: input.category ?? inferCategory(input.name),
    priority: input.priority ?? inferPriority(input.name),
    dueDate: input.dueDate ?? null,
    reminderAt: null,
    notes: input.notes ?? "",
    attachments: [],
    status: "pending",
    pinned: false,
    archived: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
  taskStore.unshift(task);
  persist();
  return task;
};

export const updateTask = (
  taskId: string,
  updates: Partial<EngineeringTask>
): EngineeringTask | null => {
  hydrate();
  const index = taskStore.findIndex((t) => t.id === taskId);
  if (index < 0) return null;
  taskStore[index] = {
    ...taskStore[index],
    ...updates,
    updatedAt: Date.now(),
  };
  persist();
  return taskStore[index];
};

export const deleteTask = (taskId: string): boolean => {
  hydrate();
  const before = taskStore.length;
  taskStore = taskStore.filter((t) => t.id !== taskId);
  if (taskStore.length !== before) {
    persist();
    return true;
  }
  return false;
};

export const completeTask = (taskId: string): EngineeringTask | null =>
  updateTask(taskId, { status: "completed", completedAt: Date.now() });

export const archiveTask = (taskId: string): EngineeringTask | null =>
  updateTask(taskId, { archived: true });

export const pinTask = (taskId: string, pinned = true): EngineeringTask | null =>
  updateTask(taskId, { pinned });

export const duplicateTask = (taskId: string): EngineeringTask | null => {
  hydrate();
  const source = taskStore.find((t) => t.id === taskId);
  if (!source) return null;
  return createTask({
    name: `${source.name} (copy)`,
    disciplineId: source.disciplineId,
    disciplineName: source.disciplineName,
    category: source.category,
    priority: source.priority,
    dueDate: source.dueDate,
    notes: source.notes,
  });
};

export const listTasks = (includeArchived = false): EngineeringTask[] => {
  hydrate();
  return taskStore
    .filter((t) => includeArchived || !t.archived)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
};

export const getTask = (taskId: string): EngineeringTask | null => {
  hydrate();
  return taskStore.find((t) => t.id === taskId) ?? null;
};

export const findTaskByName = (name: string): EngineeringTask | null => {
  hydrate();
  const normalized = name.toLowerCase();
  return (
    taskStore.find((t) => t.name.toLowerCase().includes(normalized)) ?? null
  );
};

export const getPendingTasks = (): EngineeringTask[] =>
  listTasks().filter(
    (t) => t.status === "pending" || t.status === "in-progress"
  );

export const parseTaskCommand = (
  message: string
): { action: string; payload: string } | null => {
  const createMatch = message.match(
    /^(?:create|add|new)\s+task\s*[:\-]?\s*(.+)$/i
  );
  if (createMatch) return { action: "create", payload: createMatch[1].trim() };

  const completeMatch = message.match(
    /^(?:complete|finish|done)\s+task\s*[:\-]?\s*(.+)$/i
  );
  if (completeMatch) return { action: "complete", payload: completeMatch[1].trim() };

  const deleteMatch = message.match(
    /^(?:delete|remove)\s+task\s*[:\-]?\s*(.+)$/i
  );
  if (deleteMatch) return { action: "delete", payload: deleteMatch[1].trim() };

  const listMatch = message.match(
    /^(?:list|show|my)\s+tasks?$/i
  );
  if (listMatch) return { action: "list", payload: "" };

  const pinMatch = message.match(/^pin\s+task\s*[:\-]?\s*(.+)$/i);
  if (pinMatch) return { action: "pin", payload: pinMatch[1].trim() };

  return null;
};
