import React from "react";

import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

const ActiveEngineeringContextBanner: React.FC = () => {
  const { activeDiscipline, activeSpecialization } = useSarathiWorkspace();

  const disciplineName = activeDiscipline?.name ?? null;
  const specializationName = activeSpecialization?.name ?? null;

  if (!disciplineName && !specializationName) {
    return null;
  }

  const contextLabel =
    disciplineName && specializationName
      ? `${disciplineName} → ${specializationName}`
      : disciplineName ?? specializationName;

  return (
    <div className="border-b border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Current Context
      </p>
      <p className="mt-0.5 text-sm font-medium text-cyan-200">{contextLabel}</p>
    </div>
  );
};

export default ActiveEngineeringContextBanner;
