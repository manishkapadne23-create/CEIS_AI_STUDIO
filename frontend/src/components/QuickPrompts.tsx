import React, { useState } from "react";
import { useDisciplineQuickPrompts } from "../workspace/hooks/useDisciplineQuickPrompts";
import { useEngineeringWorkspace } from "../context/EngineeringWorkspaceContext";

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelectPrompt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prompts = useDisciplineQuickPrompts();
  const { workspace } = useEngineeringWorkspace();

  const disciplineLabel =
    workspace.specialization ??
    workspace.domain ??
    "Engineering";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
      aria-label="Quick prompts drawer"
    >
      <div className="pointer-events-auto mx-auto max-w-4xl px-4 pb-2">
        <div className="overflow-hidden rounded-t-2xl border border-b-0 border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsExpanded((previous) => !previous)}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-900/80"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Quick Prompts
              </p>
              <p className="truncate text-sm text-slate-300">
                {disciplineLabel} tasks
              </p>
            </div>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            >
              ▲
            </span>
          </button>

          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-slate-800 px-4 py-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => onSelectPrompt(prompt.prompt)}
                      className="group rounded-lg border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-3 text-left transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">
                          {prompt.icon}
                        </span>
                        <span className="line-clamp-2 text-xs font-medium text-slate-300 transition-colors group-hover:text-cyan-300">
                          {prompt.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPrompts;
