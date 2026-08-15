import React from "react";

const ModuleWorkspaceShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-950">
    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
      {children}
    </div>
  </div>
);

export default ModuleWorkspaceShell;
