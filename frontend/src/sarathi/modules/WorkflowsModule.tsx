import React, { useMemo, useState } from "react";
import { getWorkflowRegistry } from "../../knowledge/workflows/workflowRegistry";
import type { EngineeringWorkflow } from "../../knowledge/types/EngineeringWorkflow";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import WorkspaceListItemCard from "../../workspace/components/WorkspaceListItemCard";
import ModuleSearchHeader from "./ModuleSearchHeader";

const WorkflowsModule: React.FC = () => {
  const { discipline, isPlaceholderDiscipline } = useAIEngineeringWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<EngineeringWorkflow | null>(null);

  const workflows = useMemo(() => {
    if (!discipline.id) {
      return [];
    }

    return getWorkflowRegistry(discipline.id)?.workflows ?? [];
  }, [discipline.id]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return workflows;
    }

    return workflows.filter((workflow) => {
      const haystack = [workflow.title, workflow.description]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [workflows, searchQuery]);

  if (selectedWorkflow) {
    return (
      <div className="space-y-3">
        <ModuleSearchHeader
          searchQuery=""
          onSearchChange={() => undefined}
          searchPlaceholder=""
          onBack={() => setSelectedWorkflow(null)}
          detailTitle={selectedWorkflow.title}
        />
        <ol className="space-y-2">
          {selectedWorkflow.steps.map((step) => (
            <li
              key={step.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <p className="text-[10px] font-semibold text-cyan-400">
                Step {step.order}
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-200">
                {step.title}
              </p>
              <p className="mt-1 text-xs text-slate-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ModuleSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search workflows..."
      />
      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((workflow) => (
            <li key={workflow.id}>
              <WorkspaceListItemCard
                title={workflow.title}
                description={workflow.description}
                status={
                  isPlaceholderDiscipline || workflow.status === "coming-soon"
                    ? "coming-soon"
                    : "available"
                }
                badge={`${workflow.steps.length} steps`}
                onClick={() => setSelectedWorkflow(workflow)}
              />
            </li>
          ))
        ) : (
          <li className="rounded-lg border border-dashed border-slate-700 px-3 py-6 text-center text-xs text-slate-500">
            No workflows match your search.
          </li>
        )}
      </ul>
    </div>
  );
};

export default WorkflowsModule;
