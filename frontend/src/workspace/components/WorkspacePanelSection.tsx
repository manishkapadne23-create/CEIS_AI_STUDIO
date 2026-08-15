import React from "react";
import type { WorkspaceDashboardSection } from "../types/EngineeringWorkspaceDashboard";
import WorkspaceListItemCard from "./WorkspaceListItemCard";

const defaultSectionIcons: Record<string, string> = {
  "ai-expert": "🧠",
  standards: "📜",
  calculators: "🔢",
  "professional-tools": "🛠️",
  workflows: "🔄",
  "quick-tasks": "⚡",
};

export interface WorkspacePanelSectionProps {
  section: WorkspaceDashboardSection;
  icon?: string;
  compact?: boolean;
}

const WorkspacePanelSection: React.FC<WorkspacePanelSectionProps> = ({
  section,
  icon,
  compact = false,
}) => {
  const sectionIcon = icon ?? defaultSectionIcons[section.id] ?? "📦";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            {sectionIcon}
          </span>
          <h3 className="line-clamp-2 text-base font-semibold text-white sm:text-lg">
            {section.title}
          </h3>
        </div>
        <div className="mt-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              section.isPlaceholder
                ? "border-slate-600 bg-slate-800/60 text-slate-400"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
            }`}
          >
            {section.isPlaceholder ? "Coming Soon" : "Active"}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
          {section.description}
        </p>
      </div>

      <ul
        className={
          compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"
        }
      >
        {section.items.length > 0 ? (
          section.items.map((item) => (
            <li key={item.id}>
              <WorkspaceListItemCard
                title={item.title}
                description={item.description}
                status={item.status}
                badge={item.badge}
                icon={item.icon}
              />
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

export default WorkspacePanelSection;
