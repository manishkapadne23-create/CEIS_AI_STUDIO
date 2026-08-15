import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { EngineeringStandardMetadata } from "../../config/standards";
import type { StandardsFilterId } from "../../config/standards";
import { useStandardsIntelligence } from "../../config/standards/useStandardsIntelligence";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { APP_ROUTES } from "../../navigation/routeConfig";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleWorkspaceHeader from "../components/ModuleWorkspaceHeader";
import ModuleWorkspaceShell from "../components/ModuleWorkspaceShell";
import type { ModuleWorkspaceProps } from "../types";
import StandardMetadataCard from "./StandardMetadataCard";

const FILTER_OPTIONS: Array<{ id: StandardsFilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "latest", label: "Latest" },
  { id: "popular", label: "Most Used" },
  { id: "recently-used", label: "Recently Viewed" },
  { id: "favourite", label: "Favorites" },
];

const StandardsSection: React.FC<{
  title: string;
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
  <section className="space-y-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </h3>
    {standards.length > 0 ? (
      <ul className="grid gap-3 sm:grid-cols-2">
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
      <p className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    )}
  </section>
);

const StandardsWorkspace: React.FC<ModuleWorkspaceProps> = ({
  disciplineConfig,
}) => {
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
    matchedClauses,
    getUpdates,
    handleStandardOpen,
    handleToggleFavourite,
    isFavourite,
  } = useStandardsIntelligence(discipline.id, moduleSearchQuery);

  const visibleStandards = useMemo(() => {
    if (activeFilter === "all") {
      return disciplineStandards;
    }

    if (activeFilter === "latest") {
      return latestStandards;
    }

    if (activeFilter === "popular") {
      return disciplineStandards.filter((standard) => standard.isPopular);
    }

    if (activeFilter === "recently-used") {
      return recentlyViewedStandards;
    }

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

  return (
    <ModuleWorkspaceShell>
      <ModuleWorkspaceHeader
        disciplineConfig={disciplineConfig}
        moduleTitle={disciplineConfig.modules.standards.title}
        moduleDescription={disciplineConfig.modules.standards.description}
        icon="📜"
      />

      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ModuleSearchBar placeholder="Search by code, keyword, clause, discipline, year, or revision..." />
          <Link
            to={APP_ROUTES.standardsIntelligence}
            className="shrink-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/20"
          >
            Standards Intelligence →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                activeFilter === filter.id
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 text-slate-400 hover:bg-slate-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {matchedClauses.length > 0 ? (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Clause Matches
            </h3>
            <ul className="space-y-2">
              {matchedClauses.slice(0, 8).map((clause) => (
                <li key={clause.id}>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm">
                    <p className="font-medium text-slate-200">
                      {clause.standardCode} §{clause.clauseNumber} — {clause.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {clause.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <StandardsSection
          title="Latest Standards"
          standards={latestStandards}
          emptyMessage="Latest standards will appear for this discipline."
          isFavourite={isFavourite}
          onOpen={handleOpen}
          onToggleFavourite={handleToggleFavourite}
        />
        <StandardsSection
          title="Most Used"
          standards={frequentlyUsedStandards}
          emptyMessage="Most used standards will appear as you explore the workspace."
          isFavourite={isFavourite}
          onOpen={handleOpen}
          onToggleFavourite={handleToggleFavourite}
        />
        <StandardsSection
          title="Recently Viewed"
          standards={recentlyViewedStandards}
          emptyMessage="Recently viewed standards will appear here."
          isFavourite={isFavourite}
          onOpen={handleOpen}
          onToggleFavourite={handleToggleFavourite}
        />
        <StandardsSection
          title="Discipline Standards Library"
          standards={visibleStandards}
          emptyMessage="No standards match your search or filter."
          isFavourite={isFavourite}
          onOpen={handleOpen}
          onToggleFavourite={handleToggleFavourite}
        />
        <StandardsSection
          title="Favorites"
          standards={favouriteStandards}
          emptyMessage="Mark standards as favorites to keep them here."
          isFavourite={isFavourite}
          onOpen={handleOpen}
          onToggleFavourite={handleToggleFavourite}
        />

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Updates
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {(
              [
                ["latest-revision", "Latest Revision"],
                ["new-standard", "New Standard"],
                ["withdrawn", "Withdrawn Standard"],
                ["superseded", "Superseded Standard"],
              ] as const
            ).map(([updateType, label]) => (
              <StandardsSection
                key={updateType}
                title={label}
                standards={getUpdates(updateType)}
                emptyMessage={`No ${label.toLowerCase()} entries yet.`}
                isFavourite={isFavourite}
                onOpen={handleOpen}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        </section>
      </div>
    </ModuleWorkspaceShell>
  );
};

export default StandardsWorkspace;
