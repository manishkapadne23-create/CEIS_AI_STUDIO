import React, { useEffect } from "react";
import { useEngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import {
  ENGINEERING_DOMAIN_OPTIONS,
  type EngineeringDomainName,
} from "../types/engineeringDomainSelector";

export interface EngineeringDomainSelectorProps {
  selectedDomain?: EngineeringDomainName | null;
  onSelect?: (domain: EngineeringDomainName) => void;
}

const EngineeringDomainSelector: React.FC<
  EngineeringDomainSelectorProps
> = ({ selectedDomain, onSelect }) => {
  const { workspace, setDomain, setBranch, setSpecialization } =
    useEngineeringWorkspace();

  useEffect(() => {
    if (selectedDomain && workspace.domain !== selectedDomain) {
      setDomain(selectedDomain);
    }
  }, [selectedDomain, setDomain, workspace.domain]);

  const activeDomain = workspace.domain ?? selectedDomain ?? null;

  const handleDomainClick = (domainName: EngineeringDomainName) => {
    setDomain(domainName);
    setBranch(null);
    setSpecialization(null);
    onSelect?.(domainName);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Engineering Domain
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ENGINEERING_DOMAIN_OPTIONS.map((domain) => {
          const isSelected = activeDomain === domain.name;

          return (
            <button
              key={domain.name}
              type="button"
              onClick={() => handleDomainClick(domain.name)}
              aria-pressed={isSelected}
              className={`rounded-xl border p-3 text-left transition hover:border-cyan-500 hover:bg-slate-800 ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                  : "border-slate-800 bg-slate-950/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {domain.icon}
                </span>
                <span
                  className={`flex-1 text-sm font-semibold ${
                    isSelected ? "text-cyan-300" : "text-white"
                  }`}
                >
                  {domain.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EngineeringDomainSelector;
