import React from "react";
import type {
  WorkspaceDashboardItem,
  WorkspaceDashboardSection,
} from "../types/EngineeringWorkspaceDashboard";

const statusStyles: Record<
  NonNullable<WorkspaceDashboardItem["status"]>,
  string
> = {
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  beta: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "coming-soon":
    "border-slate-600 bg-slate-800/60 text-slate-400",
};

const sectionIcons: Record<string, string> = {
  "ai-expert": "🧠",
  "professional-tools": "🛠️",
  standards: "📜",
  templates: "📋",
  learning: "📚",
  "ai-agents": "🤖",
};

interface WorkspaceDashboardSectionProps {
  section: WorkspaceDashboardSection;
}

const WorkspaceDashboardSectionView: React.FC<
  WorkspaceDashboardSectionProps
> = ({ section }) => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {sectionIcons[section.id] ?? "📦"}
            </span>
            <h3 className="text-lg font-semibold text-white">
              {section.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {section.description}
          </p>
        </div>
        {section.isPlaceholder ? (
          <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
            Placeholder
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
            Active
          </span>
        )}
      </div>

      <ul className="space-y-2">
        {section.items.length > 0 ? (
          section.items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100">
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  ) : null}
                  {item.badge ? (
                    <p className="mt-2 text-xs text-cyan-400/80">
                      {item.badge}
                    </p>
                  ) : null}
                </div>
                {item.status ? (
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status.replace("-", " ")}
                  </span>
                ) : null}
              </div>
            </li>
          ))
        ) : (
          <li className="rounded-xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-500">
            No items available for this section yet.
          </li>
        )}
      </ul>
    </section>
  );
};

export default WorkspaceDashboardSectionView;
