import React, { useState } from "react";

interface CollapsibleModuleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleModuleSection: React.FC<CollapsibleModuleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-slate-800/80 bg-slate-950/80">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-400 transition hover:bg-slate-900/60 sm:px-4"
      >
        <span
          className="text-xs text-slate-500"
          aria-hidden="true"
        >
          {isOpen ? "▼" : "▶"}
        </span>
        <span>{title}</span>
      </button>
      {isOpen ? (
        <div className="max-h-56 overflow-y-auto overscroll-contain border-t border-slate-800/60 px-4 py-3 sm:px-6">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default CollapsibleModuleSection;
