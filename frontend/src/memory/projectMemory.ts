import { getActiveProject, listEngineeringProjects } from "../projects/projectManager";
import { getProjectMemory } from "../projects/projectMemory";
import type { MemorySearchResult } from "./types";

export const getProjectMemorySummary = () => {
  const active = getActiveProject();
  const projects = listEngineeringProjects();
  const activeMemory = active ? getProjectMemory(active.id) : null;

  return {
    activeProject: active,
    projectCount: projects.length,
    recentDocuments: activeMemory?.uploadedDocuments.slice(0, 5) ?? [],
    recentReports: activeMemory?.reports.slice(0, 5) ?? [],
    recentDecisions: activeMemory?.aiRecommendations.slice(0, 5) ?? [],
    recentWorkflows: activeMemory?.workflows.slice(0, 5) ?? [],
    recentCalculations: activeMemory?.calculations.slice(0, 5) ?? [],
  };
};

export const searchProjectMemory = (query: string): MemorySearchResult[] => {
  const normalized = query.toLowerCase();
  const results: MemorySearchResult[] = [];

  for (const project of listEngineeringProjects()) {
    const haystack = `${project.name} ${project.projectType} ${project.client ?? ""} ${project.description}`.toLowerCase();
    if (!normalized || haystack.includes(normalized)) {
      results.push({
        id: `project-${project.id}`,
        category: "projects",
        title: project.name,
        description: `${project.projectType}${project.client ? ` · ${project.client}` : ""}`,
        timestamp: project.updatedAt,
        resourceId: project.id,
        route: "/chat",
      });
    }

    const memory = getProjectMemory(project.id);
    for (const doc of memory.uploadedDocuments) {
      if (!normalized || doc.title.toLowerCase().includes(normalized)) {
        results.push({
          id: `project-doc-${doc.id}`,
          category: "documents",
          title: doc.title,
          description: `Project: ${project.name}`,
          timestamp: doc.updatedAt,
          resourceId: doc.id,
        });
      }
    }
    for (const report of memory.reports) {
      if (!normalized || report.title.toLowerCase().includes(normalized)) {
        results.push({
          id: `project-report-${report.id}`,
          category: "reports",
          title: report.title,
          description: `Report in ${project.name}`,
          timestamp: report.updatedAt,
          resourceId: report.id,
        });
      }
    }
    for (const calc of memory.calculations) {
      if (!normalized || calc.title.toLowerCase().includes(normalized)) {
        results.push({
          id: `project-calc-${calc.id}`,
          category: "calculations",
          title: calc.title,
          description: `Calculation in ${project.name}`,
          timestamp: calc.updatedAt,
          resourceId: calc.id,
        });
      }
    }
    for (const workflow of memory.workflows) {
      if (!normalized || workflow.workflowTitle.toLowerCase().includes(normalized)) {
        results.push({
          id: `project-wf-${workflow.workflowId}`,
          category: "workflows",
          title: workflow.workflowTitle,
          description: `Workflow in ${project.name}`,
          timestamp: workflow.updatedAt,
          resourceId: workflow.workflowId,
        });
      }
    }
  }

  return results.sort((a, b) => b.timestamp - a.timestamp);
};
