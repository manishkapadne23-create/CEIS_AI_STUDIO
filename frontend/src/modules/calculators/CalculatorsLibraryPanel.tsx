import React, { useMemo, useState } from "react";
import type { CalculatorsFilterId } from "../../config/calculators";
import type { EngineeringCalculatorMetadata } from "../../config/calculators";
import { useCalculatorFramework } from "../../config/calculators/useCalculatorFramework";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import CollapsibleModuleSection from "../components/CollapsibleModuleSection";
import ModuleSearchBar from "../components/ModuleSearchBar";
import type { ModuleWorkspaceProps } from "../types";
import CalculatorMetadataCard from "./CalculatorMetadataCard";
import CalculatorMetadataViewer from "./CalculatorMetadataViewer";

const FILTER_OPTIONS: Array<{ id: CalculatorsFilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "recently-used", label: "Recent" },
  { id: "favourite", label: "Favorites" },
];

const CalculatorsLibraryPanel: React.FC<ModuleWorkspaceProps> = () => {
  const { discipline } = useAIEngineeringWorkspace();
  const { moduleSearchQuery } = useSarathiWorkspace();
  const [selectedCalculator, setSelectedCalculator] =
    useState<EngineeringCalculatorMetadata | null>(null);

  const {
    activeFilter,
    setActiveFilter,
    disciplineCalculators,
    filteredCalculators,
    handleCalculatorOpen,
    handleToggleFavourite,
    handleShareCalculator,
    isFavourite,
  } = useCalculatorFramework(discipline.id, moduleSearchQuery);

  const visibleCalculators = useMemo(() => {
    if (activeFilter === "all") return disciplineCalculators;
    return filteredCalculators;
  }, [activeFilter, disciplineCalculators, filteredCalculators]);

  const handleOpen = (calculator: EngineeringCalculatorMetadata) => {
    handleCalculatorOpen(calculator);
    setSelectedCalculator(calculator);
  };

  return (
    <div className="shrink-0">
      <CollapsibleModuleSection title="Calculator Library">
        <div className="space-y-3">
          <ModuleSearchBar placeholder="Search calculators..." />
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
          {visibleCalculators.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {visibleCalculators.map((calculator) => (
                <li key={calculator.id}>
                  <CalculatorMetadataCard
                    calculator={calculator}
                    isFavourite={isFavourite(calculator.id)}
                    onOpen={handleOpen}
                    onToggleFavourite={handleToggleFavourite}
                    onShare={handleShareCalculator}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-xs text-slate-500">
              No calculators match your search.
            </p>
          )}
        </div>
      </CollapsibleModuleSection>

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
    </div>
  );
};

export default CalculatorsLibraryPanel;
