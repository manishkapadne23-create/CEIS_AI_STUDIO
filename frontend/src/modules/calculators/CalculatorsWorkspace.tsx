import React, { useMemo, useState } from "react";
import type { CalculatorsFilterId } from "../../config/calculators";
import type { EngineeringCalculatorMetadata } from "../../config/calculators";
import { useCalculatorFramework } from "../../config/calculators/useCalculatorFramework";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import ModuleSearchBar from "../components/ModuleSearchBar";
import ModuleWorkspaceHeader from "../components/ModuleWorkspaceHeader";
import ModuleWorkspaceShell from "../components/ModuleWorkspaceShell";
import type { ModuleWorkspaceProps } from "../types";
import CalculatorMetadataCard from "./CalculatorMetadataCard";
import CalculatorMetadataViewer from "./CalculatorMetadataViewer";

const FILTER_OPTIONS: Array<{ id: CalculatorsFilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "recently-used", label: "Recently Used" },
  { id: "favourite", label: "Favourite" },
];

const CalculatorsSection: React.FC<{
  title: string;
  calculators: EngineeringCalculatorMetadata[];
  emptyMessage: string;
  isFavourite: (id: string) => boolean;
  onOpen: (calculator: EngineeringCalculatorMetadata) => void;
  onToggleFavourite: (id: string) => void;
  onShare: (calculator: EngineeringCalculatorMetadata) => void;
}> = ({
  title,
  calculators,
  emptyMessage,
  isFavourite,
  onOpen,
  onToggleFavourite,
  onShare,
}) => (
  <section className="space-y-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </h3>
    {calculators.length > 0 ? (
      <ul className="grid gap-3 sm:grid-cols-2">
        {calculators.map((calculator) => (
          <li key={calculator.id}>
            <CalculatorMetadataCard
              calculator={calculator}
              isFavourite={isFavourite(calculator.id)}
              onOpen={onOpen}
              onToggleFavourite={onToggleFavourite}
              onShare={onShare}
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

const CalculatorsWorkspace: React.FC<ModuleWorkspaceProps> = ({
  disciplineConfig,
}) => {
  const { discipline } = useAIEngineeringWorkspace();
  const { moduleSearchQuery } = useSarathiWorkspace();
  const [selectedCalculator, setSelectedCalculator] =
    useState<EngineeringCalculatorMetadata | null>(null);

  const {
    activeFilter,
    setActiveFilter,
    popularCalculators,
    recentlyUsedCalculators,
    favouriteCalculators,
    disciplineCalculators,
    filteredCalculators,
    handleCalculatorOpen,
    handleToggleFavourite,
    handleShareCalculator,
    isFavourite,
  } = useCalculatorFramework(discipline.id, moduleSearchQuery);

  const visibleCalculators = useMemo(() => {
    if (activeFilter === "all") {
      return disciplineCalculators;
    }

    return filteredCalculators;
  }, [activeFilter, disciplineCalculators, filteredCalculators]);

  const handleOpen = (calculator: EngineeringCalculatorMetadata) => {
    handleCalculatorOpen(calculator);
    setSelectedCalculator(calculator);
  };

  return (
    <>
      <ModuleWorkspaceShell>
        <ModuleWorkspaceHeader
          disciplineConfig={disciplineConfig}
          moduleTitle={disciplineConfig.modules.calculators.title}
          moduleDescription={disciplineConfig.modules.calculators.description}
          icon="🔢"
        />

        <div className="mb-4 space-y-3">
          <ModuleSearchBar placeholder="Search calculators by name, category, or discipline..." />
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
          <CalculatorsSection
            title="Available Calculators"
            calculators={visibleCalculators}
            emptyMessage="No calculators match your search or filter."
            isFavourite={isFavourite}
            onOpen={handleOpen}
            onToggleFavourite={handleToggleFavourite}
            onShare={handleShareCalculator}
          />
          <CalculatorsSection
            title="Recently Used"
            calculators={recentlyUsedCalculators}
            emptyMessage="Recently used calculators will appear here."
            isFavourite={isFavourite}
            onOpen={handleOpen}
            onToggleFavourite={handleToggleFavourite}
            onShare={handleShareCalculator}
          />
          <CalculatorsSection
            title="Popular Calculators"
            calculators={popularCalculators}
            emptyMessage="Popular calculators will appear for this discipline."
            isFavourite={isFavourite}
            onOpen={handleOpen}
            onToggleFavourite={handleToggleFavourite}
            onShare={handleShareCalculator}
          />
          <CalculatorsSection
            title="Favourite Calculators"
            calculators={favouriteCalculators}
            emptyMessage="Mark calculators as favourites to keep them here."
            isFavourite={isFavourite}
            onOpen={handleOpen}
            onToggleFavourite={handleToggleFavourite}
            onShare={handleShareCalculator}
          />
        </div>
      </ModuleWorkspaceShell>

      {selectedCalculator ? (
        <CalculatorMetadataViewer
          calculator={selectedCalculator}
          isFavourite={isFavourite(selectedCalculator.id)}
          onClose={() => setSelectedCalculator(null)}
          onToggleFavourite={() =>
            handleToggleFavourite(selectedCalculator.id)
          }
          onShare={() => handleShareCalculator(selectedCalculator)}
        />
      ) : null}
    </>
  );
};

export default CalculatorsWorkspace;
