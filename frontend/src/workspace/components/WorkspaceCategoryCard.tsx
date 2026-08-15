import React from "react";

export type WorkspaceCategoryStatus = "active" | "available" | "coming-soon";

const statusStyles: Record<WorkspaceCategoryStatus, string> = {
  active: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "coming-soon": "border-slate-600 bg-slate-800/60 text-slate-400",
};

const statusLabels: Record<WorkspaceCategoryStatus, string> = {
  active: "Active",
  available: "Available",
  "coming-soon": "Coming Soon",
};

export interface WorkspaceCategoryCardProps {
  icon: string;
  title: string;
  description: string;
  status: WorkspaceCategoryStatus;
  itemCount?: number;
  onOpen: () => void;
}

const WorkspaceCategoryCard: React.FC<WorkspaceCategoryCardProps> = ({
  icon,
  title,
  description,
  status,
  itemCount,
  onOpen,
}) => (
  <button
    type="button"
    onClick={onOpen}
    className="workspace-category-card flex w-full min-w-[260px] flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-slate-700 hover:bg-slate-900 sm:min-w-[280px] sm:p-5"
  >
    <div className="flex items-start gap-3">
      <span className="shrink-0 text-2xl" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="workspace-card-title text-base font-semibold text-white sm:text-lg">
          {title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>
          {typeof itemCount === "number" && itemCount > 0 ? (
            <span className="text-xs text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          ) : null}
        </div>
      </div>
    </div>

    <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
      {description}
    </p>

    <span className="mt-auto pt-4 text-sm font-medium text-cyan-400">
      Open →
    </span>
  </button>
);

export default WorkspaceCategoryCard;
