import React, { useMemo, useState } from "react";
import type { EngineeringCalculator } from "../../knowledge/types/EngineeringCalculator";
import { getCalculatorRegistry } from "../../knowledge/calculators/calculatorRegistry";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import WorkspaceListItemCard from "../../workspace/components/WorkspaceListItemCard";
import ModuleSearchHeader from "./ModuleSearchHeader";

const CalculatorPlaceholderViewer: React.FC<{
  calculator: EngineeringCalculator;
  onBack: () => void;
}> = ({ calculator, onBack }) => (
  <div className="space-y-3">
    <ModuleSearchHeader
      searchQuery=""
      onSearchChange={() => undefined}
      searchPlaceholder=""
      onBack={onBack}
      detailTitle={calculator.title}
    />
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        Inputs
      </p>
      <ul className="mt-2 space-y-1.5">
        {calculator.inputs.map((input) => (
          <li
            key={input.id}
            className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300"
          >
            {input.label}
            {input.unit ? ` (${input.unit})` : ""}
            {input.required ? " *" : ""}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] uppercase tracking-wide text-slate-500">
        Outputs
      </p>
      <ul className="mt-2 space-y-1.5">
        {calculator.outputs.map((output) => (
          <li
            key={output.id}
            className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-400"
          >
            {output.label}
            {output.unit ? ` (${output.unit})` : ""}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const CalculatorsModule: React.FC = () => {
  const { discipline, isPlaceholderDiscipline } = useAIEngineeringWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const calculators = useMemo(() => {
    if (!discipline.id) {
      return [];
    }

    return getCalculatorRegistry(discipline.id)?.calculators ?? [];
  }, [discipline.id]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return calculators;
    }

    return calculators.filter((calculator) => {
      const haystack = [
        calculator.title,
        calculator.description,
        calculator.category,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [calculators, searchQuery]);

  const selected = calculators.find(
    (calculator) => calculator.id === selectedId
  );

  if (selected) {
    return (
      <CalculatorPlaceholderViewer
        calculator={selected}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <ModuleSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search calculators..."
      />
      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((calculator) => (
            <li key={calculator.id}>
              <WorkspaceListItemCard
                title={calculator.title}
                description={calculator.description}
                status={
                  isPlaceholderDiscipline || calculator.status === "coming-soon"
                    ? "coming-soon"
                    : "available"
                }
                badge={calculator.category}
                onClick={() => setSelectedId(calculator.id)}
              />
            </li>
          ))
        ) : (
          <li className="rounded-lg border border-dashed border-slate-700 px-3 py-6 text-center text-xs text-slate-500">
            No calculators match your search.
          </li>
        )}
      </ul>
    </div>
  );
};

export default CalculatorsModule;
