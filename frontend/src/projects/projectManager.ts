import type {
  CreateProjectInput,
  EngineeringProject,
  EngineeringProjectType,
  ProjectExtensionHooks,
} from "./types";
import {
  appendProjectActivity,
  createEmptyProjectMemory,
  getActiveProjectId,
  getStoredProject,
  hydrateProjectStorage,
  listStoredProjects,
  persistActiveProjectId,
  saveProjectMemory,
  saveStoredProject,
} from "./projectStorage";

let extensionHooks: ProjectExtensionHooks = {};

export const setProjectExtensionHooks = (
  hooks: ProjectExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getProjectExtensionHooks = (): ProjectExtensionHooks =>
  extensionHooks;

const inferProjectType = (name: string): EngineeringProjectType | string => {
  const normalized = name.toLowerCase();
  if (/expressway|highway|road/i.test(normalized)) return "highway";
  if (/building|g\+\d+|residential|commercial/i.test(normalized)) return "building";
  if (/stp|sewage|wastewater/i.test(normalized)) return "stp";
  if (/solar|pv|photovoltaic/i.test(normalized)) return "solar";
  if (/bridge/i.test(normalized)) return "bridge";
  if (/metro|rail/i.test(normalized)) return "metro";
  if (/airport/i.test(normalized)) return "airport";
  return "general";
};

export const createEngineeringProject = (
  input: CreateProjectInput
): EngineeringProject => {
  hydrateProjectStorage();

  const now = Date.now();
  const project: EngineeringProject = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    projectType: input.projectType ?? inferProjectType(input.name),
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    location: input.location ?? null,
    client: input.client ?? null,
    consultant: input.consultant ?? null,
    contractor: input.contractor ?? null,
    startDate: input.startDate ?? null,
    targetCompletion: input.targetCompletion ?? null,
    description: input.description ?? "",
    tags: input.tags ?? [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  saveStoredProject(project);
  saveProjectMemory(createEmptyProjectMemory(project.id));
  persistActiveProjectId(project.id);

  appendProjectActivity({
    id: crypto.randomUUID(),
    projectId: project.id,
    type: "project-created",
    title: `Project created: ${project.name}`,
    summary: project.description || `${project.projectType} engineering project`,
    timestamp: now,
  });

  return project;
};

export const updateEngineeringProject = (
  projectId: string,
  updates: Partial<CreateProjectInput> & { status?: EngineeringProject["status"] }
): EngineeringProject | null => {
  const project = getStoredProject(projectId);
  if (!project) return null;

  const updated: EngineeringProject = {
    ...project,
    ...updates,
    name: updates.name?.trim() ?? project.name,
    updatedAt: Date.now(),
  };

  saveStoredProject(updated);

  appendProjectActivity({
    id: crypto.randomUUID(),
    projectId,
    type: "project-updated",
    title: `Project updated: ${updated.name}`,
    summary: "Project metadata updated",
    timestamp: Date.now(),
  });

  return updated;
};

export const getActiveProject = (): EngineeringProject | null => {
  const id = getActiveProjectId();
  return id ? getStoredProject(id) : null;
};

export const setActiveProject = (projectId: string | null): EngineeringProject | null => {
  if (!projectId) {
    persistActiveProjectId(null);
    return null;
  }
  const project = getStoredProject(projectId);
  if (!project) return null;
  persistActiveProjectId(projectId);
  return project;
};

export const listEngineeringProjects = (): EngineeringProject[] =>
  listStoredProjects();

export const resolveProjectFromMessage = (
  message: string
): CreateProjectInput | null => {
  const patterns = [
    /create\s+project\s+(.+)/i,
    /new\s+project\s+(.+)/i,
    /start\s+project\s+(.+)/i,
    /open\s+project\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      const name = match[1].trim().replace(/[.!?]+$/, "");
      if (name.length >= 3) {
        return { name, description: `Engineering project: ${name}` };
      }
    }
  }

  const switchMatch = message.match(/switch\s+to\s+project\s+(.+)/i);
  if (switchMatch?.[1]) {
    const name = switchMatch[1].trim();
    const existing = listStoredProjects().find(
      (project) => project.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      setActiveProject(existing.id);
      return null;
    }
    return { name, description: `Engineering project: ${name}` };
  }

  return null;
};

export const findProjectByName = (name: string): EngineeringProject | null => {
  const normalized = name.trim().toLowerCase();
  return (
    listStoredProjects().find(
      (project) => project.name.toLowerCase() === normalized
    ) ?? null
  );
};
