import React from "react";
import type { WorkspaceDashboardItem } from "../types/EngineeringWorkspaceDashboard";

const statusStyles: Record<
  NonNullable<WorkspaceDashboardItem["status"]>,
  string
> = {
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  beta: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "coming-soon": "border-slate-600 bg-slate-800/60 text-slate-400",
};

export interface WorkspaceListItemCardProps {
  title: string;
  description?: string;
  status?: WorkspaceDashboardItem["status"];
  badge?: string;
  icon?: string;
  actionLabel?: string;
  onClick?: () => void;
}

const WorkspaceListItemCard: React.FC<WorkspaceListItemCardProps> = ({
  title,
  description,
  status,
  badge,
  icon,
  actionLabel = "Open →",
  onClick,
}) => {
  const content = (
    <>
      <div className="flex items-start gap-2">
        {icon ? (
          <span className="shrink-0 text-lg" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="workspace-card-title font-medium text-slate-100">
            {title}
          </p>
          {(status || badge) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {status ? (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
                >
                  {status.replace("-", " ")}
                </span>
              ) : null}
              {badge ? (
                <span className="text-xs text-cyan-400/80">{badge}</span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {description ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      ) : null}

      {onClick ? (
        <span className="mt-3 text-sm font-medium text-cyan-400">
          {actionLabel}
        </span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex h-full min-h-[10.5rem] w-full min-w-[260px] flex-col rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-left transition hover:border-cyan-500/40 hover:bg-slate-900 sm:min-w-[280px] sm:px-4 sm:py-4"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 sm:px-4 sm:py-4">
      {content}
    </div>
  );
};

export default WorkspaceListItemCard;
