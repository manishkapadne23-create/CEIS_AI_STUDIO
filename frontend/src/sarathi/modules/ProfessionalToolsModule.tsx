import React, { useMemo, useState } from "react";
import { getProfessionalToolsRegistry } from "../../knowledge/professional-tools/professionalToolsRegistry";
import type { EngineeringProfessionalTool } from "../../knowledge/types/EngineeringProfessionalTool";
import { PROFESSIONAL_TOOL_CATEGORY_LABELS } from "../../knowledge/types/EngineeringProfessionalTool";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import WorkspaceListItemCard from "../../workspace/components/WorkspaceListItemCard";
import ModuleSearchHeader from "./ModuleSearchHeader";

const ProfessionalToolsModule: React.FC = () => {
  const { discipline, isPlaceholderDiscipline } = useAIEngineeringWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] =
    useState<EngineeringProfessionalTool | null>(null);

  const tools = useMemo(() => {
    if (!discipline.id) {
      return [];
    }

    const registry = getProfessionalToolsRegistry(discipline.id);

    return (
      registry?.categories.flatMap((category) =>
        category.tools.map((tool) => ({
          ...tool,
          categoryLabel: category.label,
        }))
      ) ?? []
    );
  }, [discipline.id]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return tools;
    }

    return tools.filter((tool) => {
      const haystack = [tool.title, tool.description, tool.categoryLabel]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [tools, searchQuery]);

  if (selectedTool) {
    return (
      <div className="space-y-3">
        <ModuleSearchHeader
          searchQuery=""
          onSearchChange={() => undefined}
          searchPlaceholder=""
          onBack={() => setSelectedTool(null)}
          detailTitle={selectedTool.title}
        />
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
          <p>
            <span className="text-slate-500">Category:</span>{" "}
            {PROFESSIONAL_TOOL_CATEGORY_LABELS[selectedTool.category]}
          </p>
          <p className="mt-2 text-slate-400">{selectedTool.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ModuleSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tools..."
      />
      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((tool) => (
            <li key={tool.id}>
              <WorkspaceListItemCard
                title={tool.title}
                description={tool.description}
                status={
                  isPlaceholderDiscipline || tool.status === "coming-soon"
                    ? "coming-soon"
                    : "available"
                }
                badge={tool.categoryLabel}
                onClick={() => setSelectedTool(tool)}
              />
            </li>
          ))
        ) : (
          <li className="rounded-lg border border-dashed border-slate-700 px-3 py-6 text-center text-xs text-slate-500">
            No tools match your search.
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProfessionalToolsModule;
