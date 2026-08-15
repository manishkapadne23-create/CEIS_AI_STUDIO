import React, { useMemo } from "react";
import { getProfessionalToolsRegistry } from "../../knowledge/professional-tools/professionalToolsRegistry";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import CollapsibleModuleSection from "../components/CollapsibleModuleSection";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleSection from "../components/ModuleSection";
import type { ModuleWorkspaceProps } from "../types";
import {
  createPlaceholderItems,
  filterModuleItems,
} from "../utils/filterModuleItems";

const TOOL_SECTIONS = [
  { id: "templates", labels: ["Design Report Template", "Project Brief Template"] },
  { id: "checklists", labels: ["Design Review Checklist", "Site Inspection Checklist"] },
  { id: "boq", labels: ["BOQ Estimator", "Rate Analysis Sheet"] },
  { id: "estimation", labels: ["Cost Estimation Worksheet", "Budget Planner"] },
  { id: "quantity", labels: ["Quantity Takeoff Sheet", "Material Summary"] },
  { id: "reports", labels: ["Progress Report", "Technical Report"] },
] as const;

const ProfessionalToolsLibraryPanel: React.FC<ModuleWorkspaceProps> = ({
  disciplineConfig,
}) => {
  const { discipline } = useAIEngineeringWorkspace();
  const { moduleSearchQuery } = useSarathiWorkspace();

  const registryTools = useMemo(() => {
    if (!discipline.id) return [];
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

  const filteredRegistryTools = filterModuleItems(
    registryTools,
    moduleSearchQuery
  );

  return (
    <div className="shrink-0">
      <CollapsibleModuleSection title="Professional Tool Library">
      <div className="space-y-4">
        <ModuleSearchBar placeholder="Search tools..." />
        {filteredRegistryTools.length > 0 ? (
          <ModuleSection
            title=""
            items={filteredRegistryTools}
            emptyMessage=""
          />
        ) : null}
        {TOOL_SECTIONS.map((section) => {
          const items = filterModuleItems(
            createPlaceholderItems(
              `${disciplineConfig.id}-${section.id}`,
              [...section.labels]
            ),
            moduleSearchQuery
          );
          return items.length > 0 ? (
            <ModuleSection key={section.id} title="" items={items} emptyMessage="" />
          ) : null;
        })}
      </div>
    </CollapsibleModuleSection>
    </div>
  );
};

export default ProfessionalToolsLibraryPanel;
