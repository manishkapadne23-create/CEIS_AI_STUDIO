import React, { useMemo } from "react";
import { getProfessionalToolsRegistry } from "../../knowledge/professional-tools/professionalToolsRegistry";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleSection from "../components/ModuleSection";
import ModuleWorkspaceHeader from "../components/ModuleWorkspaceHeader";
import ModuleWorkspaceShell from "../components/ModuleWorkspaceShell";
import type { ModuleWorkspaceProps } from "../types";
import {
  createPlaceholderItems,
  filterModuleItems,
} from "../utils/filterModuleItems";

const PROFESSIONAL_TOOL_SECTIONS = [
  { id: "templates", title: "Templates", labels: ["Design Report Template", "Project Brief Template"] },
  { id: "checklists", title: "Checklists", labels: ["Design Review Checklist", "Site Inspection Checklist"] },
  { id: "boq", title: "BOQ Tools", labels: ["BOQ Estimator", "Rate Analysis Sheet"] },
  { id: "estimation", title: "Estimation Tools", labels: ["Cost Estimation Worksheet", "Budget Planner"] },
  { id: "quantity", title: "Quantity Tools", labels: ["Quantity Takeoff Sheet", "Material Summary"] },
  { id: "reports", title: "Reports", labels: ["Progress Report", "Technical Report"] },
] as const;

const ProfessionalToolsWorkspace: React.FC<ModuleWorkspaceProps> = ({
  disciplineConfig,
}) => {
  const { discipline } = useAIEngineeringWorkspace();
  const { moduleSearchQuery } = useSarathiWorkspace();

  const registryTools = useMemo(() => {
    if (!discipline.id) {
      return [];
    }

    const registry = getProfessionalToolsRegistry(discipline.id);

    return (
      registry?.categories.flatMap((category) =>
        category.tools.map((tool) => ({
          id: tool.id,
          title: tool.title,
          description: tool.description,
          badge: category.label,
        }))
      ) ?? []
    );
  }, [discipline.id]);

  const filteredRegistryTools = filterModuleItems(registryTools, moduleSearchQuery);

  return (
    <ModuleWorkspaceShell>
      <ModuleWorkspaceHeader
        disciplineConfig={disciplineConfig}
        moduleTitle={disciplineConfig.modules.professionalTools.title}
        moduleDescription={disciplineConfig.modules.professionalTools.description}
        icon="🛠️"
      />

      <div className="mb-6">
        <ModuleSearchBar placeholder="Search professional tools..." />
      </div>

      <div className="space-y-8">
        {filteredRegistryTools.length > 0 ? (
          <ModuleSection
            title="Available Tools"
            items={filteredRegistryTools}
            emptyMessage="No professional tools match your search."
          />
        ) : null}

        {PROFESSIONAL_TOOL_SECTIONS.map((section) => {
          const items = filterModuleItems(
            createPlaceholderItems(
              `${disciplineConfig.id}-${section.id}`,
              [...section.labels]
            ),
            moduleSearchQuery
          );

          return (
            <ModuleSection
              key={section.id}
              title={section.title}
              items={items}
              emptyMessage={`${section.title} will be available in a future release.`}
            />
          );
        })}
      </div>
    </ModuleWorkspaceShell>
  );
};

export default ProfessionalToolsWorkspace;
