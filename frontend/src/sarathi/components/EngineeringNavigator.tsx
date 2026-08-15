import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import {
  getDisciplineDefinitionByName,
  getNavigatorSpecializations,
} from "../utils/navigatorTree";
import WorkspacePanelHeader from "./WorkspacePanelHeader";
import { ENGINEERING_DOMAIN_OPTIONS } from "../../types/engineeringDomainSelector";
import { buildKnowledgeWorkspacePath } from "../../knowledge/framework/knowledgeRoutes";

const NavigatorListItem: React.FC<{
  title: string;
  subtitle?: string;
  icon?: string;
  isActive?: boolean;
  onClick: () => void;
}> = ({ title, subtitle, icon, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
      isActive
        ? "border-cyan-500 bg-cyan-500/10 text-cyan-200"
        : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
    }`}
  >
    {icon ? (
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
    ) : null}
    <span className="min-w-0">
      <span className="block text-sm font-medium">{title}</span>
      {subtitle ? (
        <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>
      ) : null}
    </span>
  </button>
);

const EngineeringNavigator: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedDiscipline,
    selectedSpecialization,
    navigatorView,
    selectDiscipline,
    selectSpecialization,
    navigateBack,
  } = useSarathiWorkspace();

  const specializations = useMemo(() => {
    if (!selectedDiscipline) {
      return [];
    }

    return getNavigatorSpecializations(
      selectedDiscipline.id,
      selectedDiscipline.name
    );
  }, [selectedDiscipline]);

  const breadcrumb =
    navigatorView === "disciplines"
      ? "All Engineering"
      : selectedDiscipline?.name ?? "Discipline";

  const handleSpecializationSelect = (path: Parameters<typeof selectSpecialization>[0]) => {
    selectSpecialization(path);
    if (selectedDiscipline) {
      const specializationId = path[path.length - 1]?.id;
      if (specializationId) {
        navigate(
          buildKnowledgeWorkspacePath(selectedDiscipline.id, specializationId)
        );
      }
    }
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-800 bg-slate-950/80">
      <WorkspacePanelHeader
        label="Engineering Navigator"
        title={breadcrumb}
        icon="🧭"
        action={
          navigatorView !== "disciplines" ? (
            <button
              type="button"
              onClick={navigateBack}
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-900"
            >
              ← Back
            </button>
          ) : null
        }
      />

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {navigatorView === "disciplines"
          ? ENGINEERING_DOMAIN_OPTIONS.map((domain) => {
              const definition = getDisciplineDefinitionByName(domain.name);
              const isActive = selectedDiscipline?.name === domain.name;

              return (
                <NavigatorListItem
                  key={domain.name}
                  title={domain.name}
                  icon={domain.icon}
                  subtitle="View specializations"
                  isActive={isActive}
                  onClick={() => {
                    if (definition) {
                      selectDiscipline(definition.id, definition.name);
                    }
                  }}
                />
              );
            })
          : null}

        {navigatorView === "specializations"
          ? specializations.map(({ node, path }) => {
              const isActive = selectedSpecialization?.id === node.id;

              return (
                <NavigatorListItem
                  key={node.id}
                  title={node.name}
                  subtitle="Activate specialization context"
                  isActive={isActive}
                  onClick={() => handleSpecializationSelect(path)}
                />
              );
            })
          : null}
      </div>
    </aside>
  );
};

export default EngineeringNavigator;
