import React, { useMemo } from "react";
import type { EngineeringStandardMetadata } from "../../config/standards";
import type { StandardsFilterId } from "../../config/standards";
import { useStandardsIntelligence } from "../../config/standards/useStandardsIntelligence";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import CollapsibleModuleSection from "../components/CollapsibleModuleSection";
import ModuleSearchBar from "../components/ModuleSearchBar";
import type { ModuleWorkspaceProps } from "../types";
import StandardMetadataCard from "./StandardMetadataCard";

const FILTER_OPTIONS: Array<{ id: StandardsFilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "latest", label: "Latest" },
  { id: "popular", label: "Most Used" },
  { id: "recently-used", label: "Recently Viewed" },
  { id: "favourite", label: "Favorites" },
];

const StandardsList: React.FC<{
  title?: string;
  standards: EngineeringStandardMetadata[];
  emptyMessage: string;
  isFavourite: (id: string) => boolean;
  onOpen: (standard: EngineeringStandardMetadata) => void;
  onToggleFavourite: (id: string) => void;
}> = ({
  title,
  standards,
  emptyMessage,
  isFavourite,
  onOpen,
  onToggleFavourite,
}) => (
  <div className="space-y-2">
    {title ? (
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
    ) : null}
    {standards.length > 0 ? (
      <ul className="grid gap-2 sm:grid-cols-2">
        {standards.map((standard) => (
          <li key={standard.id}>
            <StandardMetadataCard
              standard={standard}
              isFavourite={isFavourite(standard.id)}
              onOpen={onOpen}
              onToggleFavourite={onToggleFavourite}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className="py-2 text-center text-xs text-slate-500">{emptyMessage}</p>
    )}
  </div>
);

const StandardsLibraryPanel: React.FC<ModuleWorkspaceProps> = () => {
  const { discipline } = useAIEngineeringWorkspace();
  const { moduleSearchQuery, openStandardKnowledge } = useSarathiWorkspace();

  const {
    activeFilter,
    setActiveFilter,
    latestStandards,
    frequentlyUsedStandards,
    recentlyViewedStandards,
    favouriteStandards,
    disciplineStandards,
    getUpdates,
    handleStandardOpen,
    handleToggleFavourite,
    isFavourite,
  } = useStandardsIntelligence(discipline.id, moduleSearchQuery);

  const visibleStandards = useMemo(() => {
    if (activeFilter === "all") return disciplineStandards;
    if (activeFilter === "latest") return latestStandards;
    if (activeFilter === "popular")
      return disciplineStandards.filter((s) => s.isPopular);
    if (activeFilter === "recently-used") return recentlyViewedStandards;
    return favouriteStandards;
  }, [
    activeFilter,
    disciplineStandards,
    favouriteStandards,
    latestStandards,
    recentlyViewedStandards,
  ]);

  const handleOpen = (standard: EngineeringStandardMetadata) => {
    handleStandardOpen(standard);
    openStandardKnowledge(standard);
  };

  const listProps = {
    isFavourite,
    onOpen: handleOpen,
    onToggleFavourite: handleToggleFavourite,
  };

  return (
    <div className="shrink-0">
      <CollapsibleModuleSection title="Standards Library">
        <div className="space-y-3">
          <ModuleSearchBar placeholder="Search standards..." />
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] transition ${
                  activeFilter === filter.id
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-700 text-slate-400 hover:bg-slate-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <StandardsList
            standards={visibleStandards}
            emptyMessage="No standards match your search."
            {...listProps}
          />
          <StandardsList
            title="Most Used"
            standards={frequentlyUsedStandards}
            emptyMessage=""
            {...listProps}
          />
          <StandardsList
            title="Recently Viewed"
            standards={recentlyViewedStandards}
            emptyMessage=""
            {...listProps}
          />
          <StandardsList
            title="Favorites"
            standards={favouriteStandards}
            emptyMessage=""
            {...listProps}
          />
          {(
            [
              ["latest-revision", "Latest Revision"],
              ["new-standard", "New Standard"],
              ["withdrawn", "Withdrawn"],
              ["superseded", "Superseded"],
            ] as const
          ).map(([updateType, label]) => (
            <StandardsList
              key={updateType}
              title={label}
              standards={getUpdates(updateType)}
              emptyMessage=""
              {...listProps}
            />
          ))}
        </div>
      </CollapsibleModuleSection>
    </div>
  );
};

export default StandardsLibraryPanel;
